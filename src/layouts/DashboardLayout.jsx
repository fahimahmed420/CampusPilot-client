import { Link, NavLink, Outlet } from "react-router-dom";
import { Home, Calendar, DollarSign, Book, HelpCircle } from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import { useAuth } from "../Auth/AuthContext";

export default function DashboardLayout() {
    const { user } = useAuth();

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0f1e3a] text-white flex flex-col">
                {/* Logo / Brand */}
                <div className="flex items-center gap-2 px-6 py-6 text-lg font-semibold border-b border-gray-700">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80">
                        <IoHomeOutline className="flex md:hidden" /> <IoMdArrowRoundBack />
                        <span className="hidden md:flex">Back To Home</span>
                    </Link>
                </div>

                {/* Sidebar Links */}
                <nav className="flex-1 px-4 py-6 space-y-3">
                    <NavItem to="/dashboard/dashboardpage" icon={<Home size={18} />} label="Dashboard" />
                    <NavItem to="/dashboard/schedule" icon={<Calendar size={18} />} label="Class Schedule" />
                    <NavItem to="/dashboard/budget" icon={<DollarSign size={18} />} label="Budget Tracker" />
                    <NavItem to="/dashboard/planner" icon={<Book size={18} />} label="Study Planner" />
                    <NavItem to="/dashboard/qa" icon={<HelpCircle size={18} />} label="Q&A Generator" />
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold">Campus Pilot</h1>
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        {user?.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt={user.displayName || user.email || "User avatar"}
                                className="w-10 h-10 rounded-full cursor-pointer border-2 border-white object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 flex items-center justify-center bg-blue-500 
                              text-white font-bold rounded-full cursor-pointer">
                                {getInitials(user?.displayName || user?.email || "User")}
                            </div>
                        )}
                        {/* Name */}
                        <span className="text-sm font-medium">
                            {user?.displayName || user?.email || "Guest"}
                        </span>
                    </div>
                </header>

                {/* Children */}
                <main className="p-6 flex-1 overflow-y-auto">
                    <Outlet /> {/* Nested routes render here */}
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
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium 
        ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
            }
        >
            {icon}
            {label}
        </NavLink>
    );
}
