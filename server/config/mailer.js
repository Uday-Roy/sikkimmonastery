let nodemailer;

function getTransporter() {
  if (!nodemailer) nodemailer = require("nodemailer");

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || process.env.MAIL_USER,
      pass: process.env.EMAIL_PASS || process.env.MAIL_APP_PASSWORD,
    },
  });
}

async function sendMail({ to, subject, text, html, replyTo }) {
  const mailUser = process.env.EMAIL_USER || process.env.MAIL_USER;
  const mailPass = process.env.EMAIL_PASS || process.env.MAIL_APP_PASSWORD;
  if (!mailUser || !mailPass) {
    throw new Error("MAIL_USER/EMAIL_USER and MAIL_APP_PASSWORD/EMAIL_PASS are required for email");
  }

  return getTransporter().sendMail({
    from: `"Monastery360" <${mailUser}>`,
    to,
    subject,
    text,
    html,
    replyTo,
  });
}

module.exports = { sendMail };
