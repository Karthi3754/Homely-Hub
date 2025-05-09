const express = require("express");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");
const propertyController = require("../controllers/propertyController");

const router = express.Router();

// PROPERTY ROUTES
router
  .route("/newAccommodation")
  .post(authController.protect, propertyController.createProperty);

router
  .route("/myAccommodation")
  .get(authController.isLoggedIn);

router
  .route("/logout")
  .get(authController.logout);

router
  .route("/updateMe")
  .patch(authController.protect, authController.updateMe);

router
  .route("/updateMyPassword")
  .patch(authController.protect, authController.updatePassword);

router
  .route("/signup")
  .post(authController.signup);

router
  .route("/resetPassword/:token")
  .post(authController.resetPassword);

router
  .route("/login")
  .post(authController.login);

router
  .route("/forgotPassword")
  .post(authController.forgotPassword);

// ✅ BOOKING ROUTES — POST method for /checkout-session
router
  .route("/checkout-session")
  .post(authController.protect, bookingController.getCheckOutSession);

router
  .route("/booking")
  .get(authController.protect, bookingController.getUserBookings);

router
  .route("/booking/:bookingId")
  .get(authController.protect, bookingController.getBookingDetails);

router
  .route("/booking/new")
  .post(authController.protect, bookingController.createBookings);

// USER PROPERTIES ROUTE
router
  .route("/me")
  .get(authController.protect, propertyController.getUsersProperties);

module.exports = router;
