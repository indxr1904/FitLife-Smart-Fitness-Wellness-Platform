import React, { useState, useRef } from "react";

const WorkoutDay = ({ dayData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  const exercises = dayData?.exercises || [];
  const currentExercise = exercises[currentIndex];

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className="
        min-h-screen bg-[#0b0f0c] text-white
        px-3 sm:px-6 md:px-10 lg:px-12
        py-8 sm:py-10
      "
    >
      {/* MAIN CONTAINER */}
      <div
        className="
          max-w-full sm:max-w-4xl lg:max-w-5xl
          mx-auto space-y-8 mt-4 sm:mt-6
        "
      >
        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 capitalize">
            {dayData.dayName} - Workout
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-3xl">
            Follow your daily exercise plan and maintain consistency for best
            results.
          </p>
        </div>

        {/* EXERCISE CARD */}
        {currentExercise ? (
          <div
            className="
              bg-[#111811] border border-[#1e2d22]
              rounded-xl p-4 sm:p-6 space-y-4 shadow-lg
            "
          >
            <h3 className="font-bold text-lg sm:text-xl">
              {currentExercise.exerciseId?.title || "Exercise"}
            </h3>

            <p className="text-gray-400 text-sm sm:text-base">
              {currentExercise.exerciseId?.description ||
                "No description available."}
            </p>

            {/* REPS / SETS */}
            <div className="grid grid-cols-2 sm:flex gap-4 mt-4">
              <div className="flex flex-col">
                <label className="text-gray-400 text-xs sm:text-sm mb-1">
                  Reps
                </label>
                <input
                  type="text"
                  value={currentExercise.exerciseId?.reps || "-"}
                  disabled
                  className="
                    bg-[#1e2d22] border border-[#243628]
                    rounded-md py-2 px-3 sm:px-4
                    w-full sm:w-32 text-white
                  "
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-400 text-xs sm:text-sm mb-1">
                  Sets
                </label>
                <input
                  type="text"
                  value={currentExercise.exerciseId?.sets || "-"}
                  disabled
                  className="
                    bg-[#1e2d22] border border-[#243628]
                    rounded-md py-2 px-3 sm:px-4
                    w-full sm:w-32 text-white
                  "
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm sm:text-base">
            No exercises added for this day.
          </p>
        )}

        {/* DETAILS */}
        {currentExercise && (
          <div className="space-y-2 max-w-4xl">
            <h2 className="text-base sm:text-lg font-semibold">
              Exercise Details
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {currentExercise.exerciseId?.detail ||
                "Details about this exercise will appear here."}
            </p>
          </div>
        )}

        {/* VIDEO (LARGER + RESPONSIVE) */}
        {currentExercise?.exerciseId?.videoURL && (
          <div className="mt-6">
            <div
              className="
                relative pb-[56.25%] h-0 overflow-hidden
                rounded-xl shadow-2xl
                max-w-full sm:max-w-4xl lg:max-w-5xl
                mx-auto
              "
            >
              <iframe
                ref={videoRef}
                className="absolute inset-0 w-full h-full"
                src={currentExercise.exerciseId.videoURL.replace(
                  "watch?v=",
                  "embed/"
                )}
                title={currentExercise.exerciseId?.title || "Exercise Video"}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        {exercises.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`
                w-full sm:w-auto px-6 py-2 rounded-lg font-semibold transition
                ${
                  currentIndex === 0
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#00ff57] hover:bg-green-600 text-black"
                }
              `}
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === exercises.length - 1}
              className={`
                w-full sm:w-auto px-6 py-2 rounded-lg font-semibold transition
                ${
                  currentIndex === exercises.length - 1
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#00ff57] hover:bg-green-600 text-black"
                }
              `}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutDay;
