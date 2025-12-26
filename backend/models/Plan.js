const mongoose = require("mongoose");

const exerciseScheduleSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
});

const dietScheduleSchema = new mongoose.Schema({
  dietId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Diet",
      required: true,
    },
  ],
  mealTime: {
    type: String,
  },
  mealType: {
    type: String,
  },
});

const daySchema = new mongoose.Schema({
  dayName: {
    type: String,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    required: true,
  },
  exercises: [exerciseScheduleSchema],
  diets: [dietScheduleSchema],
});

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    activeDays: [
      {
        type: String,
        enum: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      },
    ],
    schedule: [daySchema],
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    goal: {
      type: String,
      enum: ["weight loss", "muscle gain", "strength", "general fitness"],
      default: "general fitness",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
