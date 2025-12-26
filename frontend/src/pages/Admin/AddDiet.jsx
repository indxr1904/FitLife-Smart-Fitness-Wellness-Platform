import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddDiet = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [purpose, setPurpose] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9000/api/admin/diet", {
        items,
        calories,
        protein,
        carbs,
        fats,
        purpose,
      });
      alert("Diet Added Successfully!");
      navigate("/admin/dietmanagement");
    } catch (error) {
      console.error(error);
      alert("Failed to add diet");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/admin/dietmanagement");
  };

  return (
    <div className="min-h-screen  text-white px-4 sm:px-6 md:px-10 py-8">
      <div className="max-w-3xl mx-auto bg-[#1a241a] p-6 sm:p-8 rounded-2xl ">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-center sm:text-left">
          Add New Diet Plan
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mb-6 text-center sm:text-left">
          Enter meal details to create a new diet entry.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
          <div className="flex flex-col">
            <label htmlFor="items" className="font-medium text-gray-300 mb-1">
              Items
            </label>
            <input
              id="items"
              type="text"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="e.g., Oatmeal, Banana, Green Tea"
              className="px-3 py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 w-full text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="calories"
              className="font-medium text-gray-300 mb-1"
            >
              Calories
            </label>
            <input
              id="calories"
              type="text"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="e.g., 350"
              className="px-3 py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 w-full text-sm sm:text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="protein"
                className="font-medium text-gray-300 mb-1"
              >
                Protein (g)
              </label>
              <input
                id="protein"
                type="text"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="e.g., 20g"
                className="px-3 py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="carbs" className="font-medium text-gray-300 mb-1">
                Carbs (g)
              </label>
              <input
                id="carbs"
                type="text"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="e.g., 45g"
                className="px-3 py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="fats" className="font-medium text-gray-300 mb-1">
                Fats (g)
              </label>
              <input
                id="fats"
                type="text"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
                placeholder="e.g., 8g"
                className="px-3 py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="purpose" className="font-medium text-gray-300 mb-1">
              Purpose
            </label>
            <input
              id="purpose"
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., Boost metabolism, Post-workout recovery"
              className="px-3 py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 w-full text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4">
            <button
              type="submit"
              className="rounded-lg bg-[#00ff57] hover:bg-[#1cf261] text-black px-5 py-2 font-semibold text-sm sm:text-base transition-all"
            >
              Save Diet
            </button>
            <button
              onClick={handleCancel}
              className="rounded-lg bg-[#283928] hover:bg-[#354735] text-white px-5 py-2 font-semibold text-sm sm:text-base transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDiet;
