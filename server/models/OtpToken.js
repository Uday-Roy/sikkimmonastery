const mongoose = require("mongoose");

const otpTokenSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    phone: { type: String, index: true },
    channel: {
      type: String,
      enum: ["email", "mobile"],
      default: "email",
      index: true,
    },
    otp: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["signup", "login", "password-reset"],
      default: "signup",
    },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    used: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("OtpToken", otpTokenSchema);
