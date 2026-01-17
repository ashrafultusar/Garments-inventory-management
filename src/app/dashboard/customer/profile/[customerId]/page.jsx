"use client";

import React, { useEffect, useState, use } from "react";

export default function CustomerProfileLedger({ params }) {
  const resolvedParams = use(params);
  const customerId = resolvedParams?.customerId;

  const [customer, setCustomer] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // ১. কাস্টমার ডাটা ফেচ করা (এই পার্টটি আপনার কোডে ছিল না)
        const custRes = await fetch(`/api/customers/${customerId}`);
        if (!custRes.ok) throw new Error("Customer not found");
        const custData = await custRes.json();
        setCustomer(custData);

        // ২. পেমেন্ট ডাটা ফেচ করা
        const payRes = await fetch(`/api/payments?userId=${customerId}`);
        const payData = await payRes.json();
  
        if (payData && payData.length > 0) {
          // ৩. ব্যালেন্স ক্যালকুলেশন
          const chronologicalData = [...payData].sort((a, b) => new Date(a.date) - new Date(b.date));
  
          let currentRunningBalance = 0;
          const calculated = chronologicalData.map((item) => {
            currentRunningBalance += item.amount;
            return {
              ...item,
              balance: currentRunningBalance,
            };
          });
  
          setLedger(calculated.reverse());
        } else {
          setLedger([]);
        }
      } catch (err) {
        console.error("Data Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
  
    if (customerId) fetchAllData();
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // এখন customer ডাটা না থাকলে এটি দেখাবে
  if (!customer)
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Customer Not Found! (ID: {customerId})
      </div>
    );

  return (
    <div className="bg-white p-8 mt-4 rounded-xl shadow-lg max-w-6xl mx-auto border border-gray-100">
      {/* হেডার */}
      <div className="flex justify-between items-start border-b pb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase">
            Client Ledger Statement
          </h1>
          <div className="mt-4 space-y-1">
            <p className="text-sm">
              <strong className="text-gray-500">CLIENT:</strong>{" "}
              <span className="px-3 py-1 border rounded bg-gray-50 font-bold text-blue-700">
                {customer?.companyName}
              </span>
            </p>
            <p className="text-xs font-medium text-gray-500">
              OWNER: {customer?.ownerName} | PHONE: {customer?.phoneNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="border px-4 py-2 rounded-lg bg-gray-900 text-white font-bold text-xs hover:bg-gray-800 shadow-sm transition-all"
          >
            PRINT STATEMENT
          </button>
        </div>
      </div>

      {/* টেবিল অংশ আপনার কোড অনুযায়ী ঠিক থাকবে... */}
      <div className="border mt-8 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr className="text-gray-700">
              <th className="px-4 py-4 text-left font-bold uppercase tracking-tighter">Date</th>
              <th className="px-4 py-4 text-left font-bold uppercase tracking-tighter">Description</th>
              <th className="px-4 py-4 text-center font-bold uppercase tracking-tighter">Method</th>
              <th className="px-4 py-4 text-right font-bold uppercase tracking-tighter">Payment (Credit)</th>
              <th className="px-4 py-4 text-right font-bold uppercase tracking-tighter bg-blue-50/50">Running Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ledger.length > 0 ? (
              ledger.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">{new Date(row.date).toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-4 italic">{row.description || "Payment received"}</td>
                  <td className="px-4 py-4 text-center">{row.method}</td>
                  <td className="px-4 py-4 text-right font-bold text-green-700">৳ {row.amount.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right font-black bg-gray-50/30">৳ {row.balance.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="px-4 py-20 text-center">No transactions found.</td></tr>
            )}
          </tbody>
          <tfoot>
             <tr className="bg-gray-900 text-white font-bold">
               <td colSpan={3} className="px-4 py-5 text-right uppercase text-xs">Total Cash Received:</td>
               <td colSpan={2} className="px-4 py-5 text-right text-xl">৳ {ledger.length > 0 ? ledger[0].balance.toLocaleString() : "0"}</td>
             </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}