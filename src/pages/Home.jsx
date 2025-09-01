// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Calendar, DollarSign, FileText, Target, Zap } from "lucide-react";
import learningAnimation from "../assets/Learning.json";
import TimeManagement from "../assets/Time-management.json";
import Quiz from "../assets/Quiz.json";
import FAQ from "../assets/FAQ-web-page.json";
import { useNavigate } from "react-router";


export default function HomePage() {
    const navigate = useNavigate();
    return (
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center gap-10">
                {/* Text */}
                <div className="flex-1 space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold leading-tight"
                    >
                        Simplify Your Student Life
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-lg text-gray-600 dark:text-gray-300"
                    >
                        Track your classes, manage your money, plan your studies, and ace
                        your exams — all in one place.
                    </motion.p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-blue-600 cursor-pointer text-white rounded-lg shadow hover:bg-blue-700 transition"
                        onClick={() => navigate("/dashboard/home")}
                    >
                        Get Started
                    </motion.button>
                </div>

                {/* Lottie Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 flex justify-center"
                >
                    <Lottie
                        animationData={learningAnimation}
                        loop={true}
                        className="w-80 md:w-[400px]"
                    />
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="bg-gray-50 dark:bg-gray-800 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-10">
                        Key Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Calendar className="w-10 h-10 text-blue-600" />,
                                title: "Class Schedule Tracker",
                                desc: "Never miss a lecture again with color-coded class schedules.",
                            },
                            {
                                icon: <DollarSign className="w-10 h-10 text-green-600" />,
                                title: "Budget Tracker",
                                desc: "Track income, expenses, and savings with charts & insights.",
                            },
                            {
                                icon: <FileText className="w-10 h-10 text-purple-600" />,
                                title: "Exam Q&A Generator",
                                desc: "Generate quizzes, MCQs, and true/false questions to prepare.",
                            },
                            {
                                icon: <Target className="w-10 h-10 text-red-600" />,
                                title: "Study Planner",
                                desc: "Break down goals, set deadlines, and prioritize tasks easily.",
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.5 }}
                                className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 text-center space-y-3"
                            >
                                <div className="flex justify-center">{feature.icon}</div>
                                <h3 className="text-lg font-semibold">{feature.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Unique Feature Section */}
            <section className="py-20 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
                {/* Illustration */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex-1 flex justify-center"
                >
                    <Lottie
                        animationData={TimeManagement}
                        loop={true}
                        className="w-80 md:w-[400px]"
                    />
                </motion.div>

                {/* Text */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex-1 space-y-6 text-end"
                >
                    <h2 className="text-3xl font-bold">
                        Unique Feature: Smart Study Reminders
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Never miss your study goals! Campus Pilot sends you reminders before
                        deadlines and suggests optimal study times based on your schedule
                        and workload.
                    </p>
                    <motion.button
                        onClick={() => navigate("/dashboard/planner")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-blue-600 cursor-pointer text-white rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Try It Now
                    </motion.button>
                </motion.div>
            </section>

            {/* Quiz Mode Section */}
            <section className="bg-gray-50 dark:bg-gray-800 py-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
                    {/* Text */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="flex-1 space-y-6"
                    >
                        <h2 className="text-3xl font-bold">Quiz Mode</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Turn studying into a fun challenge! Our interactive Quiz Mode lets
                            you test yourself with timed quizzes, instant feedback, and
                            progress tracking to keep you motivated.
                        </p>
                        <motion.button
                            onClick={() => navigate("/dashboard/qa")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-blue-600 cursor-pointer text-white rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            Start a Quiz
                        </motion.button>
                    </motion.div>

                    {/* Illustration */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="flex-1 flex justify-center"
                    >
                        <Lottie
                            animationData={Quiz}
                            loop={true}
                            className="w-80 md:w-[400px]"
                        />
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 max-w-4xl mx-auto px-6">
                <div className="mb-10 flex justify-center items-center">
                    <Lottie
                        animationData={FAQ}
                        loop={true}
                        className="w-24" />
                </div>
                <div className="space-y-6">
                    {[
                        {
                            q: "Is Campus Pilot free to use?",
                            a: "Yes! Campus Pilot offers free access to all core tools for students.",
                        },
                        {
                            q: "Can I use Campus Pilot on mobile?",
                            a: "Absolutely. Campus Pilot is fully responsive and works on phones, tablets, and desktops.",
                        },
                        {
                            q: "How does Quiz Mode help me?",
                            a: "Quiz Mode makes learning interactive with instant feedback, so you can learn faster.",
                        },
                    ].map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow"
                        >
                            <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
