const express = require("express");
const {
  getImages,
  upsertImages,
  uploadImage,
  deleteImage,
  getImage,
  getImagesBySection,
} = require("../controllers/imageController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getImages);
router.get("/:id", getImage);
router.get("/section/:section", getImagesBySection);

// Admin/Editor routes
router.post("/upload", protect, allowRoles("admin", "editor"), uploadImage);
router.delete("/:id", protect, allowRoles("admin", "editor"), deleteImage);
router.put("/", protect, allowRoles("admin", "editor"), upsertImages);

module.exports = router;
