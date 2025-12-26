import React, { useEffect, useState } from "react";

const Nutrition = () => {
  const [meals, setMeals] = useState({});
  const [totals, setTotals] = useState({ calories: 0, protein: 0 });

  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/admin/diet");
        const data = await res.json();

        const grouped = {};
        let totalCalories = 0;
        let totalProtein = 0;

        data.data.forEach((diet) => {
          const key = diet.purpose.toLowerCase();
          if (!grouped[key]) grouped[key] = [];

          grouped[key].push(diet);
          totalCalories += diet.calories;
          totalProtein += parseInt(diet.protein);
        });

        setMeals(grouped);
        setTotals({ calories: totalCalories, protein: totalProtein });
      } catch (err) {
        console.error("Failed to load diets", err);
      }
    };

    fetchDiets();
  }, []);

  return (
    <div className="bg-[#0b0f0c] text-white px-4 sm:px-6 lg:px-10 pt-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Daily Meal Plan</h1>
        <p className="text-gray-400 mb-8">
          Track your meals and nutrition for today.
        </p>

        {/* MEALS */}
        {Object.entries(meals).map(([mealType, items]) => (
          <div key={mealType} className="mb-10">
            <h2 className="text-lg sm:text-xl font-bold capitalize mb-4">
              {mealType}
            </h2>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#111811] border border-[#1e2d22] rounded-lg p-4"
                >
                  <h3 className="font-semibold text-base sm:text-lg">
                    {item.items.join(", ")}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {item.calories} calories · {item.protein} protein ·{" "}
                    {item.carbs} carbs · {item.fats} fats
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* TOTALS */}
        <div className="mt-10 space-y-2 mb-10 text-sm sm:text-base">
          <p>
            <span className="font-bold">Total Calories:</span> {totals.calories}
          </p>
          <p>
            <span className="font-bold">Total Protein:</span> {totals.protein}g
          </p>
        </div>

        {/* CTA */}
        {/* <div className="flex justify-end mt-10">
          <button className="bg-[#00ff57] hover:bg-[#00e14f] text-black font-semibold px-6 py-2 rounded-md shadow-md">
            Customize Diet Plan
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Nutrition;
