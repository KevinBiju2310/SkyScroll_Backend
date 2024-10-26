const nodemailer = require("nodemailer");
const otpEmailTemplate = require("../utils/otpEmailTemplate");
const passwordResetEmailTemplate = require("../utils/passwordResetEmailTemplate");

const sendEmail = async (to, subject, type, data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let htmlContent;
  if (type === "otp") {
    htmlContent = otpEmailTemplate(data);
  } else if (type === "passwordReset") {
    htmlContent = passwordResetEmailTemplate(data);
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
