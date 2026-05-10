const Review = require("../models/Review");

exports.getReviews = async (req, res) => {
  const filter = req.query.monastery ? { monastery: req.query.monastery } : {};
  const reviews = await Review.find(filter).populate("user", "name email");
  res.json(reviews);
};

exports.createReview = async (req, res) => {
  const review = await Review.create({
    ...req.body,
    user: req.user._id,
  });
  res.status(201).json(review);
};
