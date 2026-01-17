"use client";

import React, { useEffect, useState, use } from "react";
import { toast } from "react-toastify";

export default function CustomerProfileLedger({ params }) {
  const resolvedParams = use(params);
  const customerId = resolvedParams?.customerId;

  const [data, setData] = useState({
    customer: null,
    combinedLedger: [],
    loading: true,
  });

  useEffect(() => {
    const fetchLedgerData = async () => {
      try {
        const res = await fetch(`/api/customers/ledger/${customerId}`);
        const result = await res.json();

        if (result.success) {
          const { customer, billings, payments } = result.data;

          // ১. সব ডাটাকে একটি এরেতে নিয়ে আসা
          const combined = [
            ...billings.map(b => ({
              date: b.createdAt,
              provider: "BILLING",
              description: `Invoice: ${b.invoiceNumber} (${b.colour || ''})`,
              charge: b.total,
              payment: 0,
              type: 'debit'
            })),
            ...payments.map(p => ({
              date: p.date,
              provider: p.method, 
              description: p.description || "Payment Received",
              charge: 0,
              payment: p.amount,
              type: 'credit'
            }))
          ];

          // ২. তারিখ অনুযায়ী সর্ট করা (Oldest First)
          combined.sort((a, b) => new Date(a.date) - new Date(b.date));

          // ৩. রানিং ব্যালেন্স ক্যালকুলেট করা (Charge প্লাস, Payment মাইনাস)
          let currentBalance = 0;
          const ledgerWithBalance = combined.map(item => {
            currentBalance += (item.charge - item.payment);
            return { ...item, balance: currentBalance };
          });

          setData({
            customer,
            combinedLedger: ledgerWithBalance, // পুরাতন উপরে, নতুন নিচে
            loading: false
          });
        }
      } catch (err) {
        toast.error("Failed to load ledger data");
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    if (customerId) fetchLedgerData();
  }, [customerId]);

  if (data.loading) return <div className="p-10 text-center font-bold text-gray-500 tracking-widest animate-pulse">GENERATING STATEMENT...</div>;

  const totalCharge = data.combinedLedger.reduce((sum, item) => sum + item.charge, 0);
  const totalPayment = data.combinedLedger.reduce((sum, item) => sum + item.payment, 0);
  const finalBalance = totalCharge - totalPayment;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border print:border-none print:shadow-none">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Ledger Statement</h1>
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Client Name:</span>
                <span className="font-bold text-blue-700">{data.customer?.companyName || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold uppercase tracking-tighter">Report Period:</span>
                <span>Lifetime Statement</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => window.print()} 
            className="bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-black transition-all shadow-md print:hidden"
          >
            PRINT STATEMENT
          </button>
        </div>

        {/* Ledger Table */}
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-[10px]">Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-[10px]">Method</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-[10px]">Description</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600 uppercase text-[10px]">Charge (+)</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600 uppercase text-[10px]">Payment (-)</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600 uppercase text-[10px]">Running Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.combinedLedger.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 text-xs">
                    {new Date(row.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${row.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {row.provider}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium text-xs">{row.description}</td>
                  <td className="px-4 py-3 text-right text-gray-600 font-semibold">
                    {row.charge > 0 ? `৳${row.charge.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-green-700 font-bold">
                    {row.payment > 0 ? `৳${row.payment.toLocaleString()}` : "—"}
                  </td>
                  <td className={`px-4 py-3 text-right font-black text-xs`}>
                    <span className={row.balance > 0 ? 'text-red-600' : row.balance < 0 ? 'text-teal-600' : 'text-gray-400'}>
                      ৳{Math.abs(row.balance).toLocaleString()} 
                      <span className="ml-1 text-[9px] uppercase">
                        {row.balance > 0 ? "-" : row.balance < 0 ? "+" : ""}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Summary Footer */}
            <tfoot className="bg-gray-900 text-white font-bold">
              <tr>
                <td colSpan={3} className="px-4 py-4 text-right text-[10px] uppercase tracking-widest">Net Summary:</td>
                <td className="px-4 py-4 text-right">৳{totalCharge.toLocaleString()}</td>
                <td className="px-4 py-4 text-right">৳{totalPayment.toLocaleString()}</td>
                <td className={`px-4 py-4 text-right ${finalBalance <= 0 ? 'bg-teal-600' : 'bg-red-700'}`}>
                    ৳{Math.abs(finalBalance).toLocaleString()} {finalBalance > 0 ? "-" : "+"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex justify-between items-end border-t pt-6">
            <div className="text-[10px] text-gray-400 italic uppercase">
                Generated by System • {new Date().toLocaleString()}
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-px bg-gray-300"></div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">Authorized Signature</div>
            </div>
        </div>
      </div>
    </div>
  );
}