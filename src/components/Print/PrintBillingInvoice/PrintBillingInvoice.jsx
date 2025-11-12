"use client";
import React, { useEffect, useState } from "react";

export default function PrintBillingInvoice({ order }) {
  const orderInfo = order?.orderInfo;
  // console.log(orderInfo);

  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    if (order && order.batches) {
      setBatches(order.batches);
      setLoading(false);
    }
  }, [order]);

  console.log(order);


  if (loading)
    return <p className="text-gray-500 py-6 text-center">Loading invoice...</p>;

  // প্রতি সারিতে ৩টা ব্যাচ দেখানোর জন্য chunk তৈরি
  const chunkedBatches = [];
  for (let i = 0; i < batches.length; i += 3) {
    chunkedBatches.push(batches.slice(i, i + 3));
  }

  return (
    <div
      className="print-only p-0 text-xs text-gray-800 font-sans bg-white"
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        padding: "10mm",
        boxSizing: "border-box",
      }}
    >
      {/* হেডার অংশ */}
      <div className="text-center border-b-2 border-black pb-3 mb-4">
        <h1 className="text-2xl font-bold">
          মেসার্স এস.এন ডাইং এন্ড ফিনিশিং এজেন্ট
        </h1>
        <p className="text-sm">ঠিকানা: মাধবদী, নরসিংদী</p>
      </div>

      <div className="grid grid-cols-3 text-sm font-medium border-b border-gray-400 pb-2 mb-4">
        <div className="space-y-1">
          <p>
            পার্টির নাম:{" "}
            <span className="font-normal">{orderInfo?.companyName}</span>
          </p>
          <p>
            Cloth Type:{" "}
            <span className="font-normal">{orderInfo?.clotheType}</span>
          </p>
        </div>
        <div className="space-y-1">
          <p>
            Cloth Quality:{" "}
            <span className="font-normal">{orderInfo?.quality}</span>
          </p>
          <p>
            Finishing Width:{" "}
            <span className="font-normal">{orderInfo?.finishingWidth}</span>
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p>
            Order ID: <span className="font-normal">{orderInfo?.orderId}</span>
          </p>
          <p>
            Invoice Number:{" "}
            <span className="font-normal">{order?.invoiceNumber}</span>
          </p>
          <p>
            Date:{" "}
            <span className="font-normal">
              {orderInfo?.updatedAt
                ? new Date(orderInfo.updatedAt).toLocaleDateString("en-BD", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "N/A"}
            </span>
          </p>
        </div>
      </div>

      {/* ব্যাচগুলোর grid layout */}
      <div className="mt-4 space-y-6">
        {chunkedBatches.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-2">
            {row.map((batch, index) => {
              const totalRoll = batch.rows?.length || 0;
              const totalGoj = batch.rows?.reduce(
                (sum, r) => sum + (r.goj || 0),
                0
              );

              return (
                <div
                  key={index}
                  className="border border-black flex flex-col"
                  style={{ pageBreakInside: "avoid" }}
                >
                  {/* ব্যাচ হেডার */}
                  <div className="text-center font-bold border-b border-black py-1">
                    {batch.batchName} - {batch.sillName}
                  </div>

                  {/* Dyeing + Finishing info */}
                  <div className="text-center border-b border-black py-1 text-[11px] leading-tight">
                    ডাইং: {batch.dyeing} <br />
                    ফিনিশিং: {batch.finishingType}
                  </div>

                  {/* Rows table */}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 border-b border-black text-center font-semibold text-[10px]">
                      <div className="border-r border-black p-1">রোল</div>
                      <div className="p-1">গজ</div>
                    </div>
                    {batch.rows?.map((rowData, rIndex) => (
                      <div
                        key={rIndex}
                        className="grid grid-cols-2 text-center border-b border-gray-300 text-[10px]"
                      >
                        <div className="border-r border-black p-1">
                          {rowData.rollNo}
                        </div>
                        <div className="p-1">{rowData.goj}</div>
                      </div>
                    ))}
                  </div>

                  {/* মোট ফলাফল */}
                  <div className="grid grid-cols-2 text-[11px] font-bold text-center border-t border-black">
                    <div className="border-r border-black p-1">
                      রোল: {totalRoll}
                    </div>
                    <div className="p-1">গজ: {totalGoj}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* স্বাক্ষর অংশ */}
      <div className="grid grid-cols-2 text-xs mt-10">
        <div className="col-span-1 text-center pt-6 border-t border-black mr-2">
          <p>তৈরী করেছেন</p>
        </div>
        <div className="col-span-1 text-center pt-6 border-t border-black ml-2">
          <p>গ্রহীতার স্বাক্ষর</p>
        </div>
      </div>
    </div>
  );
}
