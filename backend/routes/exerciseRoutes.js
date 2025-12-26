const express = require("express");
const Exercise = require("./../models/Exercise");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const exercise = await Exercise.find();
    res.status(200).json({
      status: "success",
      data: exercise,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  if (!exercise) {
    return res.status(404).json({ message: "Exercise not found..." });
  }
  res.status(200).json({
    status: "success",
    data: exercise,
  });
});

router.post("/", async (req, res) => {
  try {
    const { title, description, reps, sets, detail, videoURL } = req.body;
    const newExercise = await Exercise.create({
      title,
      description,
      reps,
      sets,
      detail,
      videoURL,
    });

    res.status(200).json({
      status: "success",
      data: newExercise,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!exercise) {
    return res.status(404).json({ message: "Exercise not found..." });
  }
  res.status(200).json({
    status: "success",
    data: exercise,
  });
});

router.delete("/:id", async (req, res) => {
  const exercise = await Exercise.findByIdAndDelete(req.params.id);
  if (!exercise) {
    return res.status(404).json({ message: "Exercise not found..." });
  }
  res.status(200).json({
    status: "success",
    data: null,
  });
});

module.exports = router;
