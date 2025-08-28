import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";

export default function Navbar({ user }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="sticky top-0 z-50 bg-black/70 backdrop-blur-md shadow-md transition-all duration-300">
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
                                <Link
                                    to={"login"}
                                    className="group relative cursor-pointer rounded-md border-[0.08em] border-white bg-black px-1 py-0.5 text-[12px]"
                                >
                                    <span className="relative bottom-[0.4em] flex px-3 py-1 items-center hover:text-blue-400 justify-center rounded-sm border-[0.08em] border-white bg-black text-[1.5em] text-white shadow-[0_0.4em_0.1em_0.019em_#fff] transition-all duration-1000 group-hover:translate-y-[0.4em] group-hover:shadow-none group-hover:duration-500">
                                        Login
                                    </span>
                                </Link>

                                <Link
                                    to={"sign-up"}
                                    className="group relative cursor-pointer rounded-md border-[0.08em] border-white bg-black px-1 py-0.5 text-[12px]"
                                >
                                    <span className="relative bottom-[0.4em] flex px-3 py-1 items-center hover:text-blue-400 justify-center rounded-sm border-[0.08em] border-white bg-black text-[1.5em] text-white shadow-[0_0.4em_0.1em_0.019em_#fff] transition-all duration-1000 group-hover:translate-y-[0.4em] group-hover:shadow-none group-hover:duration-500">
                                        Sign Up
                                    </span>
                                </Link>
                            </>
                        ) : (
                            <div className="relative">
                                <img
                                    src={user.image || "https://i.pravatar.cc/40"}
                                    alt="User"
                                    className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                />
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-40 bg-gray-900 text-white shadow-lg rounded-lg py-2"
                                        >
                                            <a
                                                href="/dashboard"
                                                className="block px-4 py-2 hover:bg-gray-800"
                                            >
                                                Dashboard
                                            </a>
                                            <button
                                                onClick={() => alert("Logout clicked")}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-800"
                                            >
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
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
                                <button className="block w-full px-4 py-2 text-left rounded-md text-blue-400 border border-blue-400 hover:bg-blue-600 hover:text-white transition">
                                    Log In
                                </button>
                                <button className="block w-full px-4 py-2 text-left rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                <a
                                    href="/dashboard"
                                    className="block px-4 py-2 rounded-md text-white hover:bg-gray-800"
                                >
                                    Dashboard
                                </a>
                                <button
                                    onClick={() => alert("Logout clicked")}
                                    className="block w-full text-left px-4 py-2 rounded-md text-white hover:bg-gray-800"
                                >
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
