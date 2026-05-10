const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "editor") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Apply auth middleware to all admin routes
router.use(protect);
router.use(adminOnly);

// ============ CONTENT ROUTES ============
router.get("/content/:section", adminController.getContent);
router.patch("/content/:section/:key", adminController.updateContent);
router.delete("/content/:id", adminController.deleteContent);
router.post("/content/bulk", adminController.bulkUpdateContent);

// ============ TESTIMONIALS ROUTES ============
router.get("/testimonials", adminController.getTestimonials);
router.post("/testimonials", adminController.createTestimonial);
router.patch("/testimonials/:id", adminController.updateTestimonial);
router.delete("/testimonials/:id", adminController.deleteTestimonial);

// ============ USERS MANAGEMENT ============
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);

// ============ DASHBOARD ============
router.get("/stats", adminController.getDashboardStats);

// ============ DATA EXPORT ============
router.get("/export", adminController.exportData);

module.exports = router;
