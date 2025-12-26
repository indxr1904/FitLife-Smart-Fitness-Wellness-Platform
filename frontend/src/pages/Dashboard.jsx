import { useEffect, useState } from "react";
import WorkoutDay from "./WorkoutDay";

const Dashboard = () => {
  const [todayPlan, setTodayPlan] = useState(null);
  const [profile, setProfile] = useState({});
  const [activeTab, setActiveTab] = useState("exercises");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:9000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:9000/api/users/today-plan", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setTodayPlan(data.schedule);
      } catch (error) {
        console.error("Today plan fetch error:", error);
      }
    };
    fetchPlan();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f0c] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.name}!
        </h1>
        <p className="text-gray-400 mb-8">Here’s your plan for today</p>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* TODAY WORKOUT */}
          <div className="bg-[#101410] border border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Today Workout</h2>

            {!todayPlan ? (
              <p className="text-gray-600">Please Choose a plan</p>
            ) : (
              <>
                <div className="flex justify-center mb-6 space-x-4">
                  <button
                    onClick={() => setActiveTab("exercises")}
                    className={`px-5 py-2 rounded-full font-semibold transition-all ${
                      activeTab === "exercises"
                        ? "bg-green-600"
                        : "bg-[#1a251a] text-gray-400 hover:text-white"
                    }`}
                  >
                    Exercises
                  </button>

                  <button
                    onClick={() => setActiveTab("diet")}
                    className={`px-5 py-2 rounded-full font-semibold transition-all ${
                      activeTab === "diet"
                        ? "bg-green-600"
                        : "bg-[#1a251a] text-gray-400 hover:text-white"
                    }`}
                  >
                    Diet Plan
                  </button>
                </div>

                {activeTab === "exercises" ? (
                  <WorkoutDay dayData={todayPlan} />
                ) : (
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-3">
                      Today’s Diet Plan
                    </h3>

                    {todayPlan?.diets?.length ? (
                      todayPlan.diets.map((diet, i) => (
                        <div
                          key={i}
                          className="p-4 bg-[#151b15] rounded-lg mb-3 border border-gray-800"
                        >
                          <h4 className="text-lg font-semibold capitalize">
                            {diet.mealType} – {diet.mealTime}
                          </h4>

                          {diet.dietId.map((d) => (
                            <div
                              key={d._id}
                              className="mt-3 p-3 bg-[#1e251e] rounded-md"
                            >
                              <p className="font-semibold text-white">
                                {d.items.join(", ")}
                              </p>
                              <p className="text-gray-400 text-sm">
                                Calories: {d.calories}
                              </p>
                              <p className="text-gray-400 text-sm">
                                Protein: {d.protein}
                              </p>
                              <p className="text-gray-400 text-sm">
                                Carbs: {d.carbs}
                              </p>
                              <p className="text-gray-400 text-sm">
                                Fats: {d.fats}
                              </p>
                              <p className="text-gray-400 mt-2 italic">
                                {d.purpose}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No diet schedule today</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT SIDE SECTIONS */}
          {/* <div className="space-y-8"> */}
          {/* TODAY'S FOCUS */}
          {/* <div className="bg-[#101410] border border-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">Today’s Focus</h2>
              <div className="space-y-2 text-gray-300">
                <p>
                  <span className="text-gray-400">Workout:</span> Upper Body
                  Strength
                </p>
                <p>
                  <span className="text-gray-400">Duration:</span> 45 Minutes
                </p>
                <p>
                  <span className="text-gray-400">Goal:</span> Muscle Building
                </p>
              </div>
            </div> */}

          {/* NEXT WORKOUT */}
          {/* <div className="bg-[#101410] border border-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">Up Next</h2>
              <p className="text-gray-300 mb-2">Tomorrow – Leg Day</p>
              <ul className="text-gray-400 list-disc list-inside">
                <li>Squats</li>
                <li>Lunges</li>
                <li>Calf Raises</li>
              </ul>
            </div> */}

          {/* RECOVERY TIP */}
          {/* <div className="bg-[#101410] border border-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">Recovery Tip</h2>
              <p className="text-gray-300">
                Stretch for 5–10 minutes post workout and drink at least 500ml
                of water to speed up muscle recovery.
              </p>
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
