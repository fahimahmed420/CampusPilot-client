import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-black text-gray-300 py-20">
      <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        
        {/* Logo with animation */}
        <motion.h1
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.1, color: "#3B82F6" }}
        >
          Campus Pilot
        </motion.h1>

        {/* Social Icons */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          {[
            { icon: <FaFacebook />, link: "#" },
            { icon: <FaTwitter />, link: "#" },
            { icon: <FaLinkedin />, link: "#" },
            { icon: <FaInstagram />, link: "#" },
            { icon: <FaGithub />, link: "#" },
          ].map((item, idx) => (
            <motion.a
              key={idx}
              href={item.link}
              className="text-gray-400 hover:text-white text-xl"
              whileHover={{ scale: 1.3, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              {item.icon}
            </motion.a>
          ))}
        </div>
      </div>

      {/* Bottom text */}
      <p className="text-center text-sm text-gray-500 mt-6">
        © {new Date().getFullYear()} Campus Pilot. All rights reserved.
      </p>
    </footer>
  );
}
