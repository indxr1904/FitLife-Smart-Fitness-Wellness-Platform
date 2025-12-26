const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  uid: { type: String },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String },
  isAdmin: { type: Boolean, default: false },
  photoURL: { type: String },
  provider: { type: String, default: "local" },

  enrolledPlans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
  ],
  progress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
