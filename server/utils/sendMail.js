import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME, // Sender email address (We will have to setup an SPA email in prod)
      pass: process.env.EMAIL_PASSWORD, // Gmail App Password (Replace with SPA email App Pass in prod)
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

export default sendMail;
