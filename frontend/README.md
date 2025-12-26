# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

-------------Week1----------------

import React, { useState, useEffect } from "react";

const Week1 = () => {
const [isStarted, setIsStarted] = useState(false);
const [timeLeft, setTimeLeft] = useState(25 \* 60);
const [progress, setProgress] = useState(0);

// Timer logic
useEffect(() => {
let timer;
if (isStarted && timeLeft > 0) {
timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
} else if (timeLeft === 0) {
setIsStarted(false);
}
return () => clearInterval(timer);
}, [isStarted, timeLeft]);

// Progress update
useEffect(() => {
const totalTime = 25 _ 60;
setProgress(((totalTime - timeLeft) / totalTime) _ 100);
}, [timeLeft]);

const formatTime = (seconds) => {
const m = Math.floor(seconds / 60);
const s = seconds % 60;
return `${m}:${s < 10 ? "0" : ""}${s}`;
};

return (

<div className="min-h-screen bg-[#0b0f0c] text-white px-4 sm:px-6 md:px-8 py-10">
<div className="max-w-4xl mx-auto space-y-8">
{/_ Title _/}
<div>
<h1 className="text-3xl sm:text-4xl font-bold mb-2">
Strength Training Plan
</h1>
<p className="text-gray-400 text-sm sm:text-base">
Build muscle and increase strength with this comprehensive plan.
</p>
</div>

        {/* Exercise Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Exercises</h2>

          <div className="flex flex-col bg-[#111811] border border-[#1e2d22] rounded-lg p-4 sm:p-6 space-y-4">
            <div>
              <h3 className="font-bold text-lg">Squats</h3>
              <p className="text-gray-400 text-sm mt-1">
                3 sets of 10 reps. Keep your back straight and lower your hips
                until your thighs are parallel to the ground. Watch the demo
                video for proper form.
              </p>
            </div>

            {/* Reps & Sets (ALWAYS BELOW) */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="">
                <label className="block text-sm text-gray-400 mb-1">Reps</label>
                <input
                  type="text"
                  value="10"
                  disabled
                  className="bg-[#1e2d22] border border-[#243628] rounded-md text-left py-2 px-4 w-40 text-white "
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Sets</label>
                <input
                  type="text"
                  value="3"
                  disabled
                  className="bg-[#1e2d22] border border-[#243628] rounded-md text-left py-2 px-4 w-40 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Details */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Exercise Details</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Squats are a fundamental exercise for building lower body strength.
            They primarily target the quadriceps, hamstrings, and glutes, while
            also engaging the core and back muscles. Proper form is crucial to
            avoid injury and maximize effectiveness. Focus on maintaining a
            neutral spine, keeping your weight on your heels, and ensuring your
            knees don’t extend past your toes. Watch the video demonstration for
            a visual guide on correct form and technique.
          </p>
        </div>

        {/* Demo Image / Video */}
        <div className="rounded-lg overflow-hidden mt-4">
          <img
            src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1"
            alt="Squats Demo"
            className="w-full object-cover rounded-lg"
          />
        </div>

        <div className="flex flex-col bg-[#111811] border border-[#1e2d22] rounded-lg p-4 sm:p-6 space-y-4">
          <div>
            <h3 className="font-bold text-lg">Push-ups</h3>
            <p className="text-gray-400 text-sm mt-1">
              3 sets of 12 reps. Lower your chest to the ground while keeping
              your body in a stright line. Check out the GIF for a visual guide.
            </p>
          </div>

          {/* Reps & Sets (ALWAYS BELOW) */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="">
              <label className="block text-sm text-gray-400 mb-1">Reps</label>
              <input
                type="text"
                value="12"
                disabled
                className="bg-[#1e2d22] border border-[#243628] rounded-md text-left py-2 px-4 w-40 text-white "
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Sets</label>
              <input
                type="text"
                value="3"
                disabled
                className="bg-[#1e2d22] border border-[#243628] rounded-md text-left py-2 px-4 w-40 text-white"
              />
            </div>
          </div>
        </div>

        {/* Exercise Details */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Exercise Details</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Push-ups are a classic exercise for building upper body strength,
            particularly in the chest, shoulders, and triceps. They also engage
            the core and back muscles for stability. Proper from involves
            maintaining a straight line from head to heels, lowering the chest
            to the ground while keeping the elbows at a 45-degree angle,and
            pushing back up to the starting position. Common mistakes include
            sagging hips, flaring elbows, and not going low enough. Watch the
            video demonstration for a visual guide on correct form and
            technique.
          </p>
        </div>

        {/* Demo Image / Video */}
        <div className="rounded-lg overflow-hidden mt-4">
          <img
            src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1"
            alt="Squats Demo"
            className="w-full object-cover rounded-lg"
          />
        </div>

        <div className="flex flex-col bg-[#111811] border border-[#1e2d22] rounded-lg p-4 sm:p-6 space-y-4">
          <div>
            <h3 className="font-bold text-lg">Lunges</h3>
            <p className="text-gray-400 text-sm mt-1">
              3 sets of 15 reps. Step forward with one leg and lower your body
              until both knees are bent at a 90-degree angle. See the video
              tutorial for correct posture.
            </p>
          </div>

          {/* Reps & Sets (ALWAYS BELOW) */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="">
              <label className="block text-sm text-gray-400 mb-1">Reps</label>
              <input
                type="text"
                value="15"
                disabled
                className="bg-[#1e2d22] border border-[#243628] rounded-md text-left py-2 px-4 w-40 text-white "
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Sets</label>
              <input
                type="text"
                value="3"
                disabled
                className="bg-[#1e2d22] border border-[#243628] rounded-md text-left py-2 px-4 w-40 text-white"
              />
            </div>
          </div>
        </div>

        {/* Exercise Details */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Exercise Details</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Lunges are an excellent exercise for strengthening the quadriceps,
            glutes, and hamstrings while improving balance and unilateral
            stability. Keep your torso upright, step forward with control, lower
            until both knees are about 90°, and drive through the front heel to
            return. Maintain core engagement and avoid letting the front knee
            track past the toes to protect the joint.
          </p>
        </div>

        {/* Demo Image / Video */}
        <div className="rounded-lg overflow-hidden mt-4">
          <img
            src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1"
            alt="Squats Demo"
            className="w-full object-cover rounded-lg"
          />
        </div>

        <div className="flex flex-col bg-[#111811] border border-[#1e2d22] rounded-lg p-4 sm:p-6 space-y-4">
          <div>
            <h3 className="font-bold text-lg">Deadlifts</h3>
            <p className="text-gray-400 text-sm mt-1">
              3 sets of 10 reps. Lift the barbell or dumbbells off the ground
              while keeping your back straight. Watch the instructional video to
              avoid injury.
            </p>
          </div>

          {/* Reps & Sets (ALWAYS BELOW) */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="">
              <label className="block text-sm text-gray-400 mb-1">Reps</label>
              <input
                type="text"
                value="10"
                disabled
                className="bg-[#1e2d22] border border-[#243628] rounded-md text-left py-2 px-4 w-40 text-white "
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Sets</label>
              <input
                type="text"
                value="3"
                disabled
                className="bg-[#1e2d22] border border-[#243628] rounded-md text-left py-2 px-4 w-40 text-white"
              />
            </div>
          </div>
        </div>

        {/* Exercise Details */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Exercise Details</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Deadlifts are a powerful compound exercise that works multiple major
            muscle groups simultaneously, particularly the lower back, glutes,
            hamstrings, and core. Proper form is critical: keep your back
            straight, hinge at the hips, and drive through your heels while
            lifting. The bar should travel straight up and down along your shins
            and thighs. Common mistakes include rounding the back, lifting with
            the arms instead of the legs, and jerking the weight. Start with
            lighter weights to master proper technique.
          </p>
        </div>

        {/* Demo Image / Video */}
        <div className="rounded-lg overflow-hidden mt-4">
          <img
            src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1"
            alt="Squats Demo"
            className="w-full object-cover rounded-lg"
          />
        </div>

        {/* Timer & Progress */}
        <div className="pt-6">
          {!isStarted ? (
            <button
              onClick={() => setIsStarted(true)}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md text-sm sm:text-base transition"
            >
              Start Exercise
            </button>
          ) : (
            <div className="space-y-4">
              <div className="text-lg font-semibold">
                ⏱ Time Left: {formatTime(timeLeft)}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <button
                onClick={() => setIsStarted(false)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md text-sm sm:text-base transition"
              >
                Stop Exercise
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

);
};

export default Week1;

<iframe width="560" height="315" src="https://www.youtube.com/embed/xqvCmoLULNY?si=eDo8oDo3rGr88hj5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
