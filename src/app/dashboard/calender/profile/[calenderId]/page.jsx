"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, use, useMemo } from "react";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { toast } from "react-toastify";

export default function CalenderLedger({ params }) {
  const resolvedParams = use(params);
  const customerId = resolvedParams?.customerId;
  const router = useRouter();

  const [data, setData] = useState({ customer: null, rawItems: [], loading: true });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/calender/ledger/${customerId}`);
        const result = await res.json();

        if (result.success) {
          const { customer, billings, payments } = result.data;

          const combined = [
            ...billings.map(b => ({
              date: b.createdAt,
              provider: "CALENDER BILL",
              description: `Invoice: ${b.invoiceNumber}`,
              charge: b.total || 0,
              payment: 0,
              type: 'debit'
            })),
            ...payments.map(p => ({
              date: p.date,
              provider: p.method.toUpperCase(),
              description: p.description || "Payment Received",
              charge: 0,
              payment: p.amount || 0,
              type: 'credit'
            }))
          ];

          combined.sort((a, b) => new Date(a.date) - new Date(b.date));
          setData({ customer, rawItems: combined, loading: false });
        }
      } catch (err) {
        toast.error("Failed to load calender ledger");
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    if (customerId) fetchData();
  }, [customerId]);

  // ফিল্টারিং এবং ব্যালেন্স ক্যালকুলেশন
  const ledgerWithBalance = useMemo(() => {
    let currentBalance = 0;
    return data.rawItems
      .filter(item => {
        const itemDate = new Date(item.date).toISOString().split('T')[0];
        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        return true;
      })
      .map(item => {
        currentBalance += (item.payment - item.charge);
        return { ...item, balance: currentBalance };
      });
  }, [data.rawItems, startDate, endDate]);

  const totals = useMemo(() => {
    return ledgerWithBalance.reduce((acc, curr) => ({
      charge: acc.charge + curr.charge,
      payment: acc.payment + curr.payment
    }), { charge: 0, payment: 0 });
  }, [ledgerWithBalance]);

  if (data.loading) return <div className="p-10 text-center font-bold animate-pulse uppercase">Generating Calender Statement...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 bg-white shadow-lg rounded-xl mt-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-gray-800">Calender Ledger Statement</h1>
          <p className="mt-2 text-sm">
            <strong>Client:</strong> <span className="bg-blue-50 px-2 py-1 rounded text-blue-700 font-bold uppercase">{data.customer?.companyName || data.customer?.ownerName}</span>
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
           <button onClick={() => router.back()} className="border px-4 py-2 rounded bg-gray-50 flex items-center gap-2 text-xs font-bold hover:bg-gray-100 uppercase"><FaArrowLeft/> Back</button>
           <button onClick={() => window.print()} className="bg-gray-800 text-white px-4 py-2 rounded text-xs font-bold hover:bg-black uppercase flex items-center gap-2"><FaPrint/> Print</button>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="flex flex-wrap items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-gray-500">From:</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-1.5 rounded text-xs font-bold outline-none focus:ring-2 ring-blue-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-gray-500">To:</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-1.5 rounded text-xs font-bold outline-none focus:ring-2 ring-blue-500" />
        </div>
        {(startDate || endDate) && (
          <button onClick={() => { setStartDate(""); setEndDate(""); }} className="text-[10px] font-black text-red-500 uppercase underline">Reset Filter</button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-gray-600">Date</th>
              <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-gray-600">Method</th>
              <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-gray-600">Description</th>
              <th className="px-4 py-3 text-right text-[10px] font-black uppercase text-gray-600">Charge (+)</th>
              <th className="px-4 py-3 text-right text-[10px] font-black uppercase text-gray-600">Payment (-)</th>
              <th className="px-4 py-3 text-right text-[10px] font-black uppercase text-gray-600">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ledgerWithBalance.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-3 text-xs font-medium text-gray-500">{new Date(row.date).toLocaleDateString("en-GB")}</td>
                <td className="px-4 py-3">
                   <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${row.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {row.provider}
                   </span>
                </td>
                <td className="px-4 py-3 text-xs font-bold text-gray-800 uppercase">{row.description}</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-gray-900">{row.charge > 0 ? `৳${row.charge.toLocaleString()}` : "—"}</td>
                <td className="px-4 py-3 text-right text-xs font-black text-green-600">{row.payment > 0 ? `৳${row.payment.toLocaleString()}` : "—"}</td>
                <td className="px-4 py-3 text-right">
                   <span className={`text-xs font-black px-3 py-1 rounded-full ${row.balance < 0 ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-700'}`}>
                    {row.balance < 0 ? `- ৳${Math.abs(row.balance).toLocaleString()}` : `+ ৳${row.balance.toLocaleString()}`}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-900 text-white font-bold">
            <tr>
              <td colSpan={3} className="px-4 py-4 text-right text-[10px] uppercase tracking-widest">Totals:</td>
              <td className="px-4 py-4 text-right">৳{totals.charge.toLocaleString()}</td>
              <td className="px-4 py-4 text-right text-green-400">৳{totals.payment.toLocaleString()}</td>
              <td className="px-4 py-4 text-right text-blue-300">৳{(totals.payment - totals.charge).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer Status */}
      <div className="mt-8 flex justify-between items-center px-4">
        <p className="text-[10px] text-gray-400 font-black uppercase">Official Statement • {new Date().toLocaleDateString()}</p>
        <div className="text-center">
          <div className="w-32 h-px bg-gray-300 mb-2"></div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Authorized Signature</p>
        </div>
      </div>
    </div>
  );
}