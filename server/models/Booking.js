const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    monastery: { type: mongoose.Schema.Types.ObjectId, ref: "Monastery" },
    plan: { type: String, required: true },
    date: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    amount: Number,
    gst: Number,
    paymentMethod: {
      type: String,
      enum: [
        "UPI",
        "Card",
        "NetBanking",
        "Wallet",
        "PayAtLocation",
        "Razorpay",
      ],
      default: "Card",
    },
    paymentId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    notes: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
