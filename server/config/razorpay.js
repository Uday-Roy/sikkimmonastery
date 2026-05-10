// config/razorpay.js
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_demo_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "demo_secret",
});

module.exports = razorpay;
