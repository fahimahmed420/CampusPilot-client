import { Link, NavLink, Outlet } from "react-router-dom";
import { Home, Calendar, DollarSign, Book, HelpCircle, Moon, Sun } from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useAuth } from "../Auth/AuthContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";

export default function DashboardLayout() {
    const { user,logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dropdownButtonRef = useRef(null);
    const [theme, setTheme] = useState("light");

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                dropdownButtonRef.current &&
                !dropdownButtonRef.current.contains(e.target)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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

    const SidebarLinks = () => (
        <nav className="flex-1 px-2 py-6 space-y-1">
            <NavItem to="/dashboard/home" icon={<Home size={18} />} label="Dashboard" />
            <NavItem to="/dashboard/schedule" icon={<Calendar size={18} />} label="Class Schedule" />
            <NavItem to="/dashboard/budget" icon={<DollarSign size={18} />} label="Budget Tracker" />
            <NavItem to="/dashboard/planner" icon={<Book size={18} />} label="Study Planner" />
            <NavItem to="/dashboard/qa" icon={<HelpCircle size={18} />} label="Q&A Generator" />
        </nav>
    );

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar always visible */}
            <aside className="bg-black text-white w-48 xl:w-56 flex-col hidden lg:flex">
                <div className="flex items-center h-16 px-4  py-4 border-b border-gray-700">
                    <Link to="/" className="flex items-center text-3xl gap-2 hover:opacity-80">
                        <IoMdArrowRoundBack /> Home
                    </Link>
                </div>
                <SidebarLinks />
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white dark:bg-black ">
                    <div className="flex items-center justify-between h-16  px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h1>
                        <div className="relative flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-110 transition"
                                aria-label="Toggle Theme"
                            >
                                {theme === "light" ? (
                                    <Moon size={20} className="text-white" />
                                ) : (
                                    <Sun size={20} className="text-yellow-400" />
                                )}
                            </button>
                            {/* Avatar */}
                            <button
                                ref={dropdownButtonRef}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="relative">
                                {user?.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName || user.email || "User avatar"}
                                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-white object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full cursor-pointer">
                                        {getInitials(user?.displayName || user?.email || "U")}
                                    </div>
                                )}
                            </button>


                            {/* Mobile dropdown menu */}
                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        ref={dropdownRef}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-3 right-0 mt-12 w-48 bg-white space-y-1 text-black shadow-lg rounded-md z-50 p-2"
                                    >
                                        <NavLink
                                            to="/"
                                            className={({ isActive }) =>
                                                `flex items-center lg:hidden gap-2 px-3 py-2 rounded-md transition ${isActive ? "bg-blue-500 text-white" : "hover:bg-blue-400"
                                                }`
                                            }
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <FaPaperPlane size={18} /> Home
                                        </NavLink>

                                        <NavLink
                                            to="/dashboard/home"
                                            className={({ isActive }) =>
                                                `flex items-center lg:hidden gap-2 px-3 py-2 rounded-md transition ${isActive ? "bg-gray-700 text-white" : "hover:bg-gray-400"
                                                }`
                                            }
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <Home size={18} /> Dashboard Home
                                        </NavLink>

                                        <NavLink
                                            to="/dashboard/schedule"
                                            className={({ isActive }) =>
                                                `flex items-center lg:hidden gap-2 px-3 py-2 rounded-md transition ${isActive ? "bg-gray-700 text-white" : "hover:bg-gray-400"
                                                }`
                                            }
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <Calendar size={18} /> Class Schedule
                                        </NavLink>

                                        <NavLink
                                            to="/dashboard/budget"
                                            className={({ isActive }) =>
                                                `flex items-center lg:hidden gap-2 px-3 py-2 rounded-md transition ${isActive ? "bg-gray-700 text-white" : "hover:bg-gray-400"
                                                }`
                                            }
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <DollarSign size={18} /> Budget Tracker
                                        </NavLink>

                                        <NavLink
                                            to="/dashboard/planner"
                                            className={({ isActive }) =>
                                                `flex items-center lg:hidden gap-2 px-3 py-2 rounded-md transition ${isActive ? "bg-gray-700 text-white" : "hover:bg-gray-400"
                                                }`
                                            }
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <Book size={18} /> Study Planner
                                        </NavLink>

                                        <NavLink
                                            to="/dashboard/qa"
                                            className={({ isActive }) =>
                                                `flex items-center lg:hidden gap-2 px-3 py-2 rounded-md transition ${isActive ? "bg-gray-700 text-white" : "hover:bg-gray-400"
                                                }`
                                            }
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <HelpCircle size={18} /> Q&A Generator
                                        </NavLink>

                                        <NavLink
                                    
                                            className="flex items-center gap-2 px-3 py-2 rounded-md transition bg-red-400 hover:bg-red-600"
                                             onClick={logout}
                                        >
                                            <IoMdArrowRoundBack size={18} /> Logout
                                        </NavLink>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    </div>
                </header>

                {/* Children */}
                <main className="p-4 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

/* Sidebar Nav Item with active state */
function NavItem({ to, icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
            }
        >
            {icon}
            {label}
        </NavLink>
    );
}
