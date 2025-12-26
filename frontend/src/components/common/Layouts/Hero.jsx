import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./../Navbar";
// import heroImage from "./../../../assets/hero-image.png";
import img from "./../../../assets/ing.png";
import feature1 from "./../../../assets/f1.jpg";
import feature2 from "./../../../assets/f2.jpg";
import feature3 from "../../../assets/f3.jpg";
import testi1 from "../../../assets/t.jpg";
import testi2 from "../../../assets/testi2.png";
import testi3 from "../../../assets/testi3.png";
import { FaHeartbeat, FaChartLine, FaUsers, FaRunning } from "react-icons/fa";

const HomePage = () => {
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar />

      <section className="relative flex flex-col bg-black/70 items-center justify-center text-center h-[90vh] px-4 overflow-hidden">
        <img
          src={img}
          alt="Fitness"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Track Your <span className=" text-[#00ff57]">Fitness Journey</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg mb-6">
            Achieve your fitness goals with personalized tracking, motivation,
            and community support. Let’s make fitness a lifestyle, not a duty.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-[#00ff57] px-6 py-3 text-black rounded-md text-base md:text-lg font-bold hover:bg-[#27ff27] transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-[#293829] text-white px-6 py-3 rounded-md text-base md:text-lg font-bold hover:bg-[#1b351b] transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-[#0b0f0c] to-[#07140d]">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<FaHeartbeat className="text-[#00ff57]  text-4xl mb-4" />}
            title="Heart Rate Monitoring"
            desc="Real-time tracking for optimal performance and safety."
          />
          <FeatureCard
            icon={<FaRunning className="text-[#00ff57] text-4xl mb-4" />}
            title="Activity Tracking"
            desc="Track daily workouts, steps, and calories with ease."
          />
          <FeatureCard
            icon={<FaChartLine className="text-[#00ff57] text-4xl mb-4" />}
            title="Progress Analysis"
            desc="Analyze your progress with smart insights and graphs."
          />
          <FeatureCard
            icon={<FaUsers className="text-[#00ff57] text-4xl mb-4" />}
            title="Community Support"
            desc="Stay motivated with group challenges and discussions."
          />
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-[#0b0f0c] to-[#07140d]">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <BenefitCard
            image={feature1}
            title="Improved Health"
            desc="Transform your lifestyle and enhance overall well-being."
          />
          <BenefitCard
            image={feature2}
            title="Increased Motivation"
            desc="Stay consistent with challenges and daily goals."
          />
          <BenefitCard
            image={feature3}
            title="Personalized Guidance"
            desc="Tailored workout and nutrition plans for your goals."
          />
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-[#0b0f0c] to-[#07140d]">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Testimonials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <TestimonialCard
            image={testi1}
            name="Emily R."
            feedback="This app completely transformed my fitness routine. I’ve never felt stronger!"
          />
          <TestimonialCard
            image={testi2}
            name="Mark T."
            feedback="Amazing analytics and clean design — I actually enjoy tracking my workouts now!"
          />
          <TestimonialCard
            image={testi3}
            name="Sarah P."
            feedback="The community keeps me accountable and inspired. A must-have app for fitness lovers."
          />
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-[#0b0f0c] to-[#07140d]">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Start Your Fitness Journey?
        </h2>
        <p className="text-gray-400 mb-8">
          Download our app and take the first step towards a healthier, happier
          you.
        </p>
        <Link
          to="/"
          className="
  bg-[#00ff57] text-black
  px-8 py-3 rounded-md text-lg font-bold
  hover:bg-[#1aff6b]
  shadow-[0_0_20px_rgba(0,255,87,0.35)]
  transition
"
        >
          Download Now
        </Link>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div
    className="
    bg-[#0f1f14]
    border border-[#1f3d2b]
    p-6 rounded-xl text-center
    hover:shadow-[0_0_20px_rgba(0,255,87,0.15)]
    hover:scale-105
    transition-all duration-300
  "
  >
    {icon}
    <h3 className="font-semibold text-xl mb-2 text-white">{title}</h3>
    <p className="text-gray-400 text-sm">{desc}</p>
  </div>
);

const BenefitCard = ({ image, title, desc }) => (
  <div
    className="
    bg-[#0f1f14]
    border border-[#1f3d2b]
    rounded-xl overflow-hidden
    hover:shadow-[0_0_25px_rgba(0,255,87,0.15)]
    hover:scale-105
    transition-all duration-300
  "
  >
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="font-semibold text-xl mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  </div>
);

const TestimonialCard = ({ image, name, feedback }) => (
  <div
    className="
    bg-[#0f1f14]
    border border-[#1f3d2b]
    rounded-xl overflow-hidden
    hover:shadow-[0_0_25px_rgba(0,255,87,0.15)]
    hover:scale-105
    transition-all duration-300
  "
  >
    <img src={image} alt={name} className="w-full h-48 object-cover" />
    <div className="p-6">
      <p className="text-gray-300 text-sm italic mb-3">“{feedback}”</p>
      <h4 className="text-lg font-semibold text-[#00ff57]">{name}</h4>
    </div>
  </div>
);

export default HomePage;
