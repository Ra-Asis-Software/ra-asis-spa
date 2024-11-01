const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME, // Sender email address (We will have to setup email ya SPA for this)
      pass: process.env.EMAIL_PASSWORD, // Email App password (using my Gmail App Password for testing)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: options.email, // Recipient email
    subject: options.subject, // Email subject
    html: options.message, // Email content in HTML format
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;