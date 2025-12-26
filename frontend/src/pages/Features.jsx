import React from "react";
import {
  Dumbbell,
  CalendarCheck,
  Utensils,
  BarChart3,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <Dumbbell className="w-7 h-7 text-[#00ff57]" />,
    title: "Smart Workout Plans",
    description:
      "Personalized workout plans designed for beginners, intermediate, and advanced fitness levels.",
  },
  {
    icon: <CalendarCheck className="w-7 h-7 text-[#00ff57]" />,
    title: "Weekly Scheduling",
    description:
      "Organized weekly workouts that keep you consistent and focused on your goals.",
  },
  {
    icon: <Utensils className="w-7 h-7 text-[#00ff57]" />,
    title: "Nutrition Guidance",
    description:
      "Diet plans aligned with your fitness goals including muscle gain and fat loss.",
  },
  {
    icon: <BarChart3 className="w-7 h-7 text-[#00ff57]" />,
    title: "Progress Tracking",
    description:
      "Track workouts, calories, and performance with visual analytics and charts.",
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-[#00ff57]" />,
    title: "Secure Authentication",
    description:
      "Safe and secure login with email/password or Google authentication.",
  },
  {
    icon: <Smartphone className="w-7 h-7 text-[#00ff57]" />,
    title: "Fully Responsive",
    description:
      "Optimized experience across mobile, tablet, and desktop devices.",
  },
];

const Features = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#0b0f0c] mt-15 text-white min-h-screen px-4 sm:px-6 md:px-10 py-16">
      <div className="max-w-7xl mx-auto mt-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-[#00ff57]">FitLife</span>?
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            FitLife is designed to help you build healthy habits with structured
            workouts, nutrition planning, and real-time progress tracking.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#111811] border border-[#1e2d22] rounded-xl p-6 hover:border-[#00ff57] transition-all duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Start Your Fitness Journey Today
          </h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            Join FitLife and take control of your workouts, nutrition, and
            progress.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-[#00ff57] hover:bg-[#25d660] text-black font-semibold px-8 py-3 rounded-lg transition"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Features;
