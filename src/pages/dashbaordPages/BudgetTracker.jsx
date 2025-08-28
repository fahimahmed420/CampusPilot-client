import { useEffect, useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip as BarTooltip,
  ResponsiveContainer
} from "recharts";
import { useAuth } from "../../Auth/AuthContext";
import AddTransactionModal from "../../components/AddTransactionModal";
import { useAxios } from "../../hooks/useAxios"; // your custom Axios hook

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PIE_COLORS = ["#60A5FA","#34D399","#F59E0B","#EF4444","#A78BFA","#FBBF24","#22D3EE","#F472B6","#10B981","#FCA5A5"];

export default function BudgetTracker() {
  const { user } = useAuth();
  const axios = useAxios(); // <-- Axios instance
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch user transactions
  useEffect(() => {
    if (!user?.uid) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/transactions/${user.uid}`);
        setTransactions(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Failed to fetch transactions:", e.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, axios]);

  // Add new transaction
  const handleAdd = async (payload) => {
    try {
      const res = await axios.post("/transactions", { ...payload, uid: user.uid });
      const out = res.data;

      if (!out?.success || !out?.transaction) throw new Error("Save failed");

      // Prepend for instant feedback
      setTransactions((prev) => [out.transaction, ...prev]);
      setModalOpen(false);
    } catch (e) {
      console.error("Failed to save transaction:", e.response?.data || e.message);
      alert("Failed to save transaction");
    }
  };

  // Totals
  const { income, expense, balance } = useMemo(() => {
    const inc = transactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount || 0), 0);
    const exp = transactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount || 0), 0);
    return { income: inc, expense: exp, balance: inc - exp };
  }, [transactions]);

  // Filtered transactions
  const filtered = useMemo(() => {
    if (filter === "All") return transactions;
    return transactions.filter(t => t.type === filter.toLowerCase());
  }, [transactions, filter]);

  // Pie chart: expenses by category
  const expenseByCat = useMemo(() => {
    const map = new Map();
    transactions.forEach(t => {
      if (t.type !== "expense") return;
      const key = t.category || "Other";
      map.set(key, (map.get(key) || 0) + Number(t.amount || 0));
    });
    return Array.from(map, ([name, value]) => ({ name, value })).filter(d => d.value > 0);
  }, [transactions]);

  // Bar chart: income vs expense per month
  const barData = useMemo(() => {
    const year = new Date().getFullYear();
    const rows = MONTHS.map((m) => ({ month: m, Income: 0, Expense: 0 }));
    transactions.forEach(t => {
      const d = new Date(t.date);
      if (!isFinite(d) || d.getFullYear() !== year) return;
      const mi = d.getMonth();
      if (t.type === "income") rows[mi].Income += Number(t.amount || 0);
      else if (t.type === "expense") rows[mi].Expense += Number(t.amount || 0);
    });
    return rows;
  }, [transactions]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen transition">
      <div className="max-w-6xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-xl transition">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Budget Tracker</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl transition transform hover:scale-[1.02] active:scale-100 shadow-md"
          >
            + Add Transaction
          </button>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card title="Balance" value={balance} accent="text-blue-400" />
          <Card title="Income" value={income} accent="text-green-400" />
          <Card title="Expense" value={expense} accent="text-red-400" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie */}
          <div className="p-4 bg-gray-700 rounded-xl flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-4">Expenses by Category</h2>
            {expenseByCat.length === 0 ? (
              <p className="text-gray-300 py-10">No expenses to show yet</p>
            ) : (
              <div className="w-full h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={expenseByCat} dataKey="value" nameKey="name" outerRadius={110} label>
                      {expenseByCat.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <PieTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Bar */}
          <div className="p-4 bg-gray-700 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Income vs Expense (This Year)</h2>
            <div className="w-full h-72">
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="month" stroke="#E5E7EB" />
                  <YAxis stroke="#E5E7EB" />
                  <BarTooltip />
                  <Legend />
                  <Bar dataKey="Income" fill="#3B82F6" radius={[4,4,0,0]} />
                  <Bar dataKey="Expense" fill="#EF4444" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-gray-700 p-4 rounded-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold">Transactions</h2>
            <div className="inline-flex rounded-xl overflow-hidden border border-gray-600">
              {["All", "Income", "Expense"].map((f) => (
                <button
                  key={f}
                  className={`px-3 py-1.5 transition ${filter === f ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-200 hover:bg-gray-600"}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-600">
            <table className="w-full text-left">
              <thead className="bg-gray-600/70">
                <tr>
                  <Th>Date</Th>
                  <Th>Category</Th>
                  <Th>Type</Th>
                  <Th className="text-right">Amount</Th>
                  <Th>Notes</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="p-4 text-center text-gray-300" colSpan={5}>Loading…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td className="p-4 text-center text-gray-300" colSpan={5}>No transactions</td></tr>
                ) : (
                  filtered.map((t) => (
                    <tr key={t._id} className="border-t border-gray-600/70 hover:bg-gray-600 transition">
                      <Td>{new Date(t.date).toLocaleDateString()}</Td>
                      <Td>{t.category || "-"}</Td>
                      <Td className="capitalize">{t.type}</Td>
                      <Td className="text-right">${Number(t.amount || 0).toFixed(2)}</Td>
                      <Td>{t.note || "-"}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <AddTransactionModal
          onClose={() => setModalOpen(false)}
          onSave={handleAdd}
        />
      )}
    </div>
  );
}

// Card Component
function Card({ title, value, accent }) {
  return (
    <div className="p-5 bg-gray-700 rounded-xl text-center shadow-lg">
      <h3 className="text-sm uppercase tracking-wide text-gray-300">{title}</h3>
      <p className={`mt-2 text-3xl font-extrabold ${accent}`}>${Number(value || 0).toFixed(2)}</p>
    </div>
  );
}

// Table Helpers
function Th({ children, className = "" }) {
  return <th className={`px-3 py-2 text-sm font-semibold border-b border-gray-600 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
