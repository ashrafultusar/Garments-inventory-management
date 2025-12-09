"use client";

import { useEffect, useState } from "react";

/* =======================
   ✅ STATIC DATA
======================= */

const USERS = [
  { _id: "u1", name: "Rahim Store" },
  { _id: "u2", name: "Karim Traders" },
];

const PAYMENTS_BY_USER = {
  u1: [
    {
      _id: "p1",
      amount: 5000,
      method: "cash",
      description: "Opening balance",
      date: "2024-12-01",
    },
    {
      _id: "p2",
      amount: 2000,
      method: "bkash",
      description: "December collection",
      date: "2024-12-05",
    },
  ],
  u2: [
    {
      _id: "p3",
      amount: 8000,
      method: "bank",
      description: "Advance payment",
      date: "2024-12-03",
    },
  ],
};

export default function Page() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);

  const [form, setForm] = useState({
    amount: "",
    method: "cash",
    description: "",
    date: "",
  });

  /* ✅ Load users */
  useEffect(() => {
    setUsers(USERS);
  }, []);

  /* ✅ Load payments */
  useEffect(() => {
    if (!selectedUserId) return;

    const list = PAYMENTS_BY_USER[selectedUserId] || [];
    setPayments(list);
    calcTotal(list);
  }, [selectedUserId]);

  const calcTotal = (list) => {
    const sum = list.reduce((t, p) => t + p.amount, 0);
    setTotal(sum);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPayment = {
      _id: Date.now().toString(),
      amount: Number(form.amount),
      method: form.method,
      description: form.description,
      date: form.date || new Date().toISOString().slice(0, 10),
    };

    const updated = [...payments, newPayment];
    setPayments(updated);
    calcTotal(updated);

    setForm({
      amount: "",
      method: "cash",
      description: "",
      date: "",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Accounts Ledger (All Credit)</h1>

      {/* ✅ User select */}
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        className="border px-3 py-2 rounded w-full max-w-md"
      >
        <option value="">Select customer </option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name}
          </option>
        ))}
      </select>

      {/* ✅ Total */}
      {selectedUserId && (
        <div className="border rounded p-4 font-semibold text-lg">
          Total Received: ৳ {total}
        </div>
      )}

      {/* ✅ Add Payment */}
      {selectedUserId && (
        <form onSubmit={handleSubmit} className="border p-4 rounded space-y-3">
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
            required
          />

          <select
            name="method"
            value={form.method}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          >
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="bkash">Bkash</option>
            <option value="nagad">Nagad</option>
          </select>

          <textarea
            name="description"
            placeholder="Note"
            value={form.description}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          />

          <button className="bg-black text-white px-4 py-2 rounded">
            Add Payment
          </button>
        </form>
      )}

      {/* ✅ History */}
      {selectedUserId && (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">Date</th>
              <th className="border p-1">Description</th>
              <th className="border p-1">Method</th>
              <th className="border p-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td className="border p-1">{p.date}</td>
                <td className="border p-1">{p.description}</td>
                <td className="border p-1">{p.method}</td>
                <td className="border p-1">{p.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
