import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuth } from "../../Auth/AuthContext";
import Modal from "../../components/Modal";
import { useAxios } from "../../hooks/useAxios";

const hours = [
    "8 AM", "9 AM", "10 AM", "11 AM",
    "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const colors = [
    "bg-purple-500", "bg-orange-500", "bg-teal-500",
    "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"
];

export default function ClassSchedule() {
    const { user } = useAuth();
    const axiosInstance = useAxios();
    const [classes, setClasses] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState("All Subjects");

    const [form, setForm] = useState({
        subject: "",
        teacher: "",
        day: "Mon",
        time: "8 AM"
    });

    // Fetch classes from backend
    useEffect(() => {
        const fetchClasses = async () => {
            if (!user) return;
            try {
                const res = await axiosInstance.get("/classes", {
                    params: { uid: user.uid },
                });
                setClasses(res.data);
            } catch (err) {
                console.error("Failed to fetch classes:", err);
            }
        };
        fetchClasses();
    }, [user, axiosInstance]);

    const addClass = async () => {
        if (!form.subject || !form.teacher) {
            alert("Please fill in all fields!");
            return;
        }

        const newClass = {
            ...form,
            uid: user.uid,
            color: colors[Math.floor(Math.random() * colors.length)],
        };

        try {
            const res = await axiosInstance.post("/classes", newClass);
            if (res.data.success) {
                setClasses([...classes, res.data.class]); // add class with _id from DB
                setForm({ subject: "", teacher: "", day: "Mon", time: "8 AM" });
                setIsOpen(false);
            }
        } catch (err) {
            console.error("Failed to add class:", err);
            alert("Failed to save class. Try again!");
        }
    };

    const filteredClasses =
        filter === "All Subjects"
            ? classes
            : classes.filter((c) => c.subject === filter);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Class Schedule Tracker</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 shadow-lg"
                >
                    + Add Class
                </button>
            </div>

            {/* Filter */}
            <div className="mb-4">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-gray-800 p-2 rounded-lg"
                >
                    <option>All Subjects</option>
                    {[...new Set(classes.map((c) => c.subject))].map((s) => (
                        <option key={s}>{s}</option>
                    ))}
                </select>
            </div>

            {/* Schedule Grid */}
            <div className="grid grid-cols-8 border border-gray-700 rounded-lg">
                {/* Top Row (Day Labels) */}
                <div className="h-12 flex items-center justify-center font-semibold border-r border-b border-gray-700">
                    Time/Day
                </div>
                {days.map((day) => (
                    <div
                        key={day}
                        className="h-12 flex items-center justify-center font-semibold border-r border-b border-gray-700"
                    >
                        {day}
                    </div>
                ))}

                {/* Time rows */}
                {hours.map((h) => (
                    <React.Fragment key={h}>
                        {/* Time column */}
                        <div className="h-16 flex items-center justify-center border-r border-b border-gray-700 text-sm">
                            {h}
                        </div>

                        {/* Day columns */}
                        {days.map((day) => (
                            <div
                                key={day + h}
                                className="h-16 relative border-r border-b border-gray-800"
                            >
                                {filteredClasses
                                    .filter((c) => c.day === day && c.time === h)
                                    .map((c) => (
                                        <motion.div
                                            key={c._id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`${c.color} absolute inset-1 rounded-lg shadow-lg p-2 text-xs`}
                                        >
                                            <div className="font-bold">{c.subject}</div>
                                            <div className="text-[11px]">{c.teacher}</div>
                                        </motion.div>
                                    ))}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>


            {/* Add Class Modal */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="text-lg font-semibold mb-4">Add Class</h2>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Class Name"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full p-2 rounded-lg bg-gray-700"
                    />
                    <input
                        type="text"
                        placeholder="Teacher"
                        value={form.teacher}
                        onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                        className="w-full p-2 rounded-lg bg-gray-700"
                    />
                    <select
                        value={form.day}
                        onChange={(e) => setForm({ ...form, day: e.target.value })}
                        className="w-full p-2 rounded-lg bg-gray-700"
                    >
                        {days.map((d) => (
                            <option key={d}>{d}</option>
                        ))}
                    </select>
                    <select
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        className="w-full p-2 rounded-lg bg-gray-700"
                    >
                        {hours.map((h) => (
                            <option key={h}>{h}</option>
                        ))}
                    </select>
                    <button
                        onClick={addClass}
                        className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700"
                    >
                        Save
                    </button>
                </div>
            </Modal>
        </div>
    );
}
