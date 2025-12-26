const mongoose = require("mongoose");

const dietSchema = new mongoose.Schema({
  items: {
    type: [String],
    default: [],
  },
  calories: {
    type: Number,
  },
  protein: {
    type: String,
  },
  carbs: {
    type: String,
  },
  fats: {
    type: String,
  },
  purpose: {
    type: String,
  },
});

module.exports = mongoose.model("Diet", dietSchema);
