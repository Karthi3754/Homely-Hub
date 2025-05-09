const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using SMTP credentials from environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
