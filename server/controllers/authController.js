const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OtpToken = require("../models/OtpToken");
const { sendMail } = require("../config/mailer");
const { sendSms } = require("../config/sms");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isGuest: user.isGuest,
  cookieConsent: user.cookieConsent,
});

const getTokenUser = async (req) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return User.findById(decoded.id);
};

const makeOtp = () => String(Math.floor(100000 + Math.random() * 900000));

exports.signup = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = await User.create({
      name,
      email,
      phone,
      password: await bcrypt.hash(password, 10),
      role: "user",
    });

    res.json({
      msg: "Signup successful",
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: err.message || "Signup failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (!user.password) {
      return res.status(400).json({ msg: "Use social login for this account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.json({
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: err.message || "Login failed" });
  }
};

exports.socialLogin = async (req, res) => {
  const { name, email, provider, providerId } = req.body;
  if (!email || !provider) {
    return res.status(400).json({ msg: "Email and provider are required" });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || `${provider} User`,
        email,
        provider,
        googleId: provider === "google" ? providerId : undefined,
        githubId: provider === "github" ? providerId : undefined,
        role: "user",
      });
    } else {
      user.name = user.name || name;
      user.provider = user.provider || provider;
      if (provider === "google") user.googleId = user.googleId || providerId;
      if (provider === "github") user.githubId = user.githubId || providerId;
      await user.save();
    }

    res.json({
      msg: "Social login successful",
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Social login error:", err.message);
    res.status(500).json({ error: err.message || "Social login failed" });
  }
};

exports.guestAccess = async (req, res) => {
  try {
    const suffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const user = await User.create({
      name: "Guest Explorer",
      email: `guest_${suffix}@monastery360.local`,
      role: "guest",
      isGuest: true,
    });

    res.json({
      msg: "Guest session created",
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Guest access error:", err.message);
    res.status(500).json({ error: err.message || "Guest access failed" });
  }
};

exports.saveConsent = async (req, res) => {
  try {
    const user = await getTokenUser(req);
    if (!user) {
      return res.status(401).json({ msg: "Login or guest session required" });
    }

    user.cookieConsent = {
      analytics: Boolean(req.body.analytics),
      marketing: Boolean(req.body.marketing),
      accepted: true,
      acceptedAt: req.body.acceptedAt
        ? new Date(req.body.acceptedAt)
        : new Date(),
    };
    await user.save();

    res.json({
      msg: "Cookie consent saved",
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Cookie consent error:", err.message);
    res.status(500).json({ error: err.message || "Cookie consent save failed" });
  }
};

exports.requestOtp = async (req, res) => {
  const { email, phone, purpose = "signup" } = req.body;
  if (!email || !phone) {
    return res.status(400).json({ msg: "Email and mobile number are required" });
  }

  try {
    const emailOtp = makeOtp();
    const mobileOtp = makeOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await sendMail({
      to: email,
      subject: "Your Monastery360 Email OTP",
      text: `Your Monastery360 email OTP is ${emailOtp}. It expires in 5 minutes.`,
      html: `<h2>Monastery360 Email OTP</h2><p>Your email verification code is <strong>${emailOtp}</strong>.</p><p>This expires in 5 minutes.</p>`,
    });

    await sendSms({
      to: phone,
      body: `Monastery360 mobile OTP: ${mobileOtp}. It expires in 5 minutes.`,
    });

    await OtpToken.deleteMany({
      email,
      purpose,
      channel: { $in: ["email", "mobile"] },
    });

    await OtpToken.create({
      email,
      phone,
      channel: "email",
      otp: emailOtp,
      purpose,
      expiresAt,
    });

    await OtpToken.create({
      email,
      phone,
      channel: "mobile",
      otp: mobileOtp,
      purpose,
      expiresAt,
    });

    res.json({
      msg: "Email and mobile OTP sent successfully",
      resendAfter: 60,
    });
  } catch (err) {
    console.error("OTP request error:", err.message);
    res.status(500).json({ error: err.message || "Failed to send OTP" });
  }
};

exports.verifySignup = async (req, res) => {
  const { name, email, phone, password, emailOtp, mobileOtp } = req.body;
  if (!name || !email || !phone || !password || !emailOtp || !mobileOtp) {
    return res
      .status(400)
      .json({ msg: "All fields, email OTP and mobile OTP are required" });
  }

  try {
    const emailToken = await OtpToken.findOne({
      email,
      otp: emailOtp,
      purpose: "signup",
      channel: "email",
      used: false,
      expiresAt: { $gt: new Date() },
    });

    const mobileToken = await OtpToken.findOne({
      email,
      phone,
      otp: mobileOtp,
      purpose: "signup",
      channel: "mobile",
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!emailToken || !mobileToken) {
      return res.status(400).json({ msg: "Invalid or expired email/mobile OTP" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = await User.create({
      name,
      email,
      phone,
      password: await bcrypt.hash(password, 10),
      role: "user",
    });

    emailToken.used = true;
    mobileToken.used = true;
    await Promise.all([emailToken.save(), mobileToken.save()]);

    res.json({
      msg: "Signup verified",
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Verify signup error:", err.message);
    res.status(500).json({ error: err.message || "Verification failed" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err.message);
    res.status(500).json({ error: err.message || "Failed to fetch users" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!["guest", "user", "editor", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    res.json(user);
  } catch (err) {
    console.error("Update role error:", err.message);
    res.status(500).json({ error: err.message || "Failed to update role" });
  }
};
