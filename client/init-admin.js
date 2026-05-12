#!/usr/bin/env node

/**
 * 🏛️ MONASTERY360 - ADMIN SETUP SCRIPT
 * Quickly initialize admin accounts and test data
 *
 * Usage: node server/init-admin.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../server/models/User");
const Monastery = require("../server/models/Monastery");
const Image = require("../server/models/Image");
const Testimonial = require("../server/models/Testimonial");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@monastery360.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin@123";
const ADMIN_NAME = "Admin User";

async function initializeAdmin() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected\n");

    // Step 1: Create Admin User
    console.log("👤 Creating Admin User...");
    let adminUser = await User.findOne({ email: ADMIN_EMAIL });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      adminUser = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log("   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!\n");
    } else {
      console.log(`✅ Admin already exists: ${ADMIN_EMAIL}\n`);
    }

    // Step 2: Check if data exists
    const monasteryCount = await Monastery.countDocuments();
    const imageCount = await Image.countDocuments();
    const testimonialCount = await Testimonial.countDocuments();

    console.log("📊 Current Data:");
    console.log(`   Monasteries: ${monasteryCount}`);
    console.log(`   Images: ${imageCount}`);
    console.log(`   Testimonials: ${testimonialCount}\n`);

    // Step 3: Add sample data if empty
    if (monasteryCount === 0) {
      console.log("📍 Adding sample monasteries...");
      const sampleMonasteries = [
        {
          name: "Rumtek Monastery",
          region: "Sikkim",
          location: "Gangtok, Sikkim",
          yearBuilt: 1960,
          sect: "Tibetan Buddhist",
          history:
            "The palace monastery of the Karmapa and one of the most important Buddhist pilgrimage sites in India.",
          entry: "Free Entry",
          timings: "6:00 AM - 5:00 PM",
          altitude: "5200 ft",
        },
        {
          name: "Kanchendzonga Monastery",
          region: "Sikkim",
          location: "Pelling, West Sikkim",
          yearBuilt: 1721,
          sect: "Nyingma School",
          history:
            "Ancient monastery with breathtaking views of Kanchendzonga.",
          entry: "Donation",
          timings: "7:00 AM - 6:00 PM",
          altitude: "7300 ft",
        },
      ];

      await Monastery.insertMany(sampleMonasteries);
      console.log(`✅ Added ${sampleMonasteries.length} sample monasteries\n`);
    }

    console.log("✨ Admin initialization complete!\n");
    console.log("🚀 Next steps:");
    console.log(
      //  `   1. Login to admin panel at: https://sikkimmonastery.vercel.app/admin.html`,
      `   1. Login to admin panel at: https://sikkimmonastery.udayroy.in/admin.html`,
    );
    console.log(`   2. Email: ${ADMIN_EMAIL}`);
    console.log(`   3. Password: ${ADMIN_PASSWORD}`);
    console.log("\n⚠️  Remember to change the password in production!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Check for required environment variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ Missing required environment variables:");
  console.error("   - MONGO_URI");
  console.error("   - JWT_SECRET");
  console.error("\nPlease set these in your .env file");
  process.exit(1);
}

initializeAdmin();
