import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    // Replace with mailgun
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME, // Sender email address (We will have to setup an SPA email in prod)
      pass: process.env.EMAIL_PASSWORD, // Gmail App Password (Replace with SPA email App Pass in prod)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: options.email,
    subject: options.subject, // Email subject
    html: options.message, // Email content in HTML format
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

export default sendMail;
