const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  exerciseName: {
    type: String,
    required: true,
  },
  timeSpent: { type: Number, default: 0 }, // seconds
  isCompleted: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Progress", progressSchema);
