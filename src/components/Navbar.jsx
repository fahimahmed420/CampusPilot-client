import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { useAuth } from "../Auth/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [nameVisible, setNameVisible] = useState(false); // For mobile name display
    const [dropdownOpen, setDropdownOpen] = useState(false); // For desktop

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <div className="sticky top-0 z-50 bg-black shadow-md transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-white">
                            Campus Pilot
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!user ? (
                            <>
                                <Link to="/auth/login" className="text-white px-3 py-1 border border-white rounded hover:text-blue-400">Login</Link>
                                <Link to="/auth/sign-up" className="text-white px-3 py-1 border border-white rounded hover:text-blue-400">Sign Up</Link>
                            </>
                        ) : (
                            <div className="relative">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="User"
                                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                    />
                                ) : (
                                    <div
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full cursor-pointer"
                                    >
                                        {getInitials(user.displayName || user.email)}
                                    </div>
                                )}

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-44 bg-gray-900 text-white shadow-lg rounded-lg py-2 backdrop-blur-md bg-opacity-90"
                                        >
                                            <p className="px-4 py-2 border-b border-gray-700">
                                                {user.displayName || "User"}
                                            </p>
                                            <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-800">Dashboard</Link>
                                            <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-800">
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        {user && (
                            <div className="relative">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="User"
                                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
                                        onClick={() => setNameVisible(!nameVisible)}
                                    />
                                ) : (
                                    <div
                                        onClick={() => setNameVisible(!nameVisible)}
                                        className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full cursor-pointer"
                                    >
                                        {getInitials(user.displayName || user.email)}
                                    </div>
                                )}
                                <AnimatePresence>
                                    {nameVisible && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute -top-10 right-0 bg-gray-900 px-3 py-1 rounded text-white text-sm shadow-md"
                                        >
                                            {user.displayName || "User"}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-white focus:outline-none text-2xl"
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
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden px-4 pb-3 space-y-2 bg-black shadow-md"
                    >
                        {!user ? (
                            <>
                                <Link to="/auth/login" className="block w-full px-4 py-2 text-left rounded-md text-blue-400 border border-blue-400 hover:bg-blue-600 hover:text-white transition">
                                    Log In
                                </Link>
                                <Link to="/auth/sign-up" className="block w-full px-4 py-2 text-left rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" className="block px-4 py-2 rounded-md text-white hover:bg-gray-800">
                                    Dashboard
                                </Link>
                                <button onClick={logout} className="block w-full text-left px-4 py-2 rounded-md text-white hover:bg-gray-800">
                                    Logout
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
