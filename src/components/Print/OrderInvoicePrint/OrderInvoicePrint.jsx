"use client";


import React from "react";

export default function OrderPrint({ order }) {
  const tableRows = order?.tableData || [
    { _id: "1", rollNo: 1, goj: 10.5, extra: "1.2" },
    { _id: "2", rollNo: 2, goj: 11.2, extra: "0.8" },
    { _id: "3", rollNo: 3, goj: 9.8, extra: "0.5" },
  ];

  const totalGoj = tableRows
    .reduce((sum, row) => sum + (parseFloat(row.goj) || 0) + (parseFloat(row.extra) || 0), 0)
    .toFixed(2);

  const totalRoll = tableRows.length;

  const invoiceNumber = order?.invoiceNumber || "N/A";
  const date = order?.updatedAt
  ? new Date(order.updatedAt).toLocaleDateString("en-BD")
  : new Date().toLocaleDateString("en-BD");

  const clotheType = order?.clotheType || "Polyster";
  const finishingWidth = order?.finishingWidth || "58''";
  const orderId = order?.orderId || "ORD-001";
  const dyeingName = order?.dyeingName || "M/S Color Dyes";
  const partyName = order?.companyName || "M/S Rahman Fabrics";

  return (
    <div className="print-area font-sans mt-12 text-gray-900 bg-white p-10 max-w-3xl mx-auto border border-gray-300 rounded-lg shadow-md print:shadow-none print:border-none print:p-0">
      {/* HEADER */}
      <div className="text-center border-b-2 border-black pb-3 mb-4">
        <h1 className="text-2xl font-bold">মেসার্স এস.এন ডাইং এন্ড ফিনিশিং এজেন্ট</h1>
        <p className="text-sm">ঠিকানা: মাধবদী, নরসিংদী</p>
      </div>

      {/* ORDER INFO */}
      <div className="grid grid-cols-3 text-sm font-medium border-b border-gray-400 pb-2 mb-4">
        <div className="space-y-1">
          <p>Company: <span className="font-normal">{partyName}</span></p>
          <p>Dyeing: <span className="font-normal">{dyeingName}</span></p>
        </div>
        <div className="space-y-1">
          <p>Cloth: <span className="font-normal">{clotheType}</span></p>
          <p>Finishing: <span className="font-normal">{finishingWidth}</span></p>
        </div>
        <div className="space-y-1 text-right">
          <p>Order ID: <span className="font-normal">{orderId}</span></p>
          <p>Invoice: <span className="font-normal">{invoiceNumber}</span></p>
          <p>Date: <span className="font-normal">{date}</span></p>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full border border-gray-400 border-collapse text-sm mb-10">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-400 py-2 w-[25%]">রোল নং</th>
            <th className="border border-gray-400 py-2 w-[25%]">গজ</th>
          
          </tr>
        </thead>
        <tbody>
          {tableRows?.map((row, i) => {
            const totalRow = (parseFloat(row.goj) || 0) + (parseFloat(row.extra) || 0);
            return (
              <tr key={row._id || i} className="even:bg-gray-50 text-center">
                <td className="border border-gray-400 py-1">{row.rollNo}</td>
                <td className="border border-gray-400 py-1">{row.goj}</td>
              
               
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-semibold">
            <td className="border border-gray-400 py-2 text-left pl-3">মোট রোল: {totalRoll}</td>
            <td colSpan={3} className="border border-gray-400 py-2 text-right pr-3">
              মোট গজ: {totalGoj}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* SIGNATURE */}
      <div className="flex justify-between mt-16 text-sm text-center">
        <div className="border-t border-gray-500 border-dashed pt-1 w-40">গ্রাহকের স্বাক্ষর</div>
        <div className="border-t border-gray-500 border-dashed pt-1 w-40">কর্তৃপক্ষের স্বাক্ষর</div>
      </div>
    </div>
  );
}
