const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

// Initialize app BEFORE connecting to DB
const app = express();

// app.use(cors());
app.use(
  cors({
    origin: "https://sikkimmonastery.vercel.app",
    credentials: true,
  }),
);
app.use(express.json());

// Connect to DB with error handling
const connectDB = async () => {
  try {
    const mongoose = require("mongoose");
    // await mongoose.connect(process.env.MONGO_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    return true;
  } catch (error) {
    console.log("⚠️  MongoDB Connection Error:", error.message);
    console.log(
      "⚠️  Server will run without database. Using local storage simulation.",
    );
    return false;
  }
};

connectDB();

// Serve static files from client folder
app.use(express.static(path.join(__dirname, "../client")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/monasteries", require("./routes/monasteryRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/images", require("./routes/imageRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/payment", require("./routes/payment"));

app.get("/", (req, res) => {
  res.send("🏔️ Monastery360 API Running 🚀");
});

// Google OAuth login setup
const passport = require("passport");
require("./config/passport");

app.use(passport.initialize());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // ✅ create token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ send token to frontend
    const qs = new URLSearchParams({
      token,
      name: req.user.name || "Google User",
      email: req.user.email || "",
      role: req.user.role || "user",
    });
    res.redirect(
      `https://sikkimmonastery.vercel.app/index.html?${qs.toString()}`,
    );
    //res.redirect(`http://127.0.0.1:5500/client/index.html?${qs.toString()}`);
  },
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: err.message });
});

console.log("✅ JWT_SECRET configured:", !!process.env.JWT_SECRET);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🏛️  Monastery360 Server running on PORT ${PORT}`);
  // console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`📡 API: https://sikkimmonastery-production.up.railway.app`);
  console.log(`🔐 JWT configured: ${!!process.env.JWT_SECRET}`);
  console.log(
    `📧 Email service: ${process.env.EMAIL_USER || process.env.MAIL_USER ? "✅ Configured" : "⚠️  Not configured"}`,
  );
  console.log(
    `📱 SMS service: ${process.env.TWILIO_SID && process.env.TWILIO_AUTH && process.env.TWILIO_PHONE ? "✅ Configured" : "⚠️  Not configured"}\n`,
  );
});

// *** new server.js backend and frontend implemeted from online serevr
