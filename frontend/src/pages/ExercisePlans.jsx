import React, { useEffect, useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ExercisePlans = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState(null);

  // 🔹 for confirmation modal
  const [pendingPlanId, setPendingPlanId] = useState(null);

  // 🔹 Fetch all plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/admin/plan");
        const data = await res.json();
        setPlans(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Failed to load plans");
      }
    };

    fetchPlans();
  }, []);

  // 🔹 Fetch user's active plan
  useEffect(() => {
    const fetchActivePlan = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:9000/api/users/my-plans", {
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

  // 🔹 View plan details
  const handleViewDetails = (planId) => {
    navigate(`/weeklyPlans/${planId}`);
  };

  // 🔹 Start plan (entry point)
  const startPlan = (planId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to start a plan");
      return;
    }

    // show confirmation modal if another plan is active
    if (activePlanId && activePlanId !== planId) {
      setPendingPlanId(planId);
      return;
    }

    submitPlan(planId);
  };

  // 🔹 API call
  const submitPlan = async (planId) => {
    try {
      const res = await fetch("http://localhost:9000/api/users/start-plan", {
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

  if (!plans.length) {
    return (
      <p className="text-center mt-5 mb-5 text-gray-400">No plans found.</p>
    );
  }

  return (
    <>
      <div className="bg-[#0b0f0c] min-h-screen text-white py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Your Plans</h1>
          <p className="text-gray-300 mb-6">
            Choose a plan that fits your fitness level and goals.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                className="bg-[#1e2d22] text-white py-2 px-4 rounded-md hover:bg-[#243628] transition-all"
              >
                {level}
              </button>
            ))}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Weekly Plans</h2>

          {plans.map((plan) => (
            <div key={plan._id} className="mb-12 last:mb-0">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-12">
                {/* LEFT */}
                <div className="w-full lg:w-1/2">
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">
                    Week 1
                  </p>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                    {plan.name}
                  </h3>

                  <p className="text-gray-400 text-sm sm:text-base mb-4">
                    {plan.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleViewDetails(plan._id)}
                      className="bg-[#1e2d22] hover:bg-[#243628] text-white text-sm py-2 px-4 rounded-md flex items-center gap-1 transition-all"
                    >
                      View Details <GoArrowRight />
                    </button>

                    <button
                      onClick={() => startPlan(plan._id)}
                      disabled={activePlanId === plan._id}
                      className={`text-white text-sm py-2 px-4 rounded-md transition-all ${
                        activePlanId === plan._id
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-[#1e2d22] hover:bg-[#243628]"
                      }`}
                    >
                      {activePlanId === plan._id ? "Enrolled" : "Start Plan"}
                    </button>
                  </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="w-full lg:w-1/3">
                  <div className="aspect-[16/9] overflow-hidden rounded-lg shadow-md">
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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

      {/* 🔥 CONFIRMATION MODAL */}
      {pendingPlanId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0b0f0c] p-6 rounded-lg w-[90%] max-w-sm text-white">
            <h3 className="text-lg font-semibold mb-2">Switch Plan?</h3>
            <p className="text-gray-400 mb-4">
              Starting a new plan will remove your current one.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingPlanId(null)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  submitPlan(pendingPlanId);
                  setPendingPlanId(null);
                }}
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExercisePlans;
