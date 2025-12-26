import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddExercise = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [detail, setDetail] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:9000/api/admin/exercise`, {
        title,
        description,
        reps,
        sets,
        detail,
      });
      alert("Updated Successfully!");
      navigate("/admin/exercisemanagement");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/admin/exercisemanagement");
  };

  return (
    <div className="min-h-screen text-white px-4 sm:px-6 md:px-10 py-8 ">
      <div className="max-w-4xl mx-auto bg-[#1a241a] p-6 sm:p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left">
          Edit Exercise
        </h1>

        <p className="text-gray-400 text-sm sm:text-base mb-6 text-center sm:text-left">
          Modify the details of an existing exercise in the database
        </p>

        <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleUpdate}>
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className="font-medium text-gray-300 mb-1 sm:mb-2"
            >
              Exercise Name
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter exercise name"
              className="px-3 py-2 sm:py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 w-full text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="font-medium text-gray-300 mb-1 sm:mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a short description..."
              className="p-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 w-full text-sm sm:text-base"
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-6">
            <div className="flex-1 flex flex-col">
              <label
                htmlFor="reps"
                className="font-medium text-gray-300 mb-1 sm:mb-2"
              >
                Reps
              </label>
              <input
                id="reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="e.g., 10"
                className="px-3 py-2 sm:py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 w-full text-sm sm:text-base"
              />
            </div>

            <div className="flex-1 flex flex-col mt-4 sm:mt-0">
              <label
                htmlFor="sets"
                className="font-medium text-gray-300 mb-1 sm:mb-2"
              >
                Sets
              </label>
              <input
                id="sets"
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                placeholder="e.g., 3"
                className="px-3 py-2 sm:py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 w-full text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="detail"
              className="font-medium text-gray-300 mb-1 sm:mb-2"
            >
              Details
            </label>
            <textarea
              id="detail"
              rows="5"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Provide detailed information about the exercise..."
              className="p-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 w-full text-sm sm:text-base"
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4">
            <button
              type="submit"
              className="rounded-lg bg-[#00ff57] hover:bg-[#1cf261] text-black px-4 py-2 font-semibold text-sm sm:text-base transition-all"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="rounded-lg bg-[#283928] hover:bg-[#354735] text-white px-4 py-2 font-semibold text-sm sm:text-base transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExercise;
