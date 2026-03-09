import { useEffect, useState } from "react";
import WorkoutDay from "./WorkoutDay";
import { API_BASE_URL } from "../../api/api";

const Dashboard = () => {
  const [todayPlan, setTodayPlan] = useState(null);
  const [profile, setProfile] = useState({});
  const [activeTab, setActiveTab] = useState("exercises");
  const [loading, setLoading] = useState(true);
  const [plans] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
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

        const res = await fetch(`${API_BASE_URL}/api/users/today-plan`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setTodayPlan(data.schedule);
      } catch (error) {
        console.error("Today plan fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0b0f0c] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-[#1e2d22] rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-[#00ff57] rounded-full animate-spin" />
            <div className="absolute inset-2 border-2 border-transparent border-t-gray-400 rounded-full animate-spin" />

            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#00ff57] rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>

          <div className="text-center">
            <p className="text-white font-semibold tracking-widest uppercase">
              Loading
            </p>
            <p className="text-gray-500 text-sm mt-1">Please wait...</p>
          </div>

          <div className="w-32 h-[2px] bg-[#1e2d22] rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-[#00ff57] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!plans) {
    return (
      <div className="bg-[#0b0f0c] min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-400">No Exercise for today.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f0c] text-white px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {profile?.name}!
          </h1>

          <p className="text-gray-400 mt-1 text-sm sm:text-base">
            Here’s your plan for today
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* TODAY WORKOUT CARD */}
          <div className="bg-[#101410] border border-gray-800 rounded-xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">
              Today Workout
            </h2>

            {!todayPlan ? (
              <p className="text-gray-500">Please Choose a plan</p>
            ) : (
              <>
                {/* TABS */}
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
                  <button
                    onClick={() => setActiveTab("exercises")}
                    className={`px-5 py-2 rounded-full font-semibold transition ${
                      activeTab === "exercises"
                        ? "bg-[#00ff57] text-black"
                        : "bg-[#1a251a] text-gray-400 hover:text-white"
                    }`}
                  >
                    Exercises
                  </button>

                  <button
                    onClick={() => setActiveTab("diet")}
                    className={`px-5 py-2 rounded-full font-semibold transition ${
                      activeTab === "diet"
                        ? "bg-[#00ff57] text-black"
                        : "bg-[#1a251a] text-gray-400 hover:text-white"
                    }`}
                  >
                    Diet Plan
                  </button>
                </div>

                {/* EXERCISE TAB */}
                {activeTab === "exercises" ? (
                  <WorkoutDay dayData={todayPlan} />
                ) : (
                  <div className="mt-2">
                    <h3 className="text-lg sm:text-xl font-semibold mb-5">
                      Today’s Diet Plan
                    </h3>

                    {todayPlan?.diets?.length ? (
                      <div className="space-y-4">
                        {todayPlan.diets.map((diet, i) => (
                          <div
                            key={i}
                            className="p-4 bg-[#151b15] rounded-lg border border-gray-800"
                          >
                            <h4 className="text-lg font-semibold capitalize">
                              {diet.mealType} – {diet.mealTime}
                            </h4>

                            {diet.dietId.map((d) => (
                              <div
                                key={d._id}
                                className="mt-4 p-4 bg-[#1e251e] rounded-md"
                              >
                                <p className="font-semibold text-white">
                                  {d.items.join(", ")}
                                </p>

                                <div className="text-sm text-gray-400 mt-2 space-y-1">
                                  <p>Calories: {d.calories}</p>
                                  <p>Protein: {d.protein}</p>
                                  <p>Carbs: {d.carbs}</p>
                                  <p>Fats: {d.fats}</p>
                                </div>

                                <p className="text-gray-400 mt-3 italic text-sm">
                                  {d.purpose}
                                </p>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No diet schedule today</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
