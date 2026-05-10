const Content = require("../models/Content");
const Testimonial = require("../models/Testimonial");
const User = require("../models/User");
const Monastery = require("../models/Monastery");
const Image = require("../models/Image");

// ============ CONTENT MANAGEMENT ============

// Get all content for a section
exports.getContent = async (req, res) => {
  try {
    const { section } = req.params;
    const content = await Content.find({ section, "metadata.isActive": true });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update or create content
exports.updateContent = async (req, res) => {
  try {
    const { section, key } = req.params;
    const { value, type, metadata } = req.body;

    const content = await Content.findOneAndUpdate(
      { section, key },
      { value, type, metadata },
      { upsert: true, new: true },
    );

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete content
exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    await Content.findByIdAndDelete(id);
    res.json({ message: "Content deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ TESTIMONIALS ============

// Get all testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .populate("monastery", "name")
      .sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, email, rating, text, monastery, image } = req.body;

    const testimonial = new Testimonial({
      name,
      email,
      rating,
      text,
      monastery,
      image,
      isApproved: true, // Admin can auto-approve
    });

    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await Testimonial.findByIdAndDelete(id);
    res.json({ message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ USERS MANAGEMENT ============

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!["user", "editor", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ DASHBOARD STATS ============

exports.getDashboardStats = async (req, res) => {
  try {
    const monasteryCount = await Monastery.countDocuments();
    const userCount = await User.countDocuments();
    const testimonialCount = await Testimonial.countDocuments();
    const imageCount = await Image.countDocuments();

    res.json({
      monasteries: monasteryCount,
      users: userCount,
      testimonials: testimonialCount,
      images: imageCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ BULK OPERATIONS ============

// Update multiple content items
exports.bulkUpdateContent = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, value }

    const promises = updates.map((item) =>
      Content.findByIdAndUpdate(item.id, { value: item.value }, { new: true }),
    );

    const results = await Promise.all(promises);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all data
exports.exportData = async (req, res) => {
  try {
    const [monasteries, testimonials, users, images, content] =
      await Promise.all([
        Monastery.find(),
        Testimonial.find(),
        User.find().select("-password"),
        Image.find(),
        Content.find(),
      ]);

    const exportData = {
      monasteries,
      testimonials,
      users,
      images,
      content,
      exportedAt: new Date(),
    };

    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
