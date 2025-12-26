const express = require("express");
const Diet = require("./../models/Diet");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const diet = await Diet.find();
    res.status(200).json({
      status: "success",
      data: diet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const diet = await Diet.findById(req.params.id);
  if (!diet) {
    return res.status(404).json({ message: "Diet not found..." });
  }
  res.status(200).json({
    status: "success",
    data: diet,
  });
});

router.post("/", async (req, res) => {
  try {
    const { time, meal, items, calories, protein, carbs, fats, purpose } =
      req.body;
    const newDiet = await Diet.create({
      time,
      meal,
      items,
      calories,
      protein,
      carbs,
      fats,
      purpose,
    });
    res.status(200).json({
      status: "success",
      data: newDiet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const diet = await Diet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!diet) {
      return res.status(404).json({ message: "Diet not found..." });
    }
    res.status(200).json({
      status: "success",
      data: diet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  const diet = await Diet.findByIdAndDelete(req.params.id);
  if (!diet) {
    return res.status(404).json({ message: "Diet not found..." });
  }
  res.status(200).json({
    status: "success",
    data: null,
  });
});

module.exports = router;
