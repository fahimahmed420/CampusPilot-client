import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { ArrowUpIcon, ArrowDownIcon, RefreshCw, Inbox } from "lucide-react";
import { motion } from "framer-motion";
import { useAxios } from "../../hooks/useAxios";
import { useAuth } from "../../Auth/AuthContext";

const DashboardPage = () => {
    const axios = useAxios();
    const { user } = useAuth();

    const [balance, setBalance] = useState(0);
    const [lastTransaction, setLastTransaction] = useState(null);
    const [todayClasses, setTodayClasses] = useState([]);
    const [recentScores, setRecentScores] = useState([]);
    const [weeklyHours, setWeeklyHours] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = days[new Date().getDay()];

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributes: true });
        // initial value
        setIsDarkMode(document.documentElement.classList.contains("dark"));
        return () => observer.disconnect();
    }, []);


    useEffect(() => {
        if (user?.uid) loadData();
    }, [user]);

    const loadData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchBalance(),
                fetchTodayClasses(),
                fetchRecentScores(),
                fetchWeeklyHours()
            ]);
            setLastUpdated(new Date());
        } catch (err) {
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const fetchBalance = async () => {
        const { data } = await axios.get(`/transactions/${user?.uid}`);
        const income = data.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0);
        const expense = data.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0);
        setBalance(income - expense);
        setLastTransaction(data[0] || null);
    };

    const fetchTodayClasses = async () => {
        const { data } = await axios.get(`/classes?uid=${user?.uid}`);
        setTodayClasses(data.filter(cls => cls.day === today));
    };

    const fetchRecentScores = async () => {
        const { data } = await axios.get(`/scores/${user?.uid}`);
        setRecentScores(data.scores.slice(0, 2));
    };

    const fetchWeeklyHours = async () => {
        const { data } = await axios.get(`/tasks`);
        const tasks = data.filter(task => task.status === "Completed");
        const hoursData = days.map(d => ({
            day: d,
            hours: tasks.filter(t => t.day === d).length
        }));
        setWeeklyHours(hoursData);
    };

    const SkeletonCard = () => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
    );

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 sm:px-6 lg:px-8 mt-10 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 md:mb-0">
                    Overview
                </h1>
                <button
                    onClick={loadData}
                    className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-2 text-sm"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {lastUpdated && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : (
                    <>
                        {/* Balance Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            <h2 className="text-gray-600 text-2xl dark:text-gray-300 mb-2">Balance</h2>
                            <p className="text-6xl font-bold text-gray-800 dark:text-gray-100">
                                ${balance.toFixed(2)}
                            </p>
                            {lastTransaction && (
                                <div className="flex items-center mt-4">
                                    {lastTransaction.type === "income" ? (
                                        <ArrowUpIcon className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <ArrowDownIcon className="w-4 h-4 text-red-500" />
                                    )}
                                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                                        ${lastTransaction.amount}
                                    </span>
                                </div>
                            )}
                        </motion.div>

                        {/* Today's Schedule */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            <h2 className="text-gray-600 text-2xl dark:text-gray-300 mb-2">Today's Schedule</h2>
                            {todayClasses.length > 0 ? (
                                todayClasses.map(cls => (
                                    <div key={cls.id} className="flex items-center mb-2">
                                        <span
                                            className={`w-4 h-4 rounded-sm mr-2 ${cls.color}`}
                                        ></span>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-100">{cls.subject}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{cls.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm flex items-center dark:text-gray-500">
                                    <Inbox className="w-4 h-4 mr-1" /> No classes today
                                </p>
                            )}
                        </motion.div>

                        {/* Recent Quiz Scores */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            <h2 className="text-gray-600 dark:text-gray-300 text-2xl mb-2">Recent Quiz Scores</h2>
                            {recentScores.length > 0 ? (
                                recentScores.map((score, index) => (
                                    <p key={index} className="text-gray-700 dark:text-gray-200 mb-1">
                                        {score.subject}:{" "}
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${score.score / score.total >= 0.7
                                                ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-100"
                                                : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-100"
                                                }`}
                                        >
                                            {score.score}/{score.total}
                                        </span>
                                    </p>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm flex items-center dark:text-gray-500">
                                    <Inbox className="w-4 h-4 mr-1" /> No quiz records
                                </p>
                            )}
                        </motion.div>

                        {/* Weekly Study Hours */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            <h2 className="text-gray-600 dark:text-gray-300 mb-2">Weekly Study Hours</h2>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyHours}>
                                        <defs>
                                            <linearGradient id="colorUvLight" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            </linearGradient>
                                            <linearGradient id="colorUvDark" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#d1d5db"} />
                                        <XAxis dataKey="day" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                                        <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                                                color: isDarkMode ? "#f9fafb" : "#111827",
                                                borderRadius: "6px",
                                                border: "none",
                                                padding: "6px 12px"
                                            }}
                                        />
                                        <Bar
                                            dataKey="hours"
                                            fill={isDarkMode ? "url(#colorUvDark)" : "url(#colorUvLight)"}
                                            radius={[8, 8, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>

                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
