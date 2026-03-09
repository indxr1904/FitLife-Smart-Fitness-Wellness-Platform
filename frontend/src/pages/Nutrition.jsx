import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/api";

const Nutrition = () => {
  const [meals, setMeals] = useState({});
  const [totals, setTotals] = useState({ calories: 0, protein: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/diet`);
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
      } finally {
        setLoading(false);
      }
    };

    fetchDiets();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0b0f0c] min-h-screen flex items-center justify-center">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* Spinning ring */}
          <div style={{ position: "relative", width: "64px", height: "64px" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid #1e2d22",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid transparent",
                borderTopColor: "#00ff57",
                animation: "spin 1s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: "8px",
                borderRadius: "50%",
                border: "2px solid transparent",
                borderTopColor: "#9ca3af",
                animation: "spin 1.5s linear infinite reverse",
              }}
            />
            {/* Center dot */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#00ff57",
                animation: "pulse 1s ease-in-out infinite",
              }}
            />
          </div>

          {/* Text */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "600",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Loading
            </p>
            <p
              style={{
                color: "#4b5563",
                fontSize: "12px",
                letterSpacing: "0.1em",
                marginTop: "6px",
              }}
            >
              Please wait...
            </p>
          </div>

          {/* Bar */}
          <div
            style={{
              width: "120px",
              height: "2px",
              backgroundColor: "#1e2d22",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "40%",
                backgroundColor: "#00ff57",
                borderRadius: "999px",
                animation: "slide 1.2s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.8); } 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); } }
        @keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
      `}</style>
      </div>
    );
  }

  // Empty state
  if (!Object.keys(meals).length) {
    return (
      <div className="bg-[#0b0f0c] min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-400">No meals found.</p>
      </div>
    );
  }

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
