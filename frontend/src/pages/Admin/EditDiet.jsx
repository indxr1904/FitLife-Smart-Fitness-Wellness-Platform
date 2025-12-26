import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditDiet = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [items, setItems] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [purpose, setPurpose] = useState("");

  useEffect(() => {
    if (!id) {
      console.error("No diet ID provided");
      return;
    }

    axios
      .get(`http://localhost:9000/api/admin/diet/${id}`)
      .then((res) => {
        const diet = res.data.data;
        setItems(diet.items || "");
        setCalories(diet.calories || "");
        setProtein(diet.protein || "");
        setCarbs(diet.carbs || "");
        setFats(diet.fats || "");
        setPurpose(diet.purpose || "");
      })
      .catch((err) => console.error("Error fetching diet:", err));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:9000/api/admin/diet/${id}`, {
        items,
        calories,
        protein,
        carbs,
        fats,
        purpose,
      });
      alert("Diet Updated Successfully!");
      navigate("/admin/dietmanagement");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/admin/dietmanagement");
  };

  return (
    <div className="min-h-screen bg-[#0f150f] text-white px-4 sm:px-6 md:px-10 py-8">
      <div className="max-w-3xl mx-auto bg-[#1a241a] p-6 sm:p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-center sm:text-left">
          Edit Diet
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mb-6 text-center sm:text-left">
          Modify the details of an existing diet entry.
        </p>

        <form className="flex flex-col gap-5 sm:gap-6" onSubmit={handleUpdate}>
          <div className="flex flex-col">
            <label
              htmlFor="items"
              className="font-medium text-gray-300 mb-1 sm:mb-2"
            >
              Items
            </label>
            <input
              id="items"
              type="text"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="e.g., Oatmeal, Banana, Green Tea"
              className="px-3 py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="calories"
              className="font-medium text-gray-300 mb-1 sm:mb-2"
            >
              Calories
            </label>
            <input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="e.g., 350"
              className="px-3 py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="protein"
                className="font-medium text-gray-300 mb-1 sm:mb-2"
              >
                Protein (g)
              </label>
              <input
                id="protein"
                type="text"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="e.g., 20"
                className="px-3 py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="carbs"
                className="font-medium text-gray-300 mb-1 sm:mb-2"
              >
                Carbs (g)
              </label>
              <input
                id="carbs"
                type="text"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="e.g., 45"
                className="px-3 py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="fats"
                className="font-medium text-gray-300 mb-1 sm:mb-2"
              >
                Fats (g)
              </label>
              <input
                id="fats"
                type="text"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
                placeholder="e.g., 8"
                className="px-3 py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="purpose"
              className="font-medium text-gray-300 mb-1 sm:mb-2"
            >
              Purpose
            </label>
            <input
              id="purpose"
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., Boost metabolism or post-workout meal"
              className="px-3 py-3 rounded-md bg-[#1c271c] border border-[#385538] focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4">
            <button
              type="submit"
              className="rounded-lg bg-[#00ff57] hover:bg-[#1cf261] text-black px-5 py-2 font-semibold text-sm sm:text-base transition-all"
            >
              Save Changes
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

export default EditDiet;
