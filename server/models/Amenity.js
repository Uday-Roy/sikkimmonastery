const mongoose = require("mongoose");

const amenitySchema = new mongoose.Schema(
  {
    monastery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monastery",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "restaurant",
        "hotel",
        "shop",
        "travel",
        "grocery",
        "hospital",
        "atm",
      ],
      required: true,
    },
    name: { type: String, required: true },
    description: String,
    distance: Number, // in km
    rating: { type: Number, default: 0 },
    phone: String,
    address: String,
    website: String,
    openingHours: String,
    priceRange: {
      type: String,
      enum: ["budget", "moderate", "premium"],
      default: "moderate",
    },
    cuisineType: String, // for restaurants
    hotelType: String, // for hotels (luxury, budget, mid-range)
    image: String,
    reviews: [
      {
        user: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now },
      },
    ],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number], // [lng, lat]
    },
  },
  { timestamps: true },
);

amenitySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Amenity", amenitySchema);
