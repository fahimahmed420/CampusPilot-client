import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../Auth/AuthContext";
import { FaHistory } from "react-icons/fa";

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
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef(null);

  const { user, axiosInstance } = useAuth();

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
    setTimeElapsed(0);

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

      // Start timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      toast.error("Failed to load questions.");
      console.error(err);
    }
    setLoading(false);
  };

  // Handle answer
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

  // Save score
  useEffect(() => {
    if (questions.length > 0 && answeredCount === questions.length && !scoreSaved) {
      saveScore(questions);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [answeredCount, questions, scoreSaved]);

  const saveScore = async (quizQuestions) => {
    try {
      if (!quizQuestions || quizQuestions.length === 0) return;
      await axiosInstance.post("/scores", {
        uid: user.uid,
        subject,
        difficulty,
        score,
        total: quizQuestions.length,
        timeSpent: timeElapsed,
      });
      toast.success("Score saved!");
      setScoreSaved(true);
    } catch (err) {
      toast.error("Error saving score");
      console.error("❌ Error saving score:", err);
    }
  };

  // Records
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

  // Reset
  const resetQuiz = () => {
    setQuestions([]);
    setScore(0);
    setAnsweredCount(0);
    setSubject("");
    setDifficulty("");
    setAmount(5);
    setScoreSaved(false);
    setTimeElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = ("0" + (seconds % 60)).slice(-2);
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-10 text-[var(--text-primary)]">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">QAGenerator</h1>
          <button
            onClick={toggleRecords}
            className="text-[var(--btn-bg)] hover:text-[var(--btn-hover)] text-2xl"
            title={showRecords ? "Hide Records" : "Show Records"}
          >
            <FaHistory />
          </button>
        </div>

        {/* Records */}
        {showRecords && (
          <div className="mb-6 p-4 bg-[var(--bg-card)] rounded-lg">
            <h2 className="text-xl font-bold mb-3">📊 Your Records</h2>
            {records.length === 0 ? (
              <p className="text-[var(--text-muted)]">You haven't taken any quiz yet.</p>
            ) : (
              <ul className="space-y-2">
                {records.map((r, i) => {
                  const minutes = Math.floor((r.timeSpent || 0) / 60);
                  const seconds = ("0" + ((r.timeSpent || 0) % 60)).slice(-2);

                  let bgColor = "bg-[var(--bg-section)]";
                  if (r.difficulty === "easy") bgColor = "bg-[var(--icon-green)]";
                  else if (r.difficulty === "medium") bgColor = "bg-[var(--icon-yellow)]";
                  else if (r.difficulty === "hard") bgColor = "bg-[var(--icon-red)]";

                  return (
                    <li key={i} className={`p-2 rounded flex justify-between ${bgColor}`}>
                      <div>
                        <span className="font-bold">
                          {r.subject.charAt(0).toUpperCase() + r.subject.slice(1)}
                        </span>{" "}
                        (Test {i + 1}) - {new Date(r.date).toLocaleString()} -{" "}
                        <span className="italic">
                          {r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1)}
                        </span>
                      </div>
                      <div>
                        {r.score}/{r.total} ⏱ {minutes}:{seconds}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Inputs */}
        <div className="mb-6 p-4 bg-[var(--bg-section)] rounded-lg shadow space-y-4">
          <div>
            <label>Subject:</label>
            <select
              className="ml-2 border border-[var(--input-border)] rounded p-2 bg-[var(--bg-section)] text-[var(--text-primary)]"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Choose</option>
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
              className="ml-2 border border-[var(--input-border)] rounded p-2 bg-[var(--bg-section)] text-[var(--text-primary)]"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">Choose</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label>Questions:</label>
            <input
              type="number"
              className="ml-2 border border-[var(--input-border)] rounded p-2 w-20 bg-[var(--bg-section)] text-[var(--text-primary)]"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max="20"
            />
          </div>

          <button
            onClick={fetchQuestions}
            className="bg-[var(--btn-bg)] hover:bg-[var(--btn-hover)] text-[var(--btn-text)] px-4 py-2 rounded-xl w-full sm:w-auto transition transform hover:scale-[1.02] active:scale-100 shadow-md"
          >
            Generate
          </button>
        </div>

        {/* Timer */}
        {questions.length > 0 && (
          <p className="text-[var(--icon-yellow)] mb-4">
            ⏱ Time Elapsed: {formatTime(timeElapsed)}
          </p>
        )}

        {/* Questions */}
        {loading && <p>Loading...</p>}
        {questions.map((q, i) => (
          <div key={i} className="p-5 bg-[var(--bg-card)] rounded-lg shadow mb-4">
            <h2>
              Q{i + 1}: <span dangerouslySetInnerHTML={{ __html: q.question }} />
            </h2>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              {q.options.map((opt, j) => {
                let btnStyle = "bg-[var(--bg-section)] hover:bg-[var(--bg-card)]";
                if (q.answered) {
                  if (opt === q.correct) btnStyle = "bg-[var(--icon-green)]";
                  else if (opt === q.chosen && opt !== q.correct) btnStyle = "bg-[var(--icon-red)]";
                  else btnStyle = "bg-[var(--bg-section)] opacity-60";
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
          <div className="mt-6 p-4 bg-[var(--btn-bg)] rounded-lg text-center">
            <h2 className="text-lg font-bold">Quiz Finished 🎉</h2>
            <p className="mt-2 text-xl text-[var(--icon-yellow)]">
              Score: {score} / {questions.length} ⏱ {formatTime(timeElapsed)}
            </p>
            <button
              onClick={resetQuiz}
              className="mt-4 bg-[var(--icon-red)] px-6 py-2 rounded text-[var(--btn-text)]"
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
