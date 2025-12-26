import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:9000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="bg-[#0b0f0c] mt-15 min-h-screen text-white px-4 sm:px-6 md:px-10 py-16">
      <div className="max-w-6xl mx-auto mt-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Have a question, feedback, or need help? Get in touch with the
            FitLife team.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="bg-[#111811] border border-[#1e2d22] rounded-xl p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-bold mb-4">Reach Us</h2>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-[#00ff57]" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-400 text-sm">support@fitlife.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-[#00ff57]" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-400 text-sm">+1 (800) 555-0199</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-[#00ff57]" />
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-gray-400 text-sm">
                  FitLife HQ, San Francisco, CA
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#111811] border border-[#1e2d22] rounded-xl p-6 sm:p-8 space-y-5"
          >
            <h2 className="text-2xl font-bold mb-4">Send a Message</h2>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-[#0b0f0c] border border-[#243628] text-white focus:outline-none focus:border-[#00ff57]"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-[#0b0f0c] border border-[#243628] text-white focus:outline-none focus:border-[#00ff57]"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows="4"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-[#0b0f0c] border border-[#243628] text-white focus:outline-none focus:border-[#00ff57]"
                placeholder="Write your message..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#00ff57] hover:bg-[#25d660] text-black font-semibold py-3 rounded-lg transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
