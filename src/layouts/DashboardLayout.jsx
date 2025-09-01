import { Link, NavLink, Outlet } from "react-router-dom";
import { Home, Calendar, DollarSign, Book, HelpCircle } from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useAuth } from "../Auth/AuthContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout() {
    const { user } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dropdownButtonRef = useRef(null);

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
                <header className="flex items-center justify-between bg-white dark:bg-black h-16 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h1>
                    <div className="relative flex items-center gap-3">
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
                        <label
                            class="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-900"
                        >
                            <input class="peer sr-only" id="AcceptConditions" type="checkbox" />
                            <span
                                class="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"
                            ></span>
                        </label>


                        {/* Mobile dropdown menu */}
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    ref={dropdownRef}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-3 right-0 mt-12 w-48 bg-white text-black shadow-lg rounded-md z-50 p-2 "
                                >
                                    <Link to="/dashboard/dashboardpage" className="flex items-center lg:hidden gap-2 px-3 py-2 hover:bg-gray-400 rounded-md transition"
                                        onClick={() => setDropdownOpen(false)}>
                                        <Home size={18} /> Dashboard Home
                                    </Link>
                                    <Link to="/dashboard/schedule" className="flex items-center lg:hidden gap-2 px-3 py-2 hover:bg-gray-400 rounded-md transition"
                                        onClick={() => setDropdownOpen(false)}>
                                        <Calendar size={18} /> Class Schedule
                                    </Link>
                                    <Link to="/dashboard/budget" className="flex items-center lg:hidden gap-2 px-3 py-2 hover:bg-gray-400 rounded-md transition"
                                        onClick={() => setDropdownOpen(false)}>
                                        <DollarSign size={18} /> Budget Tracker
                                    </Link>
                                    <Link to="/dashboard/planner" className="flex items-center lg:hidden gap-2 px-3 py-2 hover:bg-gray-400 rounded-md transition"
                                        onClick={() => setDropdownOpen(false)}>
                                        <Book size={18} /> Study Planner
                                    </Link>
                                    <Link to="/dashboard/qa" className="flex items-center lg:hidden gap-2 px-3 py-2 hover:bg-gray-400 rounded-md transition"
                                        onClick={() => setDropdownOpen(false)}>
                                        <HelpCircle size={18} /> Q&A Genarator
                                    </Link>
                                    <Link to="/" className="flex items-center gap-2 px-3 py-2 hover:bg-red-400 rounded-md transition"
                                        onClick={() => setDropdownOpen(false)}>
                                        <IoMdArrowRoundBack size={18} /> Logout
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                {/* Children */}
                <main className="p-6 flex-1 overflow-y-auto">
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
