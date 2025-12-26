import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const AddPlan = () => {
  const navigate = useNavigate();
  const [planName, setPlanName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [goal, setGoal] = useState("general fitness");
  const [level, setLevel] = useState("beginner");
  const [activeDays, setActiveDays] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [diets, setDiets] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exRes, dietRes] = await Promise.all([
          axios.get("http://localhost:9000/api/admin/exercise"),
          axios.get("http://localhost:9000/api/admin/diet"),
        ]);
        setExercises(exRes.data.data || []);
        setDiets(dietRes.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleDayToggle = (day) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

    setSchedule((prev) => {
      const exists = prev.find((d) => d.dayName === day);
      if (exists) {
        return prev.filter((d) => d.dayName !== day);
      } else {
        return [
          ...prev,
          {
            dayName: day,
            exercises: [{ exerciseId: "", time: "", videoURL: "" }],
            diets: [{ dietId: [], mealType: "", mealTime: "" }],
          },
        ];
      }
    });
  };

  const handleAdd = (dayName, type) => {
    const newEntry =
      type === "exercises"
        ? { exerciseId: "", time: "", videoURL: "" }
        : { dietId: [], mealType: "", mealTime: "" };

    const updated = schedule.map((d) =>
      d.dayName === dayName ? { ...d, [type]: [...d[type], newEntry] } : d
    );
    setSchedule(updated);
  };

  const handleChange = (dayName, type, index, field, value) => {
    const updated = schedule.map((day) => {
      if (day.dayName === dayName) {
        const updatedArray = day[type].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        );
        return { ...day, [type]: updatedArray };
      }
      return day;
    });
    setSchedule(updated);
  };

  const toggleAccordion = (dayName, type, index) => {
    const key = `${dayName}-${type}-${index}`;
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9000/api/admin/plan", {
        name: planName,
        description,
        image,
        duration,
        goal,
        level,
        activeDays,
        schedule,
      });
      alert("Plan created successfully!");
      navigate("/admin/planmanagement");
    } catch (err) {
      console.error(err);
      alert("Failed to create plan");
    }
  };

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className="min-h-screen text-white px-4 sm:px-8 md:px-12 py-10">
      <div className="max-w-5xl mx-auto bg-[#1a241a] p-6 sm:p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">
          Create New Plan
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block font-semibold mb-2">Plan Name</label>
            <input
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="w-full p-3 rounded-md bg-[#1c271c] border border-[#385538] focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-md bg-[#1c271c] border border-[#385538] focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Image URL</label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-3 rounded-md bg-[#1c271c] border border-[#385538] focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Duration</label>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 6 Weeks"
                className="w-full p-3 rounded-md bg-[#1c271c] border border-[#385538] focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-3 rounded-md bg-[#1c271c] border border-[#385538]"
              >
                <option>beginner</option>
                <option>intermediate</option>
                <option>advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-3 rounded-md bg-[#1c271c] border border-[#385538]"
            >
              <option>general fitness</option>
              <option>weight loss</option>
              <option>muscle gain</option>
              <option>strength</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-3">
              Select Active Days
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {days.map((day) => (
                <label key={day} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={activeDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                  <span className="capitalize">{day}</span>
                </label>
              ))}
            </div>
          </div>

          {schedule.map((day) => (
            <div
              key={day.dayName}
              className="bg-[#1c271c] border border-[#385538] p-5 mt-5 rounded-lg"
            >
              <h2 className="text-xl font-semibold mb-3 capitalize">
                {day.dayName}
              </h2>

              <h3 className="text-green-400 font-semibold mb-3">Exercises</h3>
              {day.exercises.map((ex, i) => {
                const key = `${day.dayName}-exercises-${i}`;
                return (
                  <div
                    key={i}
                    className="mb-3 border border-[#385538] rounded-lg overflow-hidden"
                  >
                    <div
                      className="flex justify-between items-center bg-[#263826] px-3 py-2 cursor-pointer"
                      onClick={() =>
                        toggleAccordion(day.dayName, "exercises", i)
                      }
                    >
                      <span className="capitalize text-sm">
                        {exercises.find((e) => e._id === ex.exerciseId)
                          ?.title || `Exercise ${i + 1}`}
                      </span>
                      {expanded[key] ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </div>

                    {expanded[key] && (
                      <div className="p-3 space-y-3 bg-[#1a1f1a]">
                        <select
                          value={ex.exerciseId}
                          onChange={(e) =>
                            handleChange(
                              day.dayName,
                              "exercises",
                              i,
                              "exerciseId",
                              e.target.value
                            )
                          }
                          className="w-full p-2 bg-[#121812] border border-[#385538] rounded-md"
                        >
                          <option value="">Select Exercise</option>
                          {exercises.map((exItem) => (
                            <option key={exItem._id} value={exItem._id}>
                              {exItem.title}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          placeholder="Video URL"
                          value={ex.videoURL}
                          onChange={(e) =>
                            handleChange(
                              day.dayName,
                              "exercises",
                              i,
                              "videoURL",
                              e.target.value
                            )
                          }
                          className="w-full p-2 bg-[#121812] border border-[#385538] rounded-md"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => handleAdd(day.dayName, "exercises")}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                + Add Exercise
              </button>

              <h3 className="text-green-400 font-semibold mt-6 mb-3">
                Diets / Meals
              </h3>
              {day.diets.map((dt, i) => {
                const key = `${day.dayName}-diets-${i}`;
                return (
                  <div
                    key={i}
                    className="mb-3 border border-[#385538] rounded-lg overflow-hidden"
                  >
                    <div
                      className="flex justify-between items-center bg-[#263826] px-3 py-2 cursor-pointer"
                      onClick={() => toggleAccordion(day.dayName, "diets", i)}
                    >
                      <span className="capitalize text-sm">
                        {dt.mealType || `Diet ${i + 1}`}
                      </span>
                      {expanded[key] ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </div>

                    {expanded[key] && (
                      <div className="p-3 space-y-3 bg-[#1a1f1a]">
                        <select
                          multiple
                          value={Array.isArray(dt.dietId) ? dt.dietId : []}
                          onChange={(e) =>
                            handleChange(
                              day.dayName,
                              "diets",
                              i,
                              "dietId",
                              Array.from(
                                e.target.selectedOptions,
                                (option) => option.value
                              )
                            )
                          }
                          className="w-full p-2 bg-[#121812] border border-[#385538] rounded-md"
                        >
                          {diets.map((dItem) => (
                            <option key={dItem._id} value={dItem._id}>
                              {Array.isArray(dItem.items)
                                ? dItem.items.join(", ")
                                : dItem.items || "Unnamed Diet"}
                            </option>
                          ))}
                        </select>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {dt.dietId?.map((id) => {
                            const diet = diets.find((d) => d._id === id);
                            return (
                              <span
                                key={id}
                                className="px-2 py-1 bg-green-700 text-white text-xs rounded-md"
                              >
                                {Array.isArray(diet?.items)
                                  ? diet.items.join(", ")
                                  : diet?.items || "Unnamed Diet"}
                              </span>
                            );
                          })}
                        </div>

                        <input
                          type="text"
                          placeholder="Meal Time (e.g. 8:00 AM)"
                          value={dt.mealTime}
                          onChange={(e) =>
                            handleChange(
                              day.dayName,
                              "diets",
                              i,
                              "mealTime",
                              e.target.value
                            )
                          }
                          className="w-full p-2 bg-[#121812] border border-[#385538] rounded-md"
                        />

                        <input
                          type="text"
                          placeholder="Meal Type (e.g. Breakfast)"
                          value={dt.mealType}
                          onChange={(e) =>
                            handleChange(
                              day.dayName,
                              "diets",
                              i,
                              "mealType",
                              e.target.value
                            )
                          }
                          className="w-full p-2 bg-[#121812] border border-[#385538] rounded-md"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => handleAdd(day.dayName, "diets")}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                + Add Diet
              </button>
            </div>
          ))}

          <button
            type="submit"
            className="mt-6 bg-[#00ff57] hover:bg-[#20e050] text-black px-5 py-3 font-semibold rounded-lg transition"
          >
            Save Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlan;
