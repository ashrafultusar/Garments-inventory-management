"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { toast } from "react-toastify";

export default function DyingLedger({ params }) {
  const resolvedParams = use(params);
  const customerId = resolvedParams?.customerId;
  const router = useRouter();

  const [data, setData] = useState({
    customer: null,
    combinedLedger: [],
    loading: true,
  });

  useEffect(() => {
    const fetchLedgerData = async () => {
      try {
        const res = await fetch(`/api/dyeings/ledger/${customerId}`);
        const result = await res.json();

        if (result.success) {
          const { customer, billings, payments } = result.data;

          const combined = [
            ...billings.map(b => ({
              date: b.createdAt,
              provider: "DYING BILL",
              description: `Invoice: ${b.invoiceNumber}`,
              qty: b.totalQty,
              price: b.price,
              charge: b.total,
              payment: 0,
              type: 'debit',
              colour: b.colour
            })),
            ...payments.map(p => ({
              date: p.date,
              provider: p.method.toUpperCase(),
              description: p.description || "Payment Received",
              charge: 0,
              payment: p.amount, 
              type: 'credit'
            }))
          ];

          // তারিখ অনুযায়ী সাজানো
          combined.sort((a, b) => new Date(a.date) - new Date(b.date));

          let currentBalance = 0;
          const ledgerWithBalance = combined.map(item => {
            // Logic: (Payment - Charge)
            currentBalance += (item.payment - item.charge);
            return { ...item, balance: currentBalance };
          });

          setData({ customer, combinedLedger: ledgerWithBalance, loading: false });
        }
      } catch (err) {
        toast.error("Failed to load dying ledger data");
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    if (customerId) fetchLedgerData();
  }, [customerId]);

  if (data.loading) return <div className="p-10 text-center font-bold text-gray-500 animate-pulse uppercase">Generating Dying Statement...</div>;

  const totalCharge = data.combinedLedger.reduce((sum, item) => sum + item.charge, 0);
  const totalPayment = data.combinedLedger.reduce((sum, item) => sum + item.payment, 0);
  const finalBalance = totalPayment - totalCharge;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 min-h-screen">
      {/* Back Button */}
      <button onClick={() => router.back()} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-200 font-bold text-xs mb-6 print:hidden transition-all">
        <FaArrowLeft size={12} /> BACK TO PROFILE
      </button>

      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden print:shadow-none print:border-none">
        
        {/* Header Section */}
        <div className="p-6 sm:p-10 border-b-2 border-gray-50 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Dying Ledger</h1>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-14 w-1 bg-blue-600 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Client Name</p>
                  <p className="text-xl font-black text-blue-600 uppercase">{data.customer?.companyName || data.customer?.ownerName}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => window.print()} 
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-xs font-black hover:bg-gray-800 transition-all print:hidden"
            >
              <FaPrint /> PRINT STATEMENT
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-wider">Charge (+)</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-wider">Payment (-)</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-wider">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.combinedLedger.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-gray-600">
                    {new Date(row.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${row.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                      {row.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-black text-gray-800 uppercase">{row.description}</p>
                    {row.colour && <p className="text-[10px] text-gray-400 font-medium italic">Color: {row.colour}</p>}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-xs text-gray-900">
                    {row.charge > 0 ? `৳${row.charge.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-xs text-green-600">
                    {row.payment > 0 ? `৳${row.payment.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${row.balance < 0 ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-700'}`}>
                      {row.balance < 0 ? `- ৳${Math.abs(row.balance).toLocaleString()}` : `+ ৳${row.balance.toLocaleString()}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Table Footer Totals */}
            <tfoot className="bg-gray-900 text-white">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Total Calculation</td>
                <td className="px-6 py-4 text-right font-bold text-sm">৳{totalCharge.toLocaleString()}</td>
                <td className="px-6 py-4 text-right font-bold text-sm text-green-400">৳{totalPayment.toLocaleString()}</td>
                <td className="px-6 py-4 text-right font-black text-sm">
                   <span className={finalBalance < 0 ? 'text-red-400' : 'text-teal-400'}>
                    {finalBalance < 0 ? `- ৳${Math.abs(finalBalance).toLocaleString()}` : `+ ৳${finalBalance.toLocaleString()}`}
                   </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Summary Card */}
        <div className="p-8 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-gray-200">
           <div className="text-center sm:text-left">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Status Report</p>
              <div className={`text-2xl font-black uppercase ${finalBalance < 0 ? 'text-red-600' : 'text-teal-600'}`}>
                {finalBalance < 0 ? "Outstanding Due" : "Advance Balance"}
              </div>
           </div>
           <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-gray-300 pt-4 sm:pt-0 sm:pl-8">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Generated On</p>
              <p className="text-xs font-bold text-gray-700">{new Date().toLocaleString()}</p>
           </div>
        </div>
      </div>
    </div>
  );
}