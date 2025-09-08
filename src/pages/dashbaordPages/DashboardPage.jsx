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
import { useAuth } from "../../Auth/AuthContext";

const DashboardPage = () => {
    const { user, axiosInstance: axios } = useAuth();

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
        setIsDarkMode(document.documentElement.classList.contains("dark"));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (user?.uid && axios.defaults.headers.common["Authorization"]) {
            loadData();
        }
    }, [user, axios]);

    const loadData = async () => {
        try {
            setLoading(true);
            await Promise.allSettled([
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
        <div className="p-4 rounded-xl shadow animate-pulse bg-[var(--bg-section)]">
            <div className="h-4 rounded w-1/3 mb-4 bg-[var(--text-muted)]/30"></div>
            <div className="h-6 rounded w-1/2 mb-2 bg-[var(--text-muted)]/40"></div>
            <div className="h-4 rounded w-1/4 bg-[var(--text-muted)]/30"></div>
        </div>
    );

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-[var(--icon-red)]">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 px-4 sm:px-6 lg:px-8 mt-10 max-w-7xl mx-auto min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2 md:mb-0">
                    Overview
                </h1>
                <button
                    onClick={loadData}
                    className="flex items-center gap-2 text-sm text-[var(--text-accent)] hover:text-[var(--btn-hover)]"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {lastUpdated && (
                <p className="text-xs text-[var(--text-muted)]">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
            )}

            {/* Grid */}
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
                            className="p-4 rounded-xl shadow bg-[var(--bg-section)] hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            <h2 className="text-2xl mb-2 text-[var(--text-secondary)]">Balance</h2>
                            <p className="text-6xl font-bold text-[var(--text-primary)]">
                                ${balance.toFixed(2)}
                            </p>
                            {lastTransaction && (
                                <div className="flex items-center mt-4">
                                    {lastTransaction.type === "income" ? (
                                        <ArrowUpIcon className="w-4 h-4 text-[var(--icon-green)]" />
                                    ) : (
                                        <ArrowDownIcon className="w-4 h-4 text-[var(--icon-red)]" />
                                    )}
                                    <span className="ml-2 text-[var(--text-secondary)]">
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
                            className="p-4 rounded-xl shadow bg-[var(--bg-section)] hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            <h2 className="text-2xl mb-2 text-[var(--text-secondary)]">Today's Schedule</h2>
                            {todayClasses.length > 0 ? (
                                todayClasses.map(cls => (
                                    <div key={cls.id} className="flex items-center mb-2">
                                        <span className={`w-4 h-4 rounded-sm mr-2 ${cls.color}`} />
                                        <div>
                                            <p className="font-semibold text-[var(--text-primary)]">
                                                {cls.subject}
                                            </p>
                                            <p className="text-sm text-[var(--text-muted)]">{cls.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm flex items-center text-[var(--text-muted)]">
                                    <Inbox className="w-4 h-4 mr-1" /> No classes today
                                </p>
                            )}
                        </motion.div>

                        {/* Recent Quiz Scores */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="p-4 rounded-xl shadow bg-[var(--bg-section)] hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            <h2 className="text-2xl mb-2 text-[var(--text-secondary)]">Recent Quiz Scores</h2>
                            {recentScores.length > 0 ? (
                                recentScores.map((score, index) => (
                                    <p key={index} className="mb-1 text-[var(--text-primary)]">
                                        {score.subject}:{" "}
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${score.score / score.total >= 0.7
                                                ? "bg-[var(--icon-green)]/20 text-[var(--icon-green)]"
                                                : "bg-[var(--icon-red)]/20 text-[var(--icon-red)]"
                                                }`}
                                        >
                                            {score.score}/{score.total}
                                        </span>
                                    </p>
                                ))
                            ) : (
                                <p className="text-sm flex items-center text-[var(--text-muted)]">
                                    <Inbox className="w-4 h-4 mr-1" /> No quiz records
                                </p>
                            )}
                        </motion.div>

                        {/* Weekly Study Hours */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="p-4 rounded-xl shadow bg-[var(--bg-section)] hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            <h2 className="mb-2 text-[var(--text-secondary)]">Weekly Study Hours</h2>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyHours}>
                                        <defs>
                                            <linearGradient id="colorUvLight" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--icon-blue)" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="var(--icon-blue)" stopOpacity={0.2} />
                                            </linearGradient>
                                            <linearGradient id="colorUvDark" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--icon-blue)" stopOpacity={0.9} />
                                                <stop offset="95%" stopColor="var(--icon-blue)" stopOpacity={0.3} />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "var(--text-muted)" : "#d1d5db"} />
                                        <XAxis dataKey="day" stroke="var(--text-muted)" />
                                        <YAxis stroke="var(--text-muted)" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "var(--bg-card)",
                                                color: "var(--text-primary)",
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
