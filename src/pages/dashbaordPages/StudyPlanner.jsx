import React, { useState, useEffect } from "react";
import { Plus, Trash2, Check, X } from "lucide-react";
import { useAuth } from "../../Auth/AuthContext";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const StudyPlanner = () => {
  const { user, axiosInstance: axios } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [toast, setToast] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [taskForm, setTaskForm] = useState({
    subject: "",
    priority: "Medium",
    day: "Mon",
    time: "",
  });

  // Load classes
  useEffect(() => {
    if (!user) return;
    const fetchClasses = async () => {
      try {
        const res = await axios.get("/classes", { params: { uid: user.uid } });
        setClasses(res.data.map((cls) => ({ ...cls, id: cls._id || cls.id })));
      } catch (err) {
        console.error(err);
        showToast("Failed to load classes");
      }
    };
    fetchClasses();
  }, [user, axios]);

  // Load tasks
  useEffect(() => {
    if (!user) return;
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`/tasks?uid=${user.uid}`);
        setTasks(res.data);
      } catch (err) {
        console.error(err);
        showToast("Failed to load tasks");
      }
    };
    fetchTasks();
  }, [user, axios]);

  const handleTaskChange = (e) =>
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!taskForm.subject || !taskForm.time)
      return showToast("Task Subject and Time are required");

    const newTask = { ...taskForm, status: "Pending", uid: user.uid };
    try {
      const res = await axios.post("/tasks", newTask);
      setTasks([...tasks, res.data].sort((a, b) => a.time.localeCompare(b.time)));
      setTaskForm({ subject: "", priority: "Medium", day: "Mon", time: "" });
      showToast("Task added!");
    } catch (err) {
      console.error(err);
      showToast("Failed to add task");
    }
  };

  const toggleStatus = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updatedStatus =
      task.status === "Completed" ? "Pending" : "Completed";
    try {
      await axios.put(`/tasks/${id}`, { status: updatedStatus });
      setTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, status: updatedStatus } : t
        )
      );
      showToast(
        updatedStatus === "Completed" ? "Task completed" : "Task marked pending"
      );
    } catch (err) {
      console.error(err);
      showToast("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
      showToast("Task deleted");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete task");
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen px-4 sm:px-6 mt-10 lg:px-8 max-w-7xl mx-auto text-[var(--text-primary)]">
      {/* Header with Add Task Button */}
      <div className="flex flex-col justify-between lg:flex-row items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold self-start">
          Study Planner
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[var(--btn-bg)] hover:bg-[var(--btn-hover)] text-[var(--btn-text)] px-4 py-2 rounded-xl w-full sm:w-auto transition transform hover:scale-[1.02] active:scale-100 shadow-md"
        >
          + Add Task / Subject
        </button>
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs sm:text-sm mb-6">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-sm"></span>{" "}
          High
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-sm"></span>{" "}
          Medium
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-sm"></span>{" "}
          Low
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 sm:w-4 sm:h-4 bg-[var(--text-muted)] rounded-sm"></span>{" "}
          Completed
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-700 rounded-sm"></span>{" "}
          Class
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">
          Weekly Calendar
        </h2>

        {/* Header row: md+ */}
        <div className="hidden md:grid grid-cols-7 gap-4 text-center font-bold text-sm bg-[var(--bg-section)] rounded-lg p-2 shadow">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-blue-400">
              {day}
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div className="grid grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="bg-[var(--bg-section)] rounded-lg p-3 min-h-[150px] shadow-inner"
            >
              <div className="md:hidden font-bold text-blue-400 mb-2">
                {day}
              </div>

              {[...tasks.filter((t) => t.day === day), ...classes.filter((c) => c.day === day)]
                .sort((a, b) => {
                  const toMinutes = (t) => {
                    const [h, m] = t.time.split(":").map(Number);
                    return h * 60 + m;
                  };
                  return toMinutes(a) - toMinutes(b);
                })
                .map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 mb-2 rounded text-white text-xs shadow ${
                      item.status
                        ? item.status === "Completed"
                          ? "bg-[var(--text-muted)]"
                          : item.priority === "High"
                          ? "bg-red-500"
                          : item.priority === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        : item.color || "bg-blue-700"
                    }`}
                  >
                    {item.subject}{" "}
                    {item.teacher ? `(${item.teacher})` : ""} <br />
                    <span className="text-[10px] opacity-80">{item.time}</span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between gap-2 sm:gap-4 mb-6 text-center">
        <div className="p-3 sm:p-4 rounded-xl bg-[var(--bg-section)] shadow w-full">
          <p className="text-xs sm:text-sm">Total</p>
          <h2 className="text-xl sm:text-2xl font-bold">{totalTasks}</h2>
        </div>
        <div className="p-3 sm:p-4 rounded-xl bg-[var(--bg-section)] shadow w-full">
          <p className="text-xs sm:text-sm">Completed</p>
          <h2 className="text-xl sm:text-2xl font-bold text-green-400">
            {completedTasks}
          </h2>
        </div>
        <div className="p-3 sm:p-4 rounded-xl bg-[var(--bg-section)] shadow w-full">
          <p className="text-xs sm:text-sm">Pending</p>
          <h2 className="text-xl sm:text-2xl font-bold text-red-400">
            {pendingTasks}
          </h2>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3 mb-8">
        {tasks.length === 0 ? (
          <p className="text-center text-[var(--text-secondary)]">
            No tasks yet. Add one!
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl bg-[var(--bg-section)] flex justify-between items-center gap-3 shadow hover:shadow-lg transition"
            >
              <div>
                <p
                  className={`font-semibold text-base ${
                    task.status === "Completed"
                      ? "line-through text-[var(--text-muted)]"
                      : ""
                  }`}
                >
                  {task.subject}
                </p>
                <p
                  className={`text-sm ${
                    task.priority === "High"
                      ? "text-red-500"
                      : task.priority === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  Priority: {task.priority}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Day: {task.day} | {task.time}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(task.id)}
                  className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition shadow"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition shadow"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--bg-section)] p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Add Task / Subject</h2>

            <form onSubmit={addTask} className="space-y-3 mb-4">
              <input
                type="text"
                name="subject"
                placeholder="Task Subject"
                value={taskForm.subject}
                onChange={handleTaskChange}
                className="w-full p-2 rounded bg-[var(--bg-section)] border border-[var(--input-border)] text-[var(--text-primary)] shadow-sm"
              />
              <select
                name="priority"
                value={taskForm.priority}
                onChange={handleTaskChange}
                className="w-full p-2 rounded bg-[var(--bg-section)] border border-[var(--input-border)] text-[var(--text-primary)] shadow-sm"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <select
                name="day"
                value={taskForm.day}
                onChange={handleTaskChange}
                className="w-full p-2 rounded bg-[var(--bg-section)] border border-[var(--input-border)] text-[var(--text-primary)] shadow-sm"
              >
                {daysOfWeek.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <input
                type="time"
                name="time"
                value={taskForm.time}
                onChange={handleTaskChange}
                className="w-full p-2 rounded bg-[var(--bg-section)] border border-[var(--input-border)] text-[var(--text-primary)] shadow-sm"
              />
              <button
                type="submit"
                className="w-full bg-[var(--btn-bg)] hover:bg-[var(--btn-hover)] py-2 rounded text-[var(--btn-text)] font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                <Plus size={16} /> Add Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-[var(--bg-navbar)] text-[var(--text-primary)] px-4 py-2 rounded shadow z-50">
          {toast}
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
