const express = require("express");
const User = require("./../models/User");
const { authMiddleware, adminAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// GET all users with stats
router.get("/all", authMiddleware, adminAuth, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    const total = users.length;
    const googleUsers = users.filter((u) => u.provider === "google").length;
    const localUsers = users.filter((u) => u.provider === "local").length;
    const adminUsers = users.filter((u) => u.isAdmin === true).length;

    res.status(200).json({
      stats: {
        total,
        google: googleUsers,
        local: localUsers,
        admins: adminUsers,
      },
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET single user by ID
router.get("/:id", authMiddleware, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT update any user by ID
router.put("/:id", authMiddleware, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin ?? user.isAdmin;

    const updated = await user.save();
    res.status(200).json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      isAdmin: updated.isAdmin,
      provider: updated.provider,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE any user by ID
router.delete("/:id", authMiddleware, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    await user.deleteOne();
    res
      .status(200)
      .json({ message: "User deleted successfully", deletedId: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH toggle admin role
router.patch(
  "/:id/toggle-admin",
  authMiddleware,
  adminAuth,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user._id.toString() === req.user._id.toString()) {
        return res
          .status(400)
          .json({ message: "Cannot change your own admin status" });
      }

      user.isAdmin = !user.isAdmin;
      await user.save();

      res.status(200).json({
        message: `User is now ${user.isAdmin ? "an admin" : "a regular user"}`,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
);

module.exports = router;
