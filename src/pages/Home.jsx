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

  const features = [
    {
      icon: <Calendar className="w-10 h-10 text-[var(--icon-blue)]" />,
      title: "Class Schedule Tracker",
      desc: "Never miss a lecture again with color-coded class schedules.",
    },
    {
      icon: <DollarSign className="w-10 h-10 text-[var(--icon-green)]" />,
      title: "Budget Tracker",
      desc: "Track income, expenses, and savings with charts & insights.",
    },
    {
      icon: <FileText className="w-10 h-10 text-[var(--icon-purple)]" />,
      title: "Exam Q&A Generator",
      desc: "Generate quizzes, MCQs, and true/false questions to prepare.",
    },
    {
      icon: <Target className="w-10 h-10 text-[var(--icon-red)]" />,
      title: "Study Planner",
      desc: "Break down goals, set deadlines, and prioritize tasks easily.",
    },
  ];

  const whyChoose = [
    {
      icon: <Zap className="w-10 h-10 text-[var(--icon-yellow)]" />,
      title: "Fast & Simple",
      desc: "Built for students with zero complexity, get organized in minutes.",
    },
    {
      icon: <Target className="w-10 h-10 text-[var(--icon-red)]" />,
      title: "Goal-Oriented",
      desc: "Designed to help you stay focused on exams, deadlines, and personal goals.",
    },
    {
      icon: <FileText className="w-10 h-10 text-[var(--icon-blue)]" />,
      title: "All-in-One",
      desc: "No need for 5 different apps — everything you need is here.",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Sign Up Free",
      desc: "Create your free account in less than 1 minute.",
    },
    {
      step: "2",
      title: "Add Your Classes",
      desc: "Import or manually add your courses, exams, and schedule.",
    },
    {
      step: "3",
      title: "Stay Organized",
      desc: "Track your progress, reminders, and goals all in one place.",
    },
  ];

  const faqs = [
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
  ];

  return (
    <div className="bg-[var(--bg-page)] text-[var(--text-primary)]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center gap-10 ">
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
            className="text-[var(--text-secondary)] text-lg"
          >
            Track your classes, manage your money, plan your studies, and ace your
            exams — all in one place.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-[var(--btn-bg)] hover:bg-[var(--btn-hover)] text-[var(--btn-text)] rounded-lg shadow transition"
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
          <Lottie animationData={learningAnimation} loop className="w-80 md:w-[400px]" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[var(--bg-section)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="bg-[var(--bg-card)] shadow rounded-xl p-6 text-center space-y-3"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{feature.desc}</p>
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
          <Lottie animationData={TimeManagement} loop className="w-80 md:w-[400px]" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex-1 space-y-6 text-end"
        >
          <h2 className="text-3xl font-bold">Unique Feature: Smart Study Reminders</h2>
          <p className="text-[var(--text-secondary)]">
            Never miss your study goals! Campus Pilot sends reminders before deadlines
            and suggests optimal study times.
          </p>
          <motion.button
            onClick={() => navigate("/dashboard/planner")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-[var(--btn-bg)] hover:bg-[var(--btn-hover)] text-[var(--btn-text)] rounded-lg shadow transition"
          >
            Try It Now
          </motion.button>
        </motion.div>
      </section>

      {/* Quiz Mode Section */}
      <section className="py-20 bg-[var(--bg-section)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-10">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1 space-y-6"
          >
            <h2 className="text-3xl font-bold">Quiz Mode</h2>
            <p className="text-[var(--text-secondary)]">
              Turn studying into a fun challenge! Test yourself with timed quizzes,
              instant feedback, and progress tracking.
            </p>
            <motion.button
              onClick={() => navigate("/dashboard/qa")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[var(--btn-bg)] hover:bg-[var(--btn-hover)] text-[var(--btn-text)] rounded-lg shadow transition"
            >
              Start a Quiz
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1 flex justify-center"
          >
            <Lottie animationData={Quiz} loop className="w-80 md:w-[400px]" />
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Campus Pilot?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whyChoose.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-[var(--bg-card)] shadow rounded-xl p-6 text-center space-y-4"
            >
              <div className="flex justify-center">{item.icon}</div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-[var(--text-secondary)]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[var(--bg-section)]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Get Started in 3 Easy Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="bg-[var(--bg-card)] rounded-xl shadow-lg p-6 space-y-4"
              >
                <div className="w-12 h-12 flex items-center justify-center mx-auto rounded-full bg-[var(--btn-bg)] text-[var(--btn-text)] text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-[var(--text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.button
            onClick={() => navigate("/auth/sign-up")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-12 px-6 py-3 bg-[var(--btn-bg)] hover:bg-[var(--btn-hover)] text-[var(--btn-text)] rounded-lg shadow transition"
          >
            Get Started Now
          </motion.button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <div className="mb-10 flex justify-center items-center">
          <Lottie animationData={FAQ} loop className="w-24" />
        </div>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-[var(--bg-card)] p-6 rounded-xl shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
              <p className="text-[var(--text-secondary)]">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
