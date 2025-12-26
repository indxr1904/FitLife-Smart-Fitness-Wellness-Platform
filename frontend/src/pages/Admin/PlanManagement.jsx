import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlanManagement = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/admin/plan");
        const result = await res.json();
        const allPlans = result?.data || [];
        setPlans(allPlans);
      } catch (error) {
        console.error("Server Error:", error);
      }
    };
    fetchPlans();
  }, []);

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEdit = (id) => {
    navigate(`/admin/editplan/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this plan?"
      );
      if (!confirmDelete) return;

      const res = await fetch(`http://localhost:9000/api/admin/plan/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.status === "success") {
        setPlans((prev) => prev.filter((plan) => plan._id !== id));
        alert("Plan Deleted Successfully!");
      } else {
        alert(result.message || "Failed to delete plan");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong...");
    }
  };

  const handleAddPlan = (e) => {
    e.preventDefault();
    navigate("/admin/addplan");
  };

  return (
    <div className="min-h-screen text-white px-4 sm:px-6 md:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Plan Management</h1>

        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <h3 className="text-xl font-semibold mb-3">Existing Plans</h3>
            <button
              onClick={handleAddPlan}
              className="sm:w-30 h-10 border rounded-md px-2 bg-[#00ff57] hover:bg-[#00ff55c0] text-black font-semibold cursor-pointer"
            >
              Add Plan
            </button>
          </div>

          <div className="w-full overflow-x-auto rounded-md">
            <table className="min-w-full table-auto text-left text-gray-300 text-sm border border-gray-600">
              <thead className="bg-[#1c271c] uppercase text-gray-200 text-xs sm:text-sm">
                <tr>
                  <th className="px-4 py-3 w-[15%]">Plan Name</th>
                  <th className="px-4 py-3 w-[10%] text-center">Duration</th>
                  <th className="px-4 py-3 w-[10%] text-center">Level</th>
                  <th className="px-4 py-3 w-[15%] text-center">Goal</th>
                  <th className="px-4 py-3 w-[20%] text-center">Active Days</th>
                  <th className="px-4 py-3 w-[20%]">Description</th>
                  <th className="px-4 py-3 w-[10%] text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {plans.length > 0 ? (
                  plans.map((plan, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[#1c271c56] transition-colors align-top"
                    >
                      <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                        {plan.name}
                      </td>

                      <td className="px-4 py-3 text-center">{plan.duration}</td>

                      <td className="px-4 py-3 text-center capitalize">
                        {plan.level}
                      </td>

                      <td className="px-4 py-3 text-center capitalize">
                        {plan.goal}
                      </td>

                      <td className="px-4 py-3 text-center text-gray-400">
                        {plan.activeDays && plan.activeDays.length > 0
                          ? plan.activeDays.join(", ")
                          : "No days selected"}
                      </td>

                      <td className="px-4 py-3 text-gray-400">
                        <p
                          className={`${
                            expandedRows[plan._id]
                              ? "whitespace-normal wrap-break-words"
                              : "overflow-hidden text-ellipsis line-clamp-2"
                          }`}
                        >
                          {plan.description || "No description provided"}
                        </p>
                        <button
                          onClick={() => toggleExpand(plan._id)}
                          className="text-[#00ff57] hover:underline mt-1 text-xs"
                        >
                          {expandedRows[plan._id] ? "Show Less" : "Read More"}
                        </button>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(plan._id)}
                            className="flex items-center gap-1 bg-[#00ff57] hover:bg-[#00ff55c0] px-3 py-1 rounded text-black text-xs font-medium transition-all"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(plan._id)}
                            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-medium transition-all"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center text-gray-400 py-6 italic"
                    >
                      No plans available. Create one using “Add Plan”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanManagement;
