"use client";

import React from 'react';

export default function OrderPrint({ order }) {
  // Provided data for demonstration, assuming 'order' prop will contain actual data
  const tableRows = order?.tableData || [
    { _id: "a1", rollNo: 1, goj: 10 },
    { _id: "b2", rollNo: 2, goj: 12 },
    { _id: "c3", rollNo: 3, goj: 12 },
    { _id: "d4", rollNo: 4, goj: 14 },
    { _id: "e5", rollNo: 5, goj: 125 },
    { _id: "f6", rollNo: 6, goj: 14 },
    { _id: "g7", rollNo: 7, goj: 15 },
    { _id: "h8", rollNo: 8, goj: 2 },
    { _id: "i9", rollNo: 9, goj: 22 },
    { _id: "j10", rollNo: 10, goj: 32 },
  ];

  // Calculate totals based on the provided tableRows
  const totalGoj = tableRows.reduce((sum, row) => sum + (row.goj || 0), 0).toFixed(1);
  const totalRoll = tableRows.length;

  // Header Data from the image and previous context
  const companyName = order?.companyName || "মেসার্স এম.এন ক্লথ স্টোর"; // Updated from S.N. to M.N.
  const address = "ঠিকানা: মাধবদী, নরসিংদী";

  // Data for the info table
  const invoiceNumber = order?.invoiceNumber || "730";
  const date = order?.date || "2016-02-21";
  const clotheType = order?.clotheType || "polyster";
  const finishingWidth = order?.finishingWidth || "84";
  const dyeingName = order?.dyeingName || "Harding Marquez";
  const transporterName = order?.transporterName || "Jelani Savage";

  return (
    <div className="p-8 font-sans max-w-2xl mx-auto border border-gray-300 shadow-sm bg-white">
      {/* 1. Header Section */}
      <div className="text-center mb-8">
        <h2 className="font-extrabold text-2xl mb-1 text-gray-800">
          {companyName}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {address}
        </p>
        <h3 className="text-lg font-semibold border-b-2 border-gray-700 inline-block pb-1 mt-4">
          প্রিন্ট অর্ডার স্লিপ
        </h3>
      </div>

      {/* 2. Order Info & Buyer Details Table */}
      <table className="w-full mb-6 text-sm border-collapse">
        <tbody>
          {/* Row 1 */}
          <tr className="bg-gray-50">
            <td className="p-2 border border-gray-300 w-1/2">
              <span className="font-bold">চালান নং (Invoice No):</span> {invoiceNumber}
            </td>
            <td className="p-2 border border-gray-300 w-1/2">
              <span className="font-bold">তারিখ (Date):</span> {date}
            </td>
          </tr>
          {/* Row 2 */}
          <tr>
            <td className="p-2 border border-gray-300 w-1/2">
              <span className="font-bold">কাপড়ের ধরন (Cloth Type):</span> {clotheType}
            </td>
            <td className="p-2 border border-gray-300 w-1/2">
              <span className="font-bold">ফিনিশিং প্রস্থ (Finishing Width):</span> {finishingWidth}
            </td>
          </tr>
          {/* Row 3 */}
          <tr className="bg-gray-50">
            <td className="p-2 border border-gray-300 w-1/2">
              <span className="font-bold">ডাইং নাম (Dyeing Name):</span> {dyeingName}
            </td>
            <td className="p-2 border border-gray-300 w-1/2">
              <span className="font-bold">পরিবহনকারী (Transporter):</span> {transporterName}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 3. Main Product Table */}
      <table className="w-full border border-gray-300 border-collapse text-center text-sm mb-12">
        <thead>
          <tr className="bg-gray-200 font-bold text-gray-700">
            <th className="p-2 border border-gray-300">রোল নং (Roll No)</th>
            <th className="p-2 border border-gray-300">গজ (Goj)</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, i) => (
            <tr key={row._id || i} className="even:bg-gray-50">
              <td className="p-2 border border-gray-300">{row.rollNo}</td>
              <td className="p-2 border border-gray-300">{row.goj}</td>
            </tr>
          ))}
        </tbody>
        {/* 4. Footer Summary for Main Table */}
        <tfoot>
          <tr className="font-bold bg-blue-100 text-gray-800">
            <td className="p-2 border border-gray-300 text-left">
              মোট রোল (Total Roll): {totalRoll}
            </td>
            <td className="p-2 border border-gray-300 text-right">
              মোট গজ (Total Goj): {totalGoj}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* 5. Signatures Section */}
      <div className="mt-16 flex justify-between text-sm">
        <div className="w-2/5 text-center pt-1 border-t border-dashed border-gray-500">
          গ্রহীতার স্বাক্ষর
        </div>
        <div className="w-2/5 text-center pt-1 border-t border-dashed border-gray-500">
          কর্তৃপক্ষের স্বাক্ষর
        </div>
      </div>
    </div>
  );
}