import React, { useState, useRef } from "react";

const Week2 = ({ showEnrollButton = true }) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  const exercises = [
    {
      name: "Burpees",
      description:
        "A full-body cardio movement combining a squat, plank, and jump — perfect for boosting heart rate and endurance.",
      reps: "13",
      sets: "4",
      details:
        "Burpees are a dynamic full-body cardio exercise designed to build endurance, strength, and coordination. Each repetition combines a squat, plank, and jump, making it one of the most effective high-intensity movements.",
      videos: ["https://www.youtube.com/embed/818SkLAPyKY"],
    },
    {
      name: "Jump Squats",
      description:
        "A high-intensity lower-body plyometric move that strengthens legs and glutes while increasing cardio output.",
      reps: "15-20",
      sets: "3",
      details:
        "Jump squats are a powerful plyometric movement that strengthens the lower body while delivering a cardio boost. This exercise primarily targets the quads, glutes, and calves.",
      videos: ["https://www.youtube.com/embed/txLE-jOCEsc"],
    },
    {
      name: "Mountain Climbers",
      description:
        "A fast-paced core and cardio exercise that mimics climbing — great for burning fat and increasing agility.",
      reps: "18",
      sets: "3-4",
      details:
        "Mountain climbers are a fast-paced exercise that strengthens the core while elevating your heart rate. Quickly drive knees toward the chest in a running motion while keeping your core engaged.",
      videos: ["https://www.youtube.com/embed/hq_0YlyfqGM"],
    },
  ];

  const handleEnroll = () => {
    setIsEnrolled(true);
  };

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

  const exercise = exercises[currentIndex];

  return (
    <>
      <div className="min-h-screen bg-[#0b0f0c] text-white px-4 sm:px-6 md:px-8 py-10 relative">
        <div className="max-w-4xl mx-auto space-y-8 mt-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Cardio Blast Workout
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Burn calories, boost stamina, and strengthen your heart with this
              3-exercise high-energy circuit.
            </p>
          </div>

          <div className="bg-[#111811] border border-[#1e2d22] rounded-lg p-6 space-y-4">
            <h3 className="font-bold text-xl">{exercise.name}</h3>
            <p className="text-gray-400">{exercise.description}</p>

            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm">Reps</label>
                <input
                  type="text"
                  value={exercise.reps}
                  disabled
                  className="bg-[#1e2d22] border border-[#243628] rounded-md py-2 px-4 w-32 text-white"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm">Sets</label>
                <input
                  type="text"
                  value={exercise.sets}
                  disabled
                  className="bg-[#1e2d22] border border-[#243628] rounded-md py-2 px-4 w-32 text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Exercise Details</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {exercise.details}
            </p>
          </div>

          <div className="rounded-lg overflow-hidden mt-4 space-y-4">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
              <iframe
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full"
                src={exercise.videos[0]}
                title={exercise.name}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`${
                currentIndex === 0
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#00ff57] hover:bg-green-700 cursor-pointer"
              } px-4 py-2 rounded text-black font-semibold`}
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === exercises.length - 1}
              className={`${
                currentIndex === exercises.length - 1
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#00ff57] hover:bg-green-700 cursor-pointer"
              } px-4 py-2 rounded text-black font-semibold`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showEnrollButton && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center bg-[#0b0f0c]/90 backdrop-blur-sm h-16 sm:h-20 z-50">
          <button
            onClick={handleEnroll}
            disabled={isEnrolled}
            className="bg-[#00ff57] hover:bg-green-500 text-black px-6 py-2 rounded-full font-semibold shadow-lg disabled:opacity-60 transition-all duration-300"
          >
            {isEnrolled ? "Enrolled" : "Enroll Now"}
          </button>
        </div>
      )}
    </>
  );
};

export default Week2;
