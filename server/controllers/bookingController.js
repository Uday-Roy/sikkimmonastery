const Booking = require("../models/Booking");

exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate(
    "monastery",
  );
  res.json(bookings);
};

exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      user: req.user._id,
      status: "pending",
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create booking from payment form (guest or user)
exports.createPaymentBooking = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      plan,
      date,
      guests,
      amount,
      gst,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      isGuest,
    } = req.body;

    // Verify required fields
    if (
      !customerName ||
      !customerEmail ||
      !plan ||
      !date ||
      !guests ||
      !amount
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = await Booking.create({
      customerName,
      customerEmail,
      customerPhone,
      plan,
      date,
      guests,
      amount,
      gst: gst || 0,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: razorpayPaymentId ? "completed" : "pending",
      user: req.user ? req.user._id : null,
      monastery: null,
    });

    res.status(201).json({
      success: true,
      booking,
      message: "Booking created successfully!",
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
