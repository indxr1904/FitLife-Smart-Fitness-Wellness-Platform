import React, { useEffect, useState } from "react";
import WorkoutDay from "./WorkoutDay";
import DietPlan from "./DietPlan";
import { useParams } from "react-router-dom";

const WeeklyWorkout = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [openDay, setOpenDay] = useState(null);
  const [activeTabs, setActiveTabs] = useState([]);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(`http://localhost:9000/api/admin/plan/${id}`);
        const data = await res.json();
        setPlan(data.data);
        setActiveTabs(data.data.schedule.map(() => "exercises"));
      } catch (err) {
        console.error("Error fetching plan:", err);
      }
    };
    fetchPlan();
  }, [id]);

  const toggleDay = (dayIndex) => {
    setOpenDay(openDay === dayIndex ? null : dayIndex);
  };

  const setTabForDay = (index, tab) => {
    setActiveTabs((prev) => {
      const updated = [...prev];
      updated[index] = tab;
      return updated;
    });
  };

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading plan...
      </div>
    );
  }

  return (
    <div className="text-white px-3 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          {plan.name}
        </h1>

        <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-4xl mx-auto">
          {plan.description}
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-full sm:max-w-5xl lg:max-w-6xl mb-15 mx-auto">
        {plan.schedule.map((day, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-xl mb-6 overflow-hidden bg-[#0b0f0c]"
          >
            {/* DAY HEADER */}
            <button
              onClick={() => toggleDay(index)}
              className="w-full flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-[#121a13] hover:bg-[#1a251a]"
            >
              <span className="font-semibold capitalize">{day.dayName}</span>
              <span className="text-green-400">
                {openDay === index ? "▲" : "▼"}
              </span>
            </button>

            {/* DAY CONTENT */}
            {openDay === index && (
              <div className="p-4 sm:p-6 border-t border-gray-700">
                <div className="flex justify-center flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => setTabForDay(index, "exercises")}
                    className={`px-5 py-2 rounded-full font-semibold text-sm sm:text-base transition ${
                      activeTabs[index] === "exercises"
                        ? "bg-green-600 text-black"
                        : "bg-[#1a251a] text-gray-400 hover:text-white"
                    }`}
                  >
                    Exercises
                  </button>

                  <button
                    onClick={() => setTabForDay(index, "diet")}
                    className={`px-5 py-2 rounded-full font-semibold text-sm sm:text-base transition ${
                      activeTabs[index] === "diet"
                        ? "bg-green-600 text-black"
                        : "bg-[#1a251a] text-gray-400 hover:text-white"
                    }`}
                  >
                    Diet Plan
                  </button>
                </div>

                {activeTabs[index] === "exercises" && (
                  <WorkoutDay dayData={day} />
                )}

                {activeTabs[index] === "diet" && <DietPlan dayData={day} />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyWorkout;
