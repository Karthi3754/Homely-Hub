const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require('../utils/Email');
const crypto = require('crypto');
const cloudinary = require('../utils/Cloudinary');

// Helper function to create and send a JWT
const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

// Helper to filter allowed fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

// SIGN UP
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      avatar: {
        url: req.body.avatar || "https://t3.ftcdn.net/jpg/01/18/01/98/360_F_118019822_6CKXP6rXmVhDOzbXZlLqEM2ya4HhYzSV.jpg"
      }
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Please provide email and password");

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Incorrect email or password");
    }

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({ message: "Login unsuccessful" });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

// PROTECT ROUTES
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt && req.cookies.jwt !== "loggedout") {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new Error("You are not logged in! Please log in to get access.");
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      throw new Error("The user belonging to this token no longer exists.");
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new Error("User recently changed password. Please log in again.");
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
};

// UPDATE USER INFO (name, phone, avatar)
exports.updateMe = async (req, res) => {
  try {
    const filteredBody = filterObj(req.body, "name", "phoneNumber", "avatar");

    if (req.body.avatar !== undefined) {
      const uploadedImage = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        height: 150,
        crop: "scale",
        responsive_breakpoints: {
          create_derived: true,
          bytes_step: 20000,
          min_width: 200,
          max_width: 200
        }
      });

      filteredBody.avatar = {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url
      };
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
};

// UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      throw new Error("Your current password is wrong");
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ error: "There is no user with that email address." });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `http://localhost:3000/user/resetPassword/${resetToken}`;
  const htmlMessage = `
    <p>Forgot your password? Submit a PATCH request with your new password and passwordConfirm.</p>
    <a href="${resetURL}" style="
      display: inline-block; margin:10px; padding:10px;
      background-color: rgba(65, 60, 60, 0.5); border-radius:5px;
      text-decoration:none; color:white; font-size:20px">
      Reset Password
    </a>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 mins)",
      message: htmlMessage
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email"
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(400).json({ error: err.message });
    return next();
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error("Token is invalid or has expired");
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
    return next();
  }
};

// CHECK IF LOGGED IN
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);

      if (!currentUser || currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.status(200).json({ status: "success", user: currentUser });
      return next();
    }
  } catch (err) {
    return next();
  }

  next();
};