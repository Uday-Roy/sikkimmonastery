const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    title: String,
    url: { type: String, required: true },
    alt: String,
    section: { type: String, default: "carousel" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Image", imageSchema);
