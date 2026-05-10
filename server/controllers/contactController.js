const { sendMail } = require("../config/mailer");

exports.sendContactMessage = async (req, res) => {
  const { name, email, subject = "New Contact Message", message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ msg: "Name, email and message are required" });
  }

  try {
    await sendMail({
      to: process.env.ADMIN_EMAIL || process.env.MAIL_USER,
      subject: `Monastery360: ${subject}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <h2>New Monastery360 Contact</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.json({ msg: "Message sent to admin" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
