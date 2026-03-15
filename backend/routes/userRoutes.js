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

// router.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     let userExists = await User.findOne({ email });
//     if (userExists)
//       return res.status(400).json({ message: "User already Exists" });
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       provider: "local",
//     });
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });
//     res.status(201).json({ message: "Signup Successful", user, token });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (user.provider === "google") {
//       return res.status(400).json({ message: "Use google login" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid password" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });
//     res.json({ message: "Login successful", token, user });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// Helper
const isAllowedEmail = (email) =>
  /@(gmail\.com|hotmail\.com|hotmail\.co\.uk|outlook\.com)$/i.test(email);
router.post("/signup", async (req, res) => {
  const { name, password } = req.body;
  const email = req.body.email?.trim().toLowerCase();
  // Required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  // Name min length
  if (name.trim().length < 2) {
    return res
      .status(400)
      .json({ message: "Name must be at least 2 characters" });
  }

  // Email provider
  if (!isAllowedEmail(email)) {
    return res
      .status(400)
      .json({ message: "Only Gmail and Hotmail addresses are accepted" });
  }

  // Password strength
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    let userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

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

    // Required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Email provider
    if (!isAllowedEmail(email)) {
      return res
        .status(400)
        .json({ message: "Only Gmail and Hotmail addresses are accepted" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.provider === "google") {
      return res.status(400).json({ message: "Use Google login" });
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

    const todaySchedule = activePlan.schedule.find(
      (d) => d.dayName.toLowerCase() === today,
    );

    // No fallback — if today isn't in the schedule, it's a rest day
    res.json({
      status: "success",
      today,
      planId: activePlan._id,
      planName: activePlan.name,
      schedule: todaySchedule || null, // null triggers rest day on frontend
    });
  } catch (error) {
    console.error("Today Plan Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/unenroll-plan", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (!user.enrolledPlans || user.enrolledPlans.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No active plan to unenroll from",
      });
    }

    user.enrolledPlans = user.enrolledPlans.filter(
      (planId) => planId.toString() !== req.body.planId,
    );

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Plan unenrolled successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server Error" });
  }
});

module.exports = router;
