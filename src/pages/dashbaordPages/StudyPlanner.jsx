import React, { useState, useEffect } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { useAxios } from "../../hooks/useAxios";
import { useAuth } from "../../Auth/AuthContext";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const StudyPlanner = () => {
  const { user } = useAuth();
  const axios = useAxios();

  const [tasks, setTasks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    subject: "",
    priority: "Medium",
    day: "Mon",
    time: "",
  });
  const [toast, setToast] = useState("");

  // Load classes
  useEffect(() => {
    if (!user) return;
    const fetchClasses = async () => {
      try {
        const res = await axios.get("/classes", { params: { uid: user.uid } });
        setClasses(res.data.map(cls => ({ ...cls, id: cls._id || cls.id })));
      } catch (err) {
        console.error("Failed to fetch classes:", err);
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.time) return showToast("Subject and Time are required");

    const newTask = { ...form, status: "Pending", uid: user.uid };
    try {
      const res = await axios.post("/tasks", newTask);
      setTasks([...tasks, res.data].sort((a, b) => a.time.localeCompare(b.time)));
      setForm({ subject: "", priority: "Medium", day: "Mon", time: "" });
      showToast("Task added!");
    } catch (err) {
      console.error(err);
      showToast("Failed to add task");
    }
  };

  const toggleStatus = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updatedStatus = task.status === "Completed" ? "Pending" : "Completed";

    try {
      await axios.put(`/tasks/${id}`, { status: updatedStatus });
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status: updatedStatus } : t)));
      showToast(updatedStatus === "Completed" ? "Task completed" : "Task marked pending");
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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Study Planner</h1>
      {/* Color legend */}
      <div className="flex flex-wrap gap-2 lg:gap-4 mb-6 text-sm">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-red-500 rounded-sm inline-block"></span> High Priority
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-yellow-500 rounded-sm inline-block"></span> Medium Priority
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-500 rounded-sm inline-block"></span> Low Priority
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-gray-600 rounded-sm inline-block"></span> Completed Task
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-blue-700 rounded-sm inline-block"></span> Class (not tasks)
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-2xl shadow bg-gray-800 text-center">
          <p className="text-sm">Total Tasks</p>
          <h2 className="text-2xl font-bold">{totalTasks}</h2>
        </div>
        <div className="p-4 rounded-2xl shadow bg-gray-800 text-center">
          <p className="text-sm">Completed</p>
          <h2 className="text-2xl font-bold text-green-400">{completedTasks}</h2>
        </div>
        <div className="p-4 rounded-2xl shadow bg-gray-800 text-center">
          <p className="text-sm">Pending</p>
          <h2 className="text-2xl font-bold text-red-400">{pendingTasks}</h2>
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex flex-wrap gap-2 mb-6">
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Subject/Topic"
          className="border p-2 rounded flex-1 bg-gray-700 text-white border-gray-600"
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="border p-2 rounded bg-gray-700 text-white border-gray-600"
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select
          name="day"
          value={form.day}
          onChange={handleChange}
          className="border p-2 rounded bg-gray-700 text-white border-gray-600"
        >
          {daysOfWeek.map((day) => (
            <option key={day}>{day}</option>
          ))}
        </select>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="border p-2 rounded bg-gray-700 text-white border-gray-600"
        />
        <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          <Plus size={16} /> Add Task
        </button>
      </form>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow z-50">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-xl shadow bg-gray-800 flex justify-between items-center"
            >
              <div>
                <p
                  className={`font-semibold ${task.status === "Completed" ? "line-through text-gray-400" : ""
                    }`}
                >
                  {task.subject}
                </p>
                <p
                  className={`text-sm ${task.priority === "High"
                    ? "text-red-500"
                    : task.priority === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                    }`}
                >
                  Priority: {task.priority}
                </p>
                <p className="text-xs">
                  Day: {task.day} | {task.time}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(task.id)}
                  className="p-2 bg-green-500 text-white rounded-full"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 bg-red-500 text-white rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Calendar */}
        <div className=" rounded-xl shadow bg-gray-800 p-4">
          <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-4">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="min-h-[150px] rounded-lg p-2 bg-black">
                {[...tasks.filter(t => t.day === day), ...classes.filter(c => c.day === day)]
                  .sort((a, b) => {
                    // Convert time like "10 AM" or "14:30" to comparable number
                    const toMinutes = (t) => {
                      if (t.time.includes("AM") || t.time.includes("PM")) {
                        let [h, m] = t.time.split(" ")[0].split(":");
                        h = parseInt(h, 10);
                        m = m ? parseInt(m, 10) : 0;
                        if (t.time.includes("PM") && h !== 12) h += 12;
                        if (t.time.includes("AM") && h === 12) h = 0;
                        return h * 60 + m;
                      } else {
                        const [h, m] = t.time.split(":").map(Number);
                        return h * 60 + m;
                      }
                    };
                    return toMinutes(a) - toMinutes(b);
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`p-1 mb-1 rounded text-white text-xs ${item.status
                        ? item.status === "Completed"
                          ? "bg-gray-600"
                          : item.priority === "High"
                            ? "bg-red-500"
                            : item.priority === "Medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        : item.color || "bg-blue-700"
                        }`}
                    >
                      {item.subject} {item.teacher ? `(${item.teacher})` : ""} ({item.time})
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
