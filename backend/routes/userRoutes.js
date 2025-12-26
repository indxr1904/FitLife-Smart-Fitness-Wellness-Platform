const express = require("express");
const admin = require("./../firebaseAdmin");
const User = require("./../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./../middleware/authMiddleware");

const router = express.Router();

router.post("/google-login", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = await admin.auth().verifyIdToken(token);

    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      user = await User.create({
        uid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        photoURL: decoded.photoURL,
        provider: "google",
      });
    }
    const backendJwt = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Google login successful",
      token: backendJwt,
      user,
    });
  } catch (error) {
    console.error("Google login error", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/google-register", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = await admin.auth().verifyIdToken(token);

    let user = await User.findOne({ email: decoded.email });
    if (user)
      return res
        .status(400)
        .json({ message: "User already exists. Please login instead." });

    user = await User.create({
      uid: decoded.uid,
      name: decoded.name || decoded.email.split("@")[0],
      email: decoded.email,
      photoURL: decoded.picture,
      provider: "google",
    });

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Google registration successful",
      user,
      token: jwtToken,
    });
  } catch (error) {
    console.error("Google register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already Exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "local",
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({ message: "Signup Successful", user, token });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.provider === "google") {
      return res.status(400).json({ message: "Use google login" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/start-plan", authMiddleware, async (req, res) => {
  try {
    const { planId } = req.body;
    const user = req.user;

    if (!planId) {
      return res.status(400).json({
        status: "error",
        message: "planId is required",
      });
    }

    // If same plan is already active
    if (
      user.enrolledPlans.length > 0 &&
      user.enrolledPlans[0].toString() === planId
    ) {
      return res.json({
        status: "already_enrolled",
        message: "Plan already active",
      });
    }

    // 🔥 REPLACE OLD PLAN WITH NEW ONE
    user.enrolledPlans = [planId];
    await user.save();

    res.json({
      status: "success",
      message: "Plan started successfully",
      enrolledPlans: user.enrolledPlans,
    });
  } catch (error) {
    console.error("Start Plan Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/my-plans", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("enrolledPlans");
    res.json({
      status: "success",
      plans: user.enrolledPlans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/today-plan", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "enrolledPlans",
      populate: [
        { path: "schedule.exercises.exerciseId" },
        { path: "schedule.diets.dietId" },
      ],
    });

    if (!user.enrolledPlans || user.enrolledPlans.length === 0) {
      return res.json({ message: "User has not enrolled any plan" });
    }

    const activePlan = user.enrolledPlans[0];

    const today = new Date()
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();

    let todaySchedule = activePlan.schedule.find(
      (d) => d.dayName.toLowerCase() === today
    );

    // ✅ fallback
    if (!todaySchedule && activePlan.schedule.length > 0) {
      todaySchedule = activePlan.schedule[0];
    }

    res.json({
      status: "success",
      today,
      planId: activePlan._id,
      planName: activePlan.name,
      schedule: todaySchedule || null,
    });
  } catch (error) {
    console.error("Today Plan Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
