// "use client";

// export default function DummyLedger() {
//   const customer = {
//     name: "BRITNEY SPEARS",
//   };

//   const ledger = [
//     {
//       date: "07/16/18",
//       cpt: "97124.GP",
//       loc: "—",
//       class: "—",
//       provider: "10576",
//       description: "MASSAGE THERAPY",
//       charge: 75.0,
//       payment: "",
//       balance: 300.0,
//     },
//     {
//       date: "07/16/18",
//       cpt: "97110.GP",
//       loc: "—",
//       class: "—",
//       provider: "10576",
//       description: "THERAPEUTIC EXERCISES",
//       charge: 50.0,
//       payment: "",
//       balance: 350.0,
//     },
//     {
//       date: "07/16/18",
//       cpt: "97010.GP",
//       loc: "—",
//       class: "—",
//       provider: "10576",
//       description: "HOT OR COLD PACKS THERAPY",
//       charge: 15.0,
//       payment: "",
//       balance: 365.0,
//     },
//     {
//       date: "07/16/18",
//       cpt: "",
//       loc: "",
//       class: "",
//       provider: "",
//       description: "Adjustments applied",
//       charge: "",
//       payment: 29.5,
//       balance: 335.5,
//     },
//     {
//       date: "07/16/18",
//       cpt: "",
//       loc: "",
//       class: "",
//       provider: "",
//       description: "Insurance payment (Chk #74125)",
//       charge: "",
//       payment: 190.5,
//       balance: 145.0,
//     },
//   ];

//   return (
//     <div className="bg-white p-8 mt-8 rounded-xl shadow">
//       {/* Header */}
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-2xl font-bold">Client Ledger Statement</h1>
//           <p className="mt-2">
//             <strong>Client:</strong>{" "}
//             <span className="px-2 py-1 border rounded bg-gray-50">
//               {customer.name}
//             </span>
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <button className="border px-3 py-1 rounded bg-gray-100">
//             Date Presets
//           </button>
//           <button className="border px-3 py-1 rounded bg-gray-200">Print</button>
//         </div>
//       </div>

//       {/* Date Range
//       <div className="flex items-center gap-4 mt-4">
//         <span className="font-medium">Date range:</span>
//         <input type="date" className="border p-1 rounded" />
//         <span className="font-medium">to</span>
//         <input type="date" className="border p-1 rounded" />
//       </div> */}

//       {/* Table */}
//       <div className="border mt-6 rounded overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-200 border-b">
//             <tr>
//               <th className="px-3 py-2 text-left">Date</th>
//               <th className="px-3 py-2 text-left">CPT®</th>
//               <th className="px-3 py-2 text-left">Loc</th>
//               <th className="px-3 py-2 text-left">Class</th>
//               <th className="px-3 py-2 text-left">Provider</th>
//               <th className="px-3 py-2 text-left">Description</th>
//               <th className="px-3 py-2 text-right">Charge</th>
//               <th className="px-3 py-2 text-right">Payment</th>
//               <th className="px-3 py-2 text-right">Balance</th>
//             </tr>
//           </thead>

//           <tbody>
//             {ledger.map((row, idx) => (
//               <tr key={idx} className="border-b">
//                 <td className="px-3 py-2">{row.date}</td>
//                 <td className="px-3 py-2">{row.cpt}</td>
//                 <td className="px-3 py-2">{row.loc}</td>
//                 <td className="px-3 py-2">{row.class}</td>
//                 <td className="px-3 py-2">{row.provider}</td>
//                 <td className="px-3 py-2">{row.description}</td>
//                 <td className="px-3 py-2 text-right">
//                   {row.charge !== "" ? row.charge.toFixed(2) : ""}
//                 </td>
//                 <td className="px-3 py-2 text-right">
//                   {row.payment !== "" ? row.payment.toFixed(2) : ""}
//                 </td>
//                 <td className="px-3 py-2 text-right font-medium">
//                   {row.balance.toFixed(2)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>

//           {/* Totals */}
//           <tfoot>
//             <tr className="bg-gray-100 font-bold border-t">
//               <td colSpan={6} className="px-3 py-2 text-right">
//                 Totals:
//               </td>
//               <td className="px-3 py-2 text-right">155.00</td>
//               <td className="px-3 py-2 text-right">220.00</td>
//               <td className="px-3 py-2 text-right">145.00</td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

const CustomerLedger = () => {
  const { customerid } = useParams();
  const [customer, setCustomer] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedgerData = async () => {
      try {
        // ১. কাস্টমার ইনফো লোড
        const resCust = await fetch(`/api/customers/${customerid}`);
        const custData = await resCust.json();
        setCustomer(custData);

        // ২. বিলিং সামারি লোড (আগে তৈরি করা API রাউট থেকে)
        const resSum = await fetch(`/api/customers/billing-summary/${customerid}`);
        const sumData = await resSum.json();
        setSummaries(sumData);
      } catch (err) {
        toast.error("Failed to load ledger data");
      } finally {
        setLoading(false);
      }
    };

    if (customerid) fetchLedgerData();
  }, [customerid]);

  // ক্যালকুলেশন
  const totalCharge = summaries.reduce((acc, curr) => acc + curr.total, 0);
  const totalQty = summaries.reduce((acc, curr) => acc + curr.totalQty, 0);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Ledger Statement...</div>;

  return (
    <div className="bg-white p-8 mt-8 rounded-xl shadow border border-gray-100">
      {/* Header - আপনার দেওয়া স্টাইল অনুযায়ী */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Client Ledger Statement</h1>
          <div className="mt-4 flex flex-col gap-2">
            <p>
              <strong>Company:</strong>{" "}
              <span className="px-3 py-1 border rounded bg-gray-50 font-medium">
                {customer?.companyName || "N/A"}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <strong>Owner:</strong> {customer?.ownerName} | <strong>Phone:</strong> {customer?.phoneNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 no-print">
          <button className="border px-4 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm transition">
            Date Presets
          </button>
          <button 
            onClick={() => window.print()}
            className="border px-4 py-1.5 rounded bg-gray-800 text-white hover:bg-gray-700 text-sm transition shadow-sm"
          >
            Print
          </button>
        </div>
      </div>

      {/* Table - আপনার দেওয়া DummyLedger ফরম্যাট অনুযায়ী */}
      <div className="border mt-8 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Invoice #</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Description</th>
              <th className="px-4 py-3 text-right font-bold text-gray-700">Qty (গজ)</th>
              <th className="px-4 py-3 text-right font-bold text-gray-700">Price</th>
              <th className="px-4 py-3 text-right font-bold text-gray-700">Charge/Total</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {summaries.length > 0 ? (
              summaries.map((row) => (
                <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3 font-mono text-blue-600 font-medium">
                    {row.invoiceNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">{row.batchName}</div>
                    <div className="text-[11px] text-gray-500 uppercase">
                      {row.colour} • {row.finishingType}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{row.totalQty}</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {row.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">
                    {row.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400 italic">
                  No billing history found for this client.
                </td>
              </tr>
            )}
          </tbody>

          {/* Totals - আপনার দেওয়া স্টাইল অনুযায়ী */}
          <tfoot>
            <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
              <td colSpan={3} className="px-4 py-3 text-right text-gray-700">
                Summary Totals:
              </td>
              <td className="px-4 py-3 text-right border-x border-gray-200">
                {totalQty}
              </td>
              <td className="px-4 py-3 bg-gray-50"></td>
              <td className="px-4 py-3 text-right text-lg text-blue-700">
                {totalCharge.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer Note */}
      <div className="mt-6 text-[10px] text-gray-400 text-center italic uppercase tracking-widest">
        This is a computer-generated statement
      </div>
    </div>
  );
};

export default CustomerLedger;