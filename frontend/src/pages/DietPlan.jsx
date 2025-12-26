import React from "react";

const DietPlan = ({ dayData }) => {
  const diets = dayData?.diets || [];

  return (
    <div className="bg-[#0b0f0c] border border-gray-700 rounded-lg p-6 mb-5 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-400">
        Weekly Diet Plan
      </h1>
      <p className="text-gray-300 text-center mb-8">
        Balanced nutrition for muscle recovery and sustained energy throughout
        the day.
      </p>

      <div className="space-y-6">
        {diets.map((diet, index) => (
          <div
            key={index}
            className="bg-[#111811] border border-[#1e2d22] rounded-xl p-5 shadow-lg hover:shadow-green-700/10 transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
              <h2 className="text-xl font-bold text-green-400">
                {diet.mealType}
              </h2>
              <p className="text-gray-400 text-sm">{diet.mealTime}</p>
            </div>

            <ul className="list-disc list-inside text-gray-300 space-y-1 mb-3">
              {diet.dietId?.length ? (
                diet.dietId.map((d, idx) => (
                  <li key={idx}>
                    {Array.isArray(d.items)
                      ? d.items.join(", ")
                      : d.items || "Unnamed diet item"}
                  </li>
                ))
              ) : (
                <li className="italic text-gray-500">No items listed.</li>
              )}
            </ul>

            {diet.dietId?.[0]?.calories && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-400 mb-3">
                <div>
                  <span className="font-semibold text-white">Calories:</span>{" "}
                  {diet.dietId[0].calories}
                </div>
                <div>
                  <span className="font-semibold text-white">Protein:</span>{" "}
                  {diet.dietId[0].protein}
                </div>
                <div>
                  <span className="font-semibold text-white">Carbs:</span>{" "}
                  {diet.dietId[0].carbs}
                </div>
                <div>
                  <span className="font-semibold text-white">Fats:</span>{" "}
                  {diet.dietId[0].fats}
                </div>
              </div>
            )}

            <p className="text-gray-400 italic text-sm">{diet.purpose}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DietPlan;
