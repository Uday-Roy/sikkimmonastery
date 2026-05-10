const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ["hero", "about", "testimonial", "footer", "contact", "settings"],
      required: true,
    },
    key: String, // e.g., "title", "description", "image"
    value: mongoose.Schema.Types.Mixed, // Can be string, number, object, array
    type: {
      type: String,
      enum: ["text", "image", "url", "object", "array"],
      default: "text",
    },
    metadata: {
      alt: String,
      order: Number,
      isActive: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Content", contentSchema);
