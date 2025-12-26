const express = require("express");
const Progress = require("./../models/Progress");
const { prependListener } = require("../models/User");
const { authMiddleware } = require("./../middleware/authMiddleware");

const router = express.Router();

router.put("/", authMiddleware, async (req, res) => {
  try {
    const { exerciseName, timeSpent, isCompleted } = req.body;
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId, exerciseName });
    if (progress) {
      progress.timeSpent = timeSpent;
      progress.isCompleted = isCompleted;
      await progress.save();
    } else {
      progress = await Progress.create({
        userId,
        exerciseName,
        timeSpent,
        isCompleted,
      });
    }
    res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id });
    res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
