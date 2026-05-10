const express = require("express");
const {
  getMyBookings,
  createBooking,
  createPaymentBooking,
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// User bookings
router.get("/mine", protect, getMyBookings);
router.post("/", protect, createBooking);

// Payment booking (guest or user)
router.post("/payment", createPaymentBooking);

// Admin routes
router.get("/admin/all", protect, getAllBookings);
router.patch("/admin/:id/status", protect, updateBookingStatus);

module.exports = router;
