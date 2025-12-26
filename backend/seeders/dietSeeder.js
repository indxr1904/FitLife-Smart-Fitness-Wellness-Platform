const mongoose = require("mongoose");
const Diet = require("../models/Diet");
const diets = require("../data/diets.json");

mongoose.connect(
  "mongodb+srv://inderjeet221777_db_user:ZKdjKr9jWbtGNb7B@cluster0.0huyloh.mongodb.net/?appName=Cluster0"
);

const seedDiets = async () => {
  try {
    await Diet.deleteMany();
    await Diet.insertMany(diets);

    console.log("Diets seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Diet seeding failed:", error);
    process.exit(1);
  }
};

seedDiets();
