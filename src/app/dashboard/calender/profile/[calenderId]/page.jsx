"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

export default function CalenderProfileLedger({ params }) {
  const resolvedParams = use(params);
  const calenderId = resolvedParams?.calenderId;
  const router = useRouter();

  const [data, setData] = useState({
    calender: null,
    combinedLedger: [],
    loading: true,
  });

  useEffect(() => {
    const fetchLedgerData = async () => {
      try {
        const res = await fetch(`/api/calender/ledger/${calenderId}`);
        const result = await res.json();

        if (result.success) {
          const { calender, billings, payments } = result.data;

          const combined = [
            ...billings.map(b => ({
              date: b.createdAt,
              provider: "CALENDER BILL",
              description: `Invoice: ${b.invoiceNumber}`,
              qty: b.totalQty,
              price: b.price,
              charge: b.total,
              payment: 0,
              type: "debit",
              colour: b.colour
            })),
            ...payments.map(p => ({
              date: p.date,
              provider: p.method.toUpperCase(),
              description: p.description || "Payment Received",
              charge: 0,
              payment: p.amount,
              type: "credit"
            }))
          ];

          combined.sort((a, b) => new Date(a.date) - new Date(b.date));

          let currentBalance = 0;
          const ledgerWithBalance = combined.map(item => {
            currentBalance += (item.payment - item.charge);
            return { ...item, balance: currentBalance };
          });

          setData({
            calender,
            combinedLedger: ledgerWithBalance,
            loading: false
          });
        }
      } catch (err) {
        toast.error("Failed to load calender ledger");
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    if (calenderId) fetchLedgerData();
  }, [calenderId]);

  if (data.loading) {
    return (
      <div className="p-10 text-center font-bold text-gray-500 animate-pulse uppercase">
        Generating Statement...
      </div>
    );
  }

  const totalCharge = data.combinedLedger.reduce((s, i) => s + i.charge, 0);
  const totalPayment = data.combinedLedger.reduce((s, i) => s + i.payment, 0);
  const finalBalance = totalPayment - totalCharge;

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 min-h-screen">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-blue-100 px-2 py-1 rounded text-gray-600 hover:text-blue-600 font-bold text-sm mb-4 print:hidden"
      >
        <FaArrowLeft size={14} /> BACK
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden print:border-none print:shadow-none">
        {/* Header */}
        <div className="p-5 sm:p-8 border-b bg-white">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase">
                Calender Ledger Statement
              </h1>
              <div className="mt-4 space-y-1">
                <p className="font-bold text-blue-600 text-lg">
                  {data.calender?.name}
                </p>
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Location: {data.calender?.location}
                </p>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold print:hidden"
            >
              PRINT REPORT
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-[10px] font-black uppercase">Date</th>
                <th className="px-4 py-4 text-left text-[10px] font-black uppercase">Method</th>
                <th className="px-4 py-4 text-left text-[10px] font-black uppercase">Description</th>
                <th className="px-4 py-4 text-right text-[10px] font-black uppercase">Charge (+)</th>
                <th className="px-4 py-4 text-right text-[10px] font-black uppercase">Payment (-)</th>
                <th className="px-4 py-4 text-right text-[10px] font-black uppercase">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.combinedLedger.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30">
                  <td className="px-4 py-4 text-[11px]">
                    {new Date(row.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      row.type === "credit"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {row.provider}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs font-bold uppercase">
                    {row.description}
                    {row.colour && (
                      <div className="text-[10px] text-gray-400 italic">
                        {row.colour}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right text-xs font-bold">
                    {row.charge > 0
                      ? `(${row.qty} × ${row.price}) = ৳${row.charge}`
                      : "—"}
                  </td>
                  <td className="px-4 py-4 text-right text-green-600 font-black text-xs">
                    {row.payment > 0 ? `৳${row.payment}` : "—"}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`text-xs font-black px-2 py-1 rounded ${
                      row.balance < 0
                        ? "bg-red-50 text-red-600"
                        : "bg-teal-50 text-teal-600"
                    }`}>
                      {row.balance < 0
                        ? `- ৳${Math.abs(row.balance)}`
                        : `+ ৳${row.balance}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 p-6 text-white grid sm:grid-cols-3 gap-6">
          <div>
            <p className="text-[10px] uppercase">Total Bill</p>
            <p className="text-lg font-bold">৳{totalCharge}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase">Total Paid</p>
            <p className="text-lg font-bold text-green-400">৳{totalPayment}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase">Final Balance</p>
            <p className={`text-2xl font-black ${
              finalBalance < 0 ? "text-red-500" : "text-teal-400"
            }`}>
              {finalBalance < 0
                ? `- ৳${Math.abs(finalBalance)}`
                : `+ ৳${finalBalance}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
