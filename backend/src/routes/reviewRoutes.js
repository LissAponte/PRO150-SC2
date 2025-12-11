const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const StudySpace = require("../models/StudySpace");
const { protect } = require("../middleware/authMiddleware");

// Recalculate study space average rating
async function updateAverage(studySpaceId) {
  const reviews = await Review.find({ studySpaceId });

  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

  await StudySpace.findByIdAndUpdate(studySpaceId, {
    rating: avg,
    reviewCount: reviews.length,
  });
}

/* ---------------------------------------
   Create Review
----------------------------------------- */
router.post("/", protect, async (req, res) => {
  try {
    const { studySpaceId, rating, comment } = req.body;

    const review = await Review.create({
      studySpaceId,
      user: req.user._id,
      rating,
      comment,
    });

    await updateAverage(studySpaceId);

    res.status(201).json(review);
  } catch (err) {
    console.error("Create review error:", err);
    res.status(500).json({ message: "Error creating review" });
  }
});

/* ---------------------------------------
   Get all reviews for a study space
----------------------------------------- */
router.get("/:studySpaceId", async (req, res) => {
  try {
    const reviews = await Review.find({
      studySpaceId: req.params.studySpaceId,
    }).populate("user", "name");

    res.json(reviews);
  } catch (err) {
    console.error("Read reviews error:", err);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

/* ---------------------------------------
   Delete review
----------------------------------------- */
router.delete("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const studySpaceId = review.studySpaceId;

    await review.deleteOne();

    await updateAverage(studySpaceId);

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ message: "Error deleting review" });
  }
});

module.exports = router;
