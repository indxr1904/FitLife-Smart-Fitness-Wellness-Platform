const mongoose = require("mongoose");
const Plan = require("../models/Plan");
const Exercise = require("../models/Exercise");
const Diet = require("../models/Diet");
const plans = require("../data/plans.original.json");

mongoose.connect(
  "mongodb+srv://inderjeet221777_db_user:ZKdjKr9jWbtGNb7B@cluster0.0huyloh.mongodb.net/?appName=Cluster0"
);

const seedPlans = async () => {
  try {
    await Plan.deleteMany();

    const exercises = await Exercise.find();
    const diets = await Diet.find();

    const byTitle = (title) => exercises.find((e) => e.title === title)?._id;

    const breakfast = diets.filter((d) =>
      d.purpose.toLowerCase().includes("breakfast")
    );
    const lunch = diets.filter((d) =>
      d.purpose.toLowerCase().includes("lunch")
    );
    const dinner = diets.filter((d) =>
      d.purpose.toLowerCase().includes("dinner")
    );

    let b = 0,
      l = 0,
      d = 0;

    const finalPlans = plans.map((plan) => ({
      name: plan.name,
      description: plan.description,
      duration: plan.duration,
      image: plan.image,
      level: plan.level,
      goal: plan.goal,
      activeDays: plan.activeDays,
      schedule: plan.exerciseTitles.map((pair, idx) => ({
        dayName: plan.activeDays[idx],
        exercises: pair.map((t) => ({ exerciseId: byTitle(t), time: "" })),
        diets: [
          {
            dietId: breakfast.slice(b, b + 2).map((x) => x._id),
            mealTime: "8:00AM",
            mealType: "breakfast",
          },
          {
            dietId: lunch.slice(l, l + 1).map((x) => x._id),
            mealTime: "2:30PM",
            mealType: "lunch",
          },
          {
            dietId: dinner.slice(d, d + 2).map((x) => x._id),
            mealTime: "8:00PM",
            mealType: "dinner",
          },
        ],
      })),
    }));

    await Plan.insertMany(finalPlans);
    console.log("15 plans seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedPlans();
