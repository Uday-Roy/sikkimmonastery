let twilioClient;

function getSmsClient() {
  const sid = process.env.TWILIO_SID;
  const auth = process.env.TWILIO_AUTH;

  if (!sid || !auth || !process.env.TWILIO_PHONE) {
    throw new Error("TWILIO_SID, TWILIO_AUTH and TWILIO_PHONE are required for mobile OTP");
  }

  if (!twilioClient) {
    const twilio = require("twilio");
    twilioClient = twilio(sid, auth);
  }

  return twilioClient;
}

async function sendSms({ to, body }) {
  return getSmsClient().messages.create({
    from: process.env.TWILIO_PHONE,
    to,
    body,
  });
}

module.exports = { sendSms };
