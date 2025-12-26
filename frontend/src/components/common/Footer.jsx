import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0b0f0c] text-gray-300 py-12 border-t border-gray-800 ">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6">
        {/* Newsletter */}
        <div>
          <h3 className="text-lg text-white mb-4 font-semibold">Newsletter</h3>
          <p className="text-gray-400 mb-4">
            Be the first to hear about new proteins, exclusive events, and
            offers.
          </p>
          <p className="text-sm mb-6">Sign up and get 10% off on membership.</p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your Email"
              className="p-3 w-full text-sm rounded-l-md border border-gray-700 bg-transparent text-white focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#00ff57] font-semibold cursor-pointer text-black px-6 py-3 text-sm rounded-r-md hover:bg-[#27ff27] transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg text-white mb-4 font-semibold">Company</h3>
          <ul className="space-y-2">
            {["About Us", "Services", "Schedule", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  to="#"
                  className="hover:text-[#12ed12] transition-colors duration-200"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg text-white mb-4 font-semibold">Support</h3>
          <ul className="space-y-2">
            {["Contact Us", "FAQ's", "Features"].map((item) => (
              <li key={item}>
                <Link
                  to="#"
                  className="hover:text-[#12ed12] transition-colors duration-200"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-lg text-white mb-4 font-semibold">Follow Us</h3>
          <div className="flex items-center space-x-4 mb-6">
            <TbBrandMeta className="h-5 w-5 hover:text-[#12ed12] cursor-pointer" />
            <IoLogoInstagram className="h-5 w-5 hover:text-[#12ed12] cursor-pointer" />
            <RiTwitterXLine className="h-4 w-4 hover:text-[#12ed12] cursor-pointer" />
          </div>
          <p className="text-gray-400 mb-1">Call Us</p>
          <p className="text-white font-medium">
            <FiPhoneCall className="inline-block mr-2" /> 0123-456-789
          </p>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        © 2025, CompileTab. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
