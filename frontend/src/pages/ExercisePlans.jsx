import React, { useEffect, useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../api/api";

const ExercisePlans = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingPlanId, setPendingPlanId] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/plan`);
        const data = await res.json();
        setPlans(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Failed to load plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchActivePlan = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/users/my-plans`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.status === "success" && data.plans.length > 0) {
          setActivePlanId(data.plans[0]._id);
        }
      } catch (error) {
        console.error("Error fetching active plan:", error);
      }
    };

    fetchActivePlan();
  }, []);

  const handleViewDetails = (planId) => {
    navigate(`/weeklyPlans/${planId}`);
  };

  const startPlan = (planId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to start a plan");
      return;
    }

    if (activePlanId && activePlanId !== planId) {
      setPendingPlanId(planId);
      return;
    }

    submitPlan(planId);
  };

  const submitPlan = async (planId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/start-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setActivePlanId(planId);
        toast.success("Plan started successfully");
        navigate(`/weeklyPlans/${planId}`);
      } else if (data.status === "already_enrolled") {
        toast.info("You are already enrolled in this plan");
        navigate(`/weeklyPlans/${planId}`);
      } else {
        toast.error(data.message || "Unable to start plan");
      }
    } catch (error) {
      console.error("Error starting plan:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#030804] min-h-screen flex items-center justify-center text-white">
        <p className="text-gray-400">Loading plans...</p>
      </div>
    );
  }

  if (!plans.length) {
    return (
      <div className="bg-[#030804] min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-400">No plans found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative bg-[#030804] min-h-screen text-white py-12 px-4 sm:px-8 overflow-hidden">
        {/* background glow */}
        <div
          className="pointer-events-none absolute top-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full 
        bg-[radial-gradient(circle,rgba(0,255,87,0.08)_0%,transparent_70%)] blur-2xl"
        />

        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="mb-12 animate-fadeInUp">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
              Your Plans
            </h1>

            <p className="text-gray-400 max-w-xl">
              Choose a plan that fits your fitness level and goals.
            </p>
          </div>

          {/* FILTER */}
          <div className="flex flex-wrap gap-3 mb-12 animate-fadeInUp">
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                className="bg-[#080f09] border border-[#182219]
                hover:border-[#00ff57] hover:bg-[#0c140d]
                py-2 px-4 rounded-md transition-all duration-300"
              >
                {level}
              </button>
            ))}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-10 tracking-tight">
            Weekly Plans
          </h2>

          {plans.map((plan, index) => (
            <div
              key={plan._id}
              className="mb-16 last:mb-0 animate-fadeInUp"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-16">
                {/* LEFT */}
                <div className="w-full lg:w-1/2">
                  <p className="text-gray-500 text-xs sm:text-sm mb-2 tracking-wider uppercase">
                    Week Plan
                  </p>

                  <h3 className="text-xl sm:text-2xl font-semibold mb-3">
                    {plan.name}
                  </h3>

                  <p className="text-gray-400 text-sm sm:text-base mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => handleViewDetails(plan._id)}
                      className="bg-[#080f09] border border-[#182219]
                      hover:border-[#00ff57] hover:bg-[#0c140d]
                      text-white text-sm py-2.5 px-5 rounded-md
                      flex items-center gap-2
                      transition-all duration-300 hover:-translate-y-[2px]"
                    >
                      View Details <GoArrowRight />
                    </button>

                    <button
                      onClick={() => startPlan(plan._id)}
                      disabled={activePlanId === plan._id}
                      className={`text-sm py-2.5 px-5 rounded-md transition-all duration-300 ${
                        activePlanId === plan._id
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-[#00ff57] text-black hover:shadow-[0_8px_25px_rgba(0,255,87,0.35)] hover:-translate-y-[2px]"
                      }`}
                    >
                      {activePlanId === plan._id ? "Enrolled" : "Start Plan"}
                    </button>
                  </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="w-full lg:w-[38%] group">
                  <div
                    className="aspect-[16/9] overflow-hidden rounded-lg border border-[#182219]
                  transition-all duration-500 group-hover:border-[#00ff57]
                  group-hover:shadow-[0_10px_40px_rgba(0,255,87,0.15)]"
                  >
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="w-full h-full object-cover
                      transition-transform duration-700 ease-out
                      group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/default-plan.jpg";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {pendingPlanId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#080f09] border border-[#182219] p-7 rounded-lg w-[90%] max-w-sm text-white animate-scaleIn">
            <h3 className="text-lg font-semibold mb-2">Switch Plan?</h3>

            <p className="text-gray-400 mb-6">
              Starting a new plan will remove your current one.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingPlanId(null)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  submitPlan(pendingPlanId);
                  setPendingPlanId(null);
                }}
                className="px-4 py-2 rounded bg-[#00ff57] text-black hover:shadow-[0_8px_25px_rgba(0,255,87,0.35)] transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`

        .animate-fadeInUp{
          animation: fadeInUp 0.8s ease forwards;
          opacity:0;
        }

        @keyframes fadeInUp{
          from{
            opacity:0;
            transform: translateY(40px);
          }
          to{
            opacity:1;
            transform: translateY(0);
          }
        }

        .animate-scaleIn{
          animation: scaleIn 0.3s ease;
        }

        @keyframes scaleIn{
          from{
            transform: scale(0.9);
            opacity:0;
          }
          to{
            transform: scale(1);
            opacity:1;
          }
        }

      `}</style>
    </>
  );
};

export default ExercisePlans;
