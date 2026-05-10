const Monastery = require("../models/Monastery");

exports.getMonasteries = async (req, res) => {
  const monasteries = await Monastery.find().sort({ createdAt: -1 });
  res.json(monasteries);
};

exports.createMonastery = async (req, res) => {
  const monastery = await Monastery.create(req.body);
  res.status(201).json(monastery);
};

exports.updateMonastery = async (req, res) => {
  const monastery = await Monastery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!monastery) return res.status(404).json({ msg: "Monastery not found" });
  res.json(monastery);
};
