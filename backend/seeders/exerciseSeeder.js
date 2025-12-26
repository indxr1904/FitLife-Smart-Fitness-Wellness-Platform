const mongoose = require("mongoose");
const Exercise = require("../models/Exercise");
const exercises = require("../data/exercise.json");

mongoose.connect(
  "mongodb+srv://inderjeet221777_db_user:ZKdjKr9jWbtGNb7B@cluster0.0huyloh.mongodb.net/?appName=Cluster0"
);

const seedExercises = async () => {
  try {
    await Exercise.deleteMany();
    await Exercise.insertMany(exercises);

    console.log("Exercises seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Exercise seeding failed:", error);
    process.exit(1);
  }
};

seedExercises();
