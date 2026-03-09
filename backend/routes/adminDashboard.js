const express = require("express");
const User = require("./../models/User");
const Diet = require("./../models/Diet");
const Exercise = require("../models/Exercise");
const Plan = require("../models/Plan");
const { authMiddleware, adminAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard/documents",
  authMiddleware,
  adminAuth,
  async (req, res) => {
    try {
      const user = await User.countDocuments();
      const diet = await Diet.countDocuments();
      const exercise = await Exercise.countDocuments();
      const plan = await Plan.countDocuments();

      return res.status(200).json({ user, diet, exercise, plan });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
);

module.exports = router;
