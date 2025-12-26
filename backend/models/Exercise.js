const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  reps: {
    type: Number,
  },
  sets: {
    type: Number,
  },
  detail: {
    type: String,
  },
  videoURL: {
    type: String,
  },
});

module.exports = mongoose.model("Exercise", exerciseSchema);
