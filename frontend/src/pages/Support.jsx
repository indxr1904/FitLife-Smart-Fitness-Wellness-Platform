import React, { useState } from "react";
import {
  Mail,
  Phone,
  HelpCircle,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    question: "How do I start a workout plan?",
    answer:
      "Go to the Exercises section, choose a plan that fits your goal, and click on 'Start Plan' to begin.",
  },
  {
    question: "Can I switch plans after enrolling?",
    answer:
      "Yes, you can change or stop a workout plan anytime from your dashboard.",
  },
  {
    question: "Is FitLife free to use?",
    answer:
      "FitLife offers free basic plans. Premium plans may require a subscription.",
  },
  {
    question: "How does the nutrition plan work?",
    answer:
      "Nutrition plans are tailored to your fitness goal and are shown daily in the Nutrition section.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can email us, call us, or use the Contact page to send a message directly.",
  },
];

const Support = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="bg-[#0b0f0c] mt-15 text-white min-h-screen px-4 sm:px-6 md:px-10 py-16">
      <div className="max-w-4xl mx-auto mt-10 space-y-20">
        {/* ================= Header ================= */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Support & Help
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Everything you need to know about FitLife. Browse FAQs or reach out
            to our support team.
          </p>
        </div>

        {/* ================= FAQ Section ================= */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-7 h-7 text-[#00ff57]" />
            <h2 className="text-2xl font-semibold">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={`rounded-lg border transition-all ${
                    isOpen
                      ? "border-[#00ff57] bg-[#121a13]"
                      : "border-[#1e2d22] bg-[#111811]"
                  }`}
                >
                  {/* Question */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-6 w-1 rounded-full transition ${
                          isOpen ? "bg-[#00ff57]" : "bg-transparent"
                        }`}
                      />
                      <span className="font-medium text-sm sm:text-base">
                        {faq.question}
                      </span>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#00ff57]" : "text-gray-400"
                      }`}
                    />
                  </button>

                  {/* Answer */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={`mx-4 mb-4 rounded-lg transition-all duration-300 ${
                          isOpen ? "bg-[#0b0f0c] border border-[#1e2d22]" : ""
                        }`}
                      >
                        <p className="px-5 py-5 text-gray-300 text-sm sm:text-base leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= Contact Info ================= */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-[#00ff57]" />
            <h2 className="text-2xl font-semibold">Contact Support</h2>
          </div>

          <div className="bg-[#111811] border border-[#1e2d22] rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-[#00ff57]" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-gray-400 text-sm">support@fitlife.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-[#00ff57]" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-gray-400 text-sm">+1 (800) 555-0199</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Still need help?</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Our team is always ready to assist you.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="bg-[#00ff57] hover:bg-[#25d660] text-black font-semibold px-8 py-3 rounded-lg transition"
          >
            Contact Support
          </button>
        </section>
      </div>
    </div>
  );
};

export default Support;
