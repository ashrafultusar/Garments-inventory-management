"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

export default function CustomerProfileLedger({ params }) {
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
        const res = await fetch(`/api/customers/ledger/${customerId}`);
        const result = await res.json();

        if (result.success) {
          const { customer, billings, payments } = result.data;

          const combined = [
            ...billings
              .filter(b => b.summaryType === "client")
              .map(b => ({
                date: b.createdAt,
                provider: "BILLING",
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
            // আপনার রিকোয়েস্ট অনুযায়ী লজিক: (Payment - Charge)
            // পেমেন্ট বড় হলে পজিটিভ (+), চার্জ বড় হলে নেগেটিভ (-)
            currentBalance += (item.payment - item.charge);
            return { ...item, balance: currentBalance };
          });

          setData({ customer, combinedLedger: ledgerWithBalance, loading: false });
        }
      } catch (err) {
        toast.error("Failed to load ledger data");
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    if (customerId) fetchLedgerData();
  }, [customerId]);

  if (data.loading) return <div className="p-10 text-center font-bold text-gray-500 animate-pulse uppercase">Generating Statement...</div>;

  const totalCharge = data.combinedLedger.reduce((sum, item) => sum + item.charge, 0);
  const totalPayment = data.combinedLedger.reduce((sum, item) => sum + item.payment, 0);
  const finalBalance = totalPayment - totalCharge;

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 min-h-screen">
      <button onClick={() => router.back()} className="flex items-center gap-2 bg-blue-100 px-2 py-1 rounded text-gray-600 hover:text-blue-600 font-bold text-sm mb-4 print:hidden">
        <FaArrowLeft size={14} /> BACK
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden print:border-none print:shadow-none">
        {/* Header Section */}
        <div className="p-5 sm:p-8 border-b border-gray-100 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 uppercase">Ledger Statement</h1>
              <div className="mt-4 space-y-1">
                <p className="font-bold text-blue-600 text-lg">{data.customer?.companyName}</p>
                <p className="text-xs text-gray-500 uppercase font-bold">Owner: {data.customer?.ownerName} | Phone: {data.customer?.phoneNumber}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{data.customer?.address}</p>
              </div>
            </div>
            <button onClick={() => window.print()} className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold print:hidden">PRINT REPORT</button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left font-black text-gray-500 uppercase text-[10px]">Date</th>
                <th className="px-4 py-4 text-left font-black text-gray-500 uppercase text-[10px]">Method</th>
                <th className="px-4 py-4 text-left font-black text-gray-500 uppercase text-[10px]">Description</th>
                <th className="px-4 py-4 text-right font-black text-gray-500 uppercase text-[10px]">Charge (+)</th>
                <th className="px-4 py-4 text-right font-black text-gray-500 uppercase text-[10px]">Payment (-)</th>
                <th className="px-4 py-4 text-right font-black text-gray-500 uppercase text-[10px]">Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.combinedLedger.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600 text-[11px] font-medium">{new Date(row.date).toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${row.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{row.provider}</span>
                  </td>
                  <td className="px-4 py-4 text-gray-700 text-xs">
                    <div className="font-bold text-gray-900">{row.description}</div>
                    {row.colour && <span className="text-[10px] text-gray-400 italic leading-none">{row.colour}</span>}
                  </td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">
                    {row.charge > 0 ? (
                      <div className="text-gray-900 font-bold text-[11px]">
                        ({row.qty} × {row.price}) = ৳{row.charge.toLocaleString()}
                      </div>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-4 text-right text-green-600 font-black text-xs whitespace-nowrap">
                    {row.payment > 0 ? `৳${row.payment.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">
                    <div className={`text-xs font-black px-2 py-1 rounded ${row.balance < 0 ? 'text-red-600 bg-red-50' : 'text-teal-600 bg-teal-50'}`}>
                      {row.balance < 0 ? `- ৳${Math.abs(row.balance).toLocaleString()}` : `+ ৳${row.balance.toLocaleString()}`}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="bg-gray-900 p-5 sm:p-8 text-white">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <div className="space-y-1 text-center sm:text-left border-b sm:border-b-0 sm:border-r border-gray-800 pb-4 sm:pb-0">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Billings</p>
              <p className="text-lg font-bold">৳{totalCharge.toLocaleString()}</p>
            </div>
            <div className="space-y-1 text-center sm:text-left border-b sm:border-b-0 sm:border-r border-gray-800 pb-4 sm:pb-0">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Received</p>
              <p className="text-lg font-bold text-green-400">৳{totalPayment.toLocaleString()}</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-[10px] text-blue-300 font-black uppercase tracking-widest mb-1">Final Balance</p>
              <p className={`text-2xl font-black ${finalBalance < 0 ? 'text-red-500' : 'text-teal-400'}`}>
                {finalBalance < 0 ? `- ৳${Math.abs(finalBalance).toLocaleString()}` : `+ ৳${finalBalance.toLocaleString()}`}
                <span className="text-xs ml-2 font-bold opacity-80 uppercase">
                  {finalBalance < 0 ? "Due" : "Advance"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Signature Area */}
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-8 bg-white">
          <div className="text-[10px] text-gray-400 font-medium order-2 sm:order-1 uppercase">OFFICIAL STATEMENT • {new Date().toLocaleString()}</div>
          <div className="text-center order-1 sm:order-2">
            <div className="w-40 h-px bg-gray-200 mb-2"></div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}