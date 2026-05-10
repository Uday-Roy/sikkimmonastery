const express = require("express");
const {
  getMonasteries,
  createMonastery,
  updateMonastery,
} = require("../controllers/monasteryController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMonasteries);
router.post("/", protect, allowRoles("admin", "editor"), createMonastery);
router.put("/:id", protect, allowRoles("admin", "editor"), updateMonastery);

module.exports = router;
