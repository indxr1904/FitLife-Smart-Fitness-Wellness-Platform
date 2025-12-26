const express = require("express");
const Plan = require("./../models/Plan");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      duration,
      activeDays,
      schedule,
      level,
      goal,
    } = req.body;

    const newPlan = await Plan.create({
      name,
      description,
      image,
      duration,
      activeDays,
      schedule,
      level,
      goal,
    });
    res.status(201).json({
      status: "success",
      data: newPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const plan = await Plan.find();
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json({
      status: "success",
      data: plan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate({
        path: "schedule.exercises.exerciseId",
        select: "title description reps sets detail videoURL",
      })
      .populate({
        path: "schedule.diets.dietId",
        select: "items calories protein carbs fats purpose",
      });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ status: "success", data: plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json({
      status: "success",
      data: plan,
    });
  } catch (error) {
    console.error("Error Updating plan", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/my-plan/:id", async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate("schedule.exercises.exerciseId")
      .populate("schedule.diets.dietId");

    if (!plan) {
      return res.json({ message: "Plan not found" });
    }

    const today = new Date()
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();

    const todaySchedule = plan.schedule.find(
      (day) => day.dayName.toLowerCase() === today
    );

    if (!todaySchedule) {
      return res.json({
        message: "No workouts for today",
        today,
        planName: plan.name,
        schedule: null,
      });
    }

    res.status(200).json({
      status: "success",
      today,
      planName: plan.name,
      schedule: todaySchedule,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
