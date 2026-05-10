const Image = require("../models/Image");

exports.getImages = async (req, res) => {
  const images = await Image.find({ isActive: true }).sort({ order: 1 });
  res.json(images);
};

exports.upsertImages = async (req, res) => {
  const { images = [] } = req.body;
  await Image.deleteMany({ section: "carousel" });
  const created = await Image.insertMany(
    images.map((image, order) => ({ ...image, order, section: "carousel" })),
  );
  res.json(created);
};

// UPLOAD IMAGE
exports.uploadImage = async (req, res) => {
  try {
    const { url, title, section, alt } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    // Get max order
    const maxOrder = await Image.findOne({ section }).sort({ order: -1 });
    const nextOrder = maxOrder ? maxOrder.order + 1 : 0;

    const image = new Image({
      url,
      title: title || "Untitled",
      section: section || "gallery",
      alt: alt || title,
      order: nextOrder,
      isActive: true,
    });

    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE IMAGE
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    await Image.findByIdAndDelete(id);
    res.json({ message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE IMAGE
exports.getImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET IMAGES BY SECTION
exports.getImagesBySection = async (req, res) => {
  try {
    const { section } = req.params;
    const images = await Image.find({ section, isActive: true }).sort({
      order: 1,
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
