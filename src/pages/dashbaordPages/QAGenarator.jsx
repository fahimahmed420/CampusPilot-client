import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAxios } from "../../hooks/useAxios";
import { useAuth } from "../../Auth/AuthContext";
import { FaHistory } from "react-icons/fa"; // history icon

const QAGenerator = () => {
    const [subject, setSubject] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [amount, setAmount] = useState(5);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [scoreSaved, setScoreSaved] = useState(false);
    const [showRecords, setShowRecords] = useState(false);
    const { user } = useAuth();

    const axiosInstance = useAxios();

    const categories = {
        general: 9, books: 10, film: 11, music: 12, theatre: 13,
        television: 14, videogames: 15, boardgames: 16, science: 17,
        computers: 18, math: 19, mythology: 20, sports: 21,
        geography: 22, history: 23, politics: 24, art: 25,
        celebrities: 26, animals: 27, vehicles: 28,
    };

    // Fetch questions
    const fetchQuestions = async () => {
        if (!subject || !difficulty) {
            toast.error("Please select subject and difficulty!");
            return;
        }
        setLoading(true);
        setScore(0);
        setAnsweredCount(0);
        setScoreSaved(false);

        try {
            const res = await fetch(
                `https://opentdb.com/api.php?amount=${amount}&category=${categories[subject]}&difficulty=${difficulty}&type=multiple`
            );
            const data = await res.json();
            if (!data.results.length) {
                toast.error("No questions found. Try different settings.");
                setLoading(false);
                return;
            }

            const formatted = data.results.map((q) => {
                const options = [...q.incorrect_answers, q.correct_answer];
                return {
                    question: q.question,
                    correct: q.correct_answer,
                    options: options.sort(() => Math.random() - 0.5),
                    answered: false,
                    chosen: null,
                };
            });
            setQuestions(formatted);
        } catch (err) {
            toast.error("Failed to load questions.");
            console.error(err);
        }
        setLoading(false);
    };

    // Handle answer selection
    const handleAnswer = (qIndex, option) => {
        if (questions[qIndex].answered) return;
        const updated = [...questions];
        updated[qIndex].answered = true;
        updated[qIndex].chosen = option;
        setQuestions(updated);

        if (option === updated[qIndex].correct) {
            setScore((prev) => prev + 1);
            toast.success("Correct!");
        } else {
            toast.error("Wrong! Correct answer highlighted.");
        }

        setAnsweredCount((prev) => prev + 1);
    };

    // Auto-save score when quiz is finished
    useEffect(() => {
        // Only save if quiz has questions and all answered
        if (questions.length > 0 && answeredCount === questions.length && !scoreSaved) {
            saveScore(questions);
        }
    }, [answeredCount, questions, scoreSaved]);

    // Save score
    const saveScore = async (quizQuestions) => {
        try {
            if (!quizQuestions || quizQuestions.length === 0) return; // prevent undefined
            const res = await axiosInstance.post("/scores", {
                uid: user.uid,
                subject,
                difficulty,
                score,
                total: quizQuestions.length, // use the passed questions length
            });
            toast.success("Score saved!");
            setScoreSaved(true);
        } catch (err) {
            toast.error("Error saving score");
            console.error("❌ Error saving score:", err);
        }
    };


    // Toggle records
    const toggleRecords = async () => {
        if (!showRecords) {
            try {
                const res = await axiosInstance.get(`/scores/${user.uid}`);
                setRecords(res.data.scores || []);
            } catch (err) {
                toast.error("Failed to fetch records");
                console.error(err);
                return;
            }
        }
        setShowRecords(!showRecords);
    };

    // Reset quiz
    const resetQuiz = () => {
        setQuestions([]);
        setScore(0);
        setAnsweredCount(0);
        setSubject("");
        setDifficulty("");
        setAmount(5);
        setScoreSaved(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <Toaster position="top-right" />
            <div className="max-w-3xl mx-auto">
                {/* Headline with history icon */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-indigo-400">🎯 QAGenerator</h1>
                    <button
                        onClick={toggleRecords}
                        className="text-indigo-400 hover:text-indigo-200 text-2xl"
                        title={showRecords ? "Hide Records" : "Show Records"}
                    >
                        <FaHistory />
                    </button>
                </div>

                {/* Records */}
                {showRecords && records.length > 0 && (
                    <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                        <h2 className="text-xl font-bold mb-3">📊 Your Records</h2>
                        <ul className="space-y-2">
                            {records.map((r, i) => (
                                <li
                                    key={i}
                                    className="p-2 bg-gray-700 rounded flex justify-between"
                                >
                                    <span>
                                        {r.subject.charAt(0).toUpperCase() + r.subject.slice(1)} (Test {i + 1}) - {new Date(r.date).toLocaleString()}
                                    </span>

                                    <span>{r.score}/{r.total}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Quiz Inputs */}
                <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-lg space-y-4">
                    <div>
                        <label>Subject:</label>
                        <select
                            className="ml-2 border rounded p-2 bg-gray-700 text-white"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        >
                            <option value="">--Choose--</option>
                            {Object.keys(categories).map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Difficulty:</label>
                        <select
                            className="ml-2 border rounded p-2 bg-gray-700 text-white"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
                            <option value="">--Choose--</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <div>
                        <label>Questions:</label>
                        <input
                            type="number"
                            className="ml-2 border rounded p-2 w-20 bg-gray-700 text-white"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                            max="20"
                        />
                    </div>

                    <button
                        onClick={fetchQuestions}
                        className="bg-indigo-600 hover:bg-indigo-500 transition px-6 py-2 rounded-lg shadow-md"
                    >
                        Generate
                    </button>
                </div>

                {/* Questions */}
                {loading && <p>Loading...</p>}
                {questions.map((q, i) => (
                    <div key={i} className="p-5 bg-gray-800 rounded-lg shadow mb-4">
                        <h2>
                            Q{i + 1}: <span dangerouslySetInnerHTML={{ __html: q.question }} />
                        </h2>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.options.map((opt, j) => {
                                let btnStyle = "bg-gray-700 hover:bg-gray-600";
                                if (q.answered) {
                                    if (opt === q.correct) btnStyle = "bg-green-600";
                                    else if (opt === q.chosen && opt !== q.correct)
                                        btnStyle = "bg-red-600";
                                    else btnStyle = "bg-gray-700 opacity-60";
                                }
                                return (
                                    <button
                                        key={j}
                                        className={`p-2 rounded ${btnStyle}`}
                                        onClick={() => handleAnswer(i, opt)}
                                        dangerouslySetInnerHTML={{ __html: opt }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Results */}
                {answeredCount === questions.length && questions.length > 0 && (
                    <div className="mt-6 p-4 bg-indigo-900 rounded-lg text-center">
                        <h2 className="text-lg font-bold">Quiz Finished 🎉</h2>
                        <p className="mt-2 text-xl text-yellow-300">
                            Score: {score} / {questions.length}
                        </p>
                        <button
                            onClick={resetQuiz}
                            className="mt-4 bg-red-600 px-6 py-2 rounded"
                        >
                            Play Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QAGenerator;
