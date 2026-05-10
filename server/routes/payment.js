// routes/payment.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const razorpay = require("../config/razorpay");
const Booking = require("../models/Booking");
const User = require("../models/User");

const normalizePaymentMethod = (method = "") => {
  if (method.includes("UPI")) return "UPI";
  if (method.includes("Net")) return "NetBanking";
  if (method.includes("Card") || method.includes("Debit")) return "Card";
  if (method.includes("Wallet")) return "Wallet";
  if (method.includes("Location")) return "PayAtLocation";
  return "Razorpay";
};

const getOptionalUser = async (req) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return User.findById(decoded.id);
  } catch (err) {
    return null;
  }
};

// Create Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, plan, guests, date } = req.body;

    if (!amount || !plan || !guests || !date) {
      return res
        .status(400)
        .json({ error: "Missing required fields: amount, plan, guests, date" });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.json({
        success: true,
        demo: true,
        orderId: `demo_order_${Date.now()}`,
        paymentId: `demo_payment_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: "INR",
        message:
          "Razorpay keys are not configured. Demo booking mode is enabled.",
      });
    }

    const options = {
      amount: Math.round(amount * 100), // convert ₹ to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan,
        guests,
        date,
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: err.message || "Failed to create order" });
  }
});

// Verify payment and create booking
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerName,
      customerEmail,
      customerPhone,
      plan,
      date,
      guests,
      amount,
      gst,
      paymentMethod,
    } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(400).json({
        success: false,
        error: "Razorpay secret is not configured on the server",
      });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment signature",
      });
    }

    const user = await getOptionalUser(req);

    // Create booking in database
    const booking = await Booking.create({
      user: user?._id || null,
      customerName,
      customerEmail,
      customerPhone,
      plan,
      date,
      guests: parseInt(guests),
      amount: Math.round(Number(amount) + Number(gst || 0)),
      gst: Math.round(gst),
      paymentMethod: normalizePaymentMethod(paymentMethod),
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentId: razorpay_payment_id,
      status: "completed",
    });

    res.json({
      success: true,
      message: "Payment verified and booking created",
      booking,
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    res
      .status(500)
      .json({ error: err.message || "Payment verification failed" });
  }
});

// Get payment status
router.post("/status", async (req, res) => {
  try {
    const { razorpay_payment_id } = req.body;

    if (!razorpay_payment_id) {
      return res.status(400).json({ error: "Payment ID required" });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    res.json({
      success: payment.status === "captured" || payment.status === "authorized",
      status: payment.status,
      payment,
    });
  } catch (err) {
    console.error("Payment status error:", err);
    res.status(500).json({ error: "Failed to fetch payment status" });
  }
});

module.exports = router;
