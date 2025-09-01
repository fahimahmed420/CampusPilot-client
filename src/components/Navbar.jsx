import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { useAuth } from "../Auth/AuthContext";
import { Sun, Moon } from "lucide-react";

const getInitials = (name) => {
    if (!name) return "U";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};

const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

const nameTagVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 },
};

const mobileMenuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
};

export default function Navbar() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [nameVisible, setNameVisible] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [theme, setTheme] = useState("light");
    const dropdownRef = useRef(null);

    const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll effect for navbar background
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Load theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }, []);

    // Toggle theme and save to localStorage
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-black/90  backdrop-blur-md shadow-md"
                    : "bg-transparent dark:bg-transparent"
            }`}
            aria-label="Main Navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo with sliding underline */}
                    <Link to="/" className="relative group flex items-center gap-2">
                        <FaPaperPlane size={24} className="text-blue-400" />
                        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                            Campus Pilot
                        </span>
                        {/* Underline Animation */}
                        <span className="absolute left-8 bottom-0 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-[155px] transition-all duration-500"></span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!user ? (
                            <>
                                <Link
                                    to="/auth/login"
                                    className="relative inline-block px-5 py-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 hover:opacity-100 transition-all duration-300"></span>
                                    <span className="relative">Login</span>
                                </Link>
                                <Link
                                    to="/auth/sign-up"
                                    className="relative inline-block px-5 py-2 text-white font-semibold bg-gradient-to-r from-green-500 to-green-700 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 opacity-0 hover:opacity-100 transition-all duration-300"></span>
                                    <span className="relative">Sign Up</span>
                                </Link>
                            </>
                        ) : (
                            <div ref={dropdownRef} className="relative dropdown-container">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="User Avatar"
                                        title={displayName}
                                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-white hover:scale-105 transition"
                                        onClick={() => setDropdownOpen((prev) => !prev)}
                                    />
                                ) : (
                                    <div
                                        onClick={() => setDropdownOpen((prev) => !prev)}
                                        className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full cursor-pointer hover:scale-105 transition"
                                    >
                                        {getInitials(displayName)}
                                    </div>
                                )}

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            variants={dropdownVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-44 bg-gray-900 text-white shadow-lg rounded-lg py-2 backdrop-blur-md bg-opacity-90 transition-colors duration-300"
                                        >
                                            <p className="px-4 py-2 border-b border-gray-700">
                                                {displayName}
                                            </p>
                                            <Link
                                                to="/dashboard/home"
                                                className="block px-4 py-2 hover:bg-gray-800"
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={logout}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-800"
                                            >
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle Theme"
                            className="text-white dark:text-gray-200 hover:scale-110 transition transform duration-300"
                        >
                            {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        {/* Theme Toggle for Mobile */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle Theme"
                            className="text-white dark:text-gray-200 mr-2"
                        >
                            {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
                        </button>

                        {user && (
                            <div className="relative">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="User Avatar"
                                        title={displayName}
                                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
                                        onClick={() => setNameVisible((prev) => !prev)}
                                    />
                                ) : (
                                    <div
                                        onClick={() => setNameVisible((prev) => !prev)}
                                        className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full cursor-pointer"
                                    >
                                        {getInitials(displayName)}
                                    </div>
                                )}
                                <AnimatePresence>
                                    {nameVisible && (
                                        <motion.div
                                            variants={nameTagVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.2 }}
                                            className="absolute -top-10 right-0 bg-gray-900 px-3 py-1 rounded text-white text-sm shadow-md"
                                        >
                                            {displayName}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            aria-label="Toggle Mobile Menu"
                            className="text-white dark:text-gray-200 focus:outline-none text-2xl"
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="md:hidden px-4 pb-3 space-y-2 bg-black/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md overflow-hidden transition-colors duration-300"
                    >
                        {!user ? (
                            <>
                                <Link
                                    to="/auth/login"
                                    className="block w-full px-4 py-2 text-left rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-transform duration-300 hover:scale-105"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/auth/sign-up"
                                    className="block w-full px-4 py-2 text-left rounded-md text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition-transform duration-300 hover:scale-105"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/dashboard/home"
                                    className="block px-4 py-2 rounded-md text-white hover:bg-gray-800"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 rounded-md text-white hover:bg-gray-800"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
