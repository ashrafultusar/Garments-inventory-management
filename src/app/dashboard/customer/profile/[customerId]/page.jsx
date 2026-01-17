"use client";

import React, { useEffect, useState, use } from "react";
import { toast } from "react-toastify";

export default function CustomerProfileLedger({ params }) {
  const resolvedParams = use(params);
  const customerId = resolvedParams?.customerId;

  const [customer, setCustomer] = useState(null);
  const [billings, setBillings] = useState([]); // Billing API data
  const [payments, setPayments] = useState([]); // Payment API data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // 1. Customer Details Fetch
        const custRes = await fetch(`/api/customers/${customerId}`);
        const custData = await custRes.json();
        setCustomer(custData);

        // 2. Billing Summary Fetch (Using your provided API)
        const billingRes = await fetch(`/api/customers/ledger/${customerId}`);
        const billData = await billingRes.json();
        if (billData.success) {
          let runningBill = 0;
          // Purono theke natun e sort kore running balance calculate kora
          const formattedBill = billData.data
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((b) => {
              runningBill += b.total;
              return { ...b, cumulativeBill: runningBill };
            });
          setBillings(formattedBill.reverse()); // Reverse kore table-e latest upore rakha holo
        }

        // 3. Payment Data Fetch
        const payRes = await fetch(`/api/payments?userId=${customerId}`);
        const payData = await payRes.json();
        if (payData && payData.length > 0) {
          let runningPay = 0;
          const formattedPay = payData
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((p) => {
              runningPay += p.amount;
              return { ...p, cumulativePay: runningPay };
            });
          setPayments(formattedPay.reverse());
        }
      } catch (err) {
        console.error("Load Error:", err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) fetchAllData();
  }, [customerId]);

  if (loading) return <div className="p-10 text-center font-bold">Loading Statement...</div>;
console.log(customer);
console.log(billings);
console.log(payments);
  // Final Calculations for the Summary Card
  const totalBill = billings.length > 0 ? billings[0].cumulativeBill : 0;
  const totalPaid = payments.length > 0 ? payments[0].cumulativePay : 0;
  const netDue = totalBill - totalPaid;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      
      {/* --- Section 1: Top Summary Card --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
          <p className="text-xs uppercase opacity-80 font-bold">Total Bill Amount</p>
          <h2 className="text-3xl font-black">৳ {totalBill.toLocaleString()}</h2>
        </div>
        <div className="bg-green-600 text-white p-6 rounded-2xl shadow-lg">
          <p className="text-xs uppercase opacity-80 font-bold">Total Received</p>
          <h2 className="text-3xl font-black">৳ {totalPaid.toLocaleString()}</h2>
        </div>
        <div className={`${netDue >= 0 ? 'bg-red-600' : 'bg-teal-600'} text-white p-6 rounded-2xl shadow-lg`}>
          <p className="text-xs uppercase opacity-80 font-bold">{netDue >= 0 ? "Current Net Due" : "Advance Balance"}</p>
          <h2 className="text-3xl font-black">৳ {Math.abs(netDue).toLocaleString()}</h2>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
         <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h1 className="text-xl font-black uppercase text-gray-800">Statement: {customer?.companyName}</h1>
            <button onClick={() => window.print()} className="bg-gray-100 px-4 py-2 rounded text-xs font-bold border hover:bg-gray-200">PRINT</button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* --- Left Column: Billing History --- */}
            <div>
               <h3 className="text-sm font-bold text-red-600 mb-3 uppercase tracking-wider">Billing History (Debit)</h3>
               <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-xs text-left">
                     <thead className="bg-gray-50 border-b">
                        <tr>
                           <th className="p-3">Date</th>
                           <th className="p-3">Invoice</th>
                           <th className="p-3 text-right">Amount</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y">
                        {billings.map((b) => (
                           <tr key={b._id} className="hover:bg-gray-50">
                              <td className="p-3 whitespace-nowrap">{new Date(b.createdAt).toLocaleDateString("en-GB")}</td>
                              <td className="p-3 font-medium">{b.invoiceNumber} <br/><span className="text-[10px] text-gray-400">{b.colour}</span></td>
                              <td className="p-3 text-right font-bold text-gray-700">৳ {b.total.toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* --- Right Column: Payment History --- */}
            <div>
               <h3 className="text-sm font-bold text-green-600 mb-3 uppercase tracking-wider">Payment History (Credit)</h3>
               <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-xs text-left">
                     <thead className="bg-gray-50 border-b">
                        <tr>
                           <th className="p-3">Date</th>
                           <th className="p-3">Method</th>
                           <th className="p-3 text-right">Received</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y">
                        {payments.map((p) => (
                           <tr key={p._id} className="hover:bg-gray-50">
                              <td className="p-3 whitespace-nowrap">{new Date(p.date).toLocaleDateString("en-GB")}</td>
                              <td className="p-3 uppercase font-bold text-gray-400">{p.method}</td>
                              <td className="p-3 text-right font-bold text-green-700">৳ {p.amount.toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

         </div>
      </div>

      <div className="text-center text-xs text-gray-400 italic">
        Report Generated on {new Date().toLocaleString()}
      </div>
    </div>
  );
}