import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ExerciseManagement = () => {
  const navigate = useNavigate();
  const [exercises, setExercise] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchExercise = async () => {
      // const token = localStorage.getItem("user");
      try {
        const res = await fetch("http://localhost:9000/api/admin/exercise");
        const result = await res.json();
        const allData = result?.data || [];
        setExercise(allData);
      } catch (error) {
        console.error(error, "Server Error");
      }
    };
    fetchExercise();
  }, []);

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEdit = (id) => {
    // alert(`Edit clicked for Exercise ID: ${id}`);
    navigate(`/admin/editexercise/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:9000/api/admin/exercise/${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await res.json();
      if (result.status === "success") {
        setExercise((prev) => prev.filter((item) => item._id !== id));
        alert("Exercise Deleted Successfully!");
      } else {
        alert(result.message || "Failed to delete");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong...");
    }
  };

  const handleAddExercise = (e) => {
    e.preventDefault();
    navigate("/admin/addexercise");
  };

  return (
    <div className="min-h-screen text-white px-4 sm:px-6 md:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Exercise Management</h1>

        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <h3 className="text-xl font-semibold mb-3">Existing Exercises</h3>
            <button
              onClick={handleAddExercise}
              className="sm:w-30 h-10 border rounded-md px-1 bg-[#00ff57] hover:bg-[#00ff55c0] text-black font-semibold cursor-pointer "
            >
              Add Exercise
            </button>
          </div>

          <div className="w-full overflow-x-auto rounded-md ">
            <table className="min-w-full table-auto text-left text-gray-300 text-sm border border-gray-600">
              <thead className="bg-[#1c271c] uppercase text-gray-200 text-xs sm:text-sm">
                <tr>
                  <th className="px-4 py-3 w-[10%]">Name</th>
                  <th className="px-4 py-3 w-[25%]">Description</th>
                  <th className="px-4 py-3 w-[8%] text-center">Reps</th>
                  <th className="px-4 py-3 w-[8%] text-center">Sets</th>
                  <th className="px-4 py-3 w-[35%]">Details</th>
                  <th className="px-4 py-3 w-[14%] text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {exercises.map((exercise, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#1c271c56] transition-colors align-top"
                  >
                    <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                      {exercise.title}
                    </td>

                    <td className="px-4 py-3 text-gray-400">
                      <p
                        className={`${
                          expandedRows[exercise.id]
                            ? "whitespace-normal break-words"
                            : "overflow-hidden text-ellipsis line-clamp-2"
                        }`}
                      >
                        {exercise.description}
                      </p>
                      <button
                        onClick={() => toggleExpand(exercise.id)}
                        className="text-[#00ff57] hover:underline mt-1 text-xs"
                      >
                        {expandedRows[exercise.id] ? "Show Less" : "Read More"}
                      </button>
                    </td>

                    <td className="px-4 py-3 text-center">{exercise.reps}</td>

                    <td className="px-4 py-3 text-center">{exercise.sets}</td>

                    <td className="px-4 py-3 text-gray-400">
                      <p
                        className={`${
                          expandedRows[`details-${exercise.id}`]
                            ? "whitespace-normal break-words"
                            : "overflow-hidden text-ellipsis line-clamp-2"
                        }`}
                      >
                        {exercise.detail}
                      </p>
                      <button
                        onClick={() => toggleExpand(`details-${exercise.id}`)}
                        className="text-[#00ff57] hover:underline mt-1 text-xs"
                      >
                        {expandedRows[`details-${exercise.id}`]
                          ? "Show Less"
                          : "Read More"}
                      </button>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(exercise?._id)}
                          className="flex items-center gap-1 bg-[#00ff57] hover:bg-[#00ff55c0] px-3 py-1 rounded text-black text-xs font-medium transition-all"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(exercise?._id)}
                          className="flex items-center gap-1 bg-red-600  hover:bg-red-700 px-3 py-1 rounded text-xs font-medium transition-all"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseManagement;
