import React, { useEffect, useState } from "react";

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/admin/exercise");
        const data = await res.json();
        setExercises(data.data || []);
      } catch (err) {
        console.error("Failed to load exercises", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-400">
        Loading exercises...
      </div>
    );
  }

  return (
    <div className="text-white px-4 sm:px-6 lg:px-10 pt-10 mb-10">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Exercise Library
        </h1>
        <p className="text-gray-400 mt-3 max-w-3xl mx-auto">
          Browse all available exercises with reps, sets, and video guidance.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise) => (
          <div
            key={exercise._id}
            className="bg-[#111811] border border-[#1e2d22] rounded-xl p-5 shadow-lg flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-1">{exercise.title}</h3>

            <p className="text-gray-400 text-sm mb-3">{exercise.description}</p>

            <div className="flex gap-4 text-sm mb-3">
              <span className="bg-[#1e2d22] px-3 py-1 rounded">
                Reps: {exercise.reps || "-"}
              </span>
              <span className="bg-[#1e2d22] px-3 py-1 rounded">
                Sets: {exercise.sets || "-"}
              </span>
            </div>

            <p className="text-gray-400 text-sm mb-4">{exercise.detail}</p>

            {/* VIDEO */}
            {exercise.videoURL && (
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg mt-auto">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={exercise.videoURL.replace("watch?v=", "embed/")}
                  title={exercise.title}
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exercises;
