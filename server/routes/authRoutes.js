const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  requestOtp,
  verifySignup,
  guestAccess,
  saveConsent,
  socialLogin,
  getAllUsers,
  updateUserRole,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/request-otp", requestOtp);
router.post("/verify-signup", verifySignup);
router.post("/guest", guestAccess);
router.post("/save-consent", saveConsent);
router.post("/social-login", socialLogin);

// Admin routes
router.get("/all-users", protect, getAllUsers);
router.patch("/update-user-role", protect, updateUserRole);

module.exports = router;
