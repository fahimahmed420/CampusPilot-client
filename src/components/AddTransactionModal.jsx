import { useState } from "react";

const DEFAULT_DATE = new Date().toISOString().slice(0, 10);

export default function AddTransactionModal({ onClose, onSave }) {
    const [type, setType] = useState("expense"); // "income" | "expense"
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [date, setDate] = useState(DEFAULT_DATE);

    const submit = (e) => {
        e?.preventDefault?.();
        if (!category || !amount) {
            alert("Please provide category and amount");
            return;
        }
        onSave({ type, category, amount: Number(amount), note, date });
    };

    return (
        <div className="fixed inset-0 z-50">
            {/* Blurred overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-gray-800 text-white rounded-2xl shadow-2xl p-6 animate-[fadeIn_.2s_ease]">
                    <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
                    <form onSubmit={submit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm text-gray-300">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="mt-1 w-full p-2 rounded-lg bg-gray-900 border border-gray-700"
                                >
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-300">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="mt-1 w-full p-2 rounded-lg bg-gray-900 border border-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-300">Category</label>
                            <input
                                type="text"
                                placeholder="e.g., Salary, Food, Transport"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mt-1 w-full p-2 rounded-lg bg-gray-900 border border-gray-700"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300">Amount</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="mt-1 w-full p-2 rounded-lg bg-gray-900 border border-gray-700"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300">Note</label>
                            <input
                                type="text"
                                placeholder="Optional note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="mt-1 w-full p-2 rounded-lg bg-gray-900 border border-gray-700"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* tiny keyframes helper (Tailwind not required but nice) */}
            <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    );
}
