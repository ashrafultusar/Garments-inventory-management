"use client";


export default function PrintBillingInvoice({ order }) {
  const orderInfo = order?.orderInfo;

  const batches = order?.batches || []; 

  const chunkedBatches = [];
  for (let i = 0; i < batches.length; i += 3) {
    chunkedBatches.push(batches.slice(i, i + 3));
  }


  // --- ফিনিশিং ডেটার মোট গজ এবং রোলের হিসেব ---
  let grandTotalFinishGoj = 0;
  let grandTotalFinishRolls = 0;

  batches.forEach(batch => {
    // FINISHING rows = rows + extraInputs
    const finishingMainRows = batch.rows?.map(r => ({
      rollNo: r.rollNo,
      goj: r.goj
    })) || [];

    const finishingExtraRows = batch.rows
      ?.flatMap(r => r.extraInputs?.map((ex, exIndex) => ({
        rollNo: `${r.rollNo}.${exIndex + 1}`,
        goj: Number(ex.value || 0)
      })) || [])
      || [];

    const finishingRows = [...finishingMainRows, ...finishingExtraRows];

    const totalFinish = finishingRows.reduce((sum, r) => sum + (r.goj || 0), 0);

    grandTotalFinishGoj += totalFinish;
    grandTotalFinishRolls += finishingRows.length;
  });
 


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
    <div key={rowIndex} className="grid grid-cols-3 gap-4">
      {row.map((batch, index) => {

        // GRAY (same as rows)
        const grayRows = batch.rows?.map(r => ({
          rollNo: r.rollNo,
          goj: r.goj
        })) || [];

        // FINISHING rows = rows + extraInputs
        const finishingMainRows = batch.rows?.map(r => ({
          rollNo: r.rollNo,
          goj: r.goj
        })) || [];

        const finishingExtraRows = batch.rows
          ?.flatMap(r => r.extraInputs?.map((ex, exIndex) => ({
            rollNo: `${r.rollNo}.${exIndex + 1}`,
            goj: Number(ex.value || 0)
          })) || [])
          || [];

        const finishingRows = [...finishingMainRows, ...finishingExtraRows];

        const totalGray = grayRows.reduce((sum, r) => sum + (r.goj || 0), 0);
        const totalFinish = finishingRows.reduce((sum, r) => sum + (r.goj || 0), 0);

        return (
          <div
            key={index}
            className="border border-black"
            style={{ pageBreakInside: "avoid" }}
          >
            {/* Header */}
            <div className="text-center font-bold border-b border-black py-1">
              {batch.batchName} - {batch.sillName}
            </div>

            {/* Title */}
            <div className="text-center border-b border-black py-1 text-[11px] leading-tight">
              ডাইং-গ্রে রোল ফিনিশিং-ফুল হাড়
            </div>

            {/* 2 Table Layout */}
            <div className="grid grid-cols-2">

              {/* GRAY TABLE */}
              <div className="border-r border-black">
                <div className="text-center font-semibold border-b border-black py-1 text-[11px]">
                  গ্রে- বেচ ১
                </div>

                {/* Header */}
                <div className="grid grid-cols-2 text-[10px] font-semibold border-b border-black text-center">
                  <div className="border-r border-black py-1">রোল</div>
                  <div className="py-1">গজ</div>
                </div>

                {/* Rows */}
                {grayRows.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 border-b border-gray-300 text-[10px] text-center"
                  >
                    <div className="border-r border-black py-1">{r.rollNo}</div>
                    <div className="py-1">{r.goj}</div>
                  </div>
                ))}

                {/* Total */}
                <div className="grid grid-cols-2 text-center text-[11px] font-bold border-t border-black">
                  <div className="border-r border-black py-1">
                    রোল: {grayRows.length}
                  </div>
                  <div className="py-1">গজ: {totalGray}</div>
                </div>
              </div>

              {/* FINISHING TABLE */}
              <div>
                <div className="text-center font-semibold border-b border-black py-1 text-[11px]">
                  ফিনিশিং- বেচ ১
                </div>

                <div className="grid grid-cols-2 text-[10px] font-semibold border-b border-black text-center">
                  <div className="border-r border-black py-1">রোল</div>
                  <div className="py-1">গজ</div>
                </div>

                {/* All finishing rows */}
                {finishingRows.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 border-b border-gray-300 text-[10px] text-center"
                  >
                    <div className="border-r border-black py-1">{r.rollNo}</div>
                    <div className="py-1">{r.goj}</div>
                  </div>
                ))}

                <div className="grid grid-cols-2 text-center text-[11px] font-bold border-t border-black">
                  <div className="border-r border-black py-1">
                    রোল: {finishingRows.length}
                  </div>
                  <div className="py-1">গজ: {totalFinish}</div>
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  ))}
</div>

      {/* Grand Summary Section  */}
      <div className="mt-6 border-b-2 border-black">
        <div className="grid grid-cols-4 font-bold text-lg text-center border border-black" style={{ backgroundColor: "#D3D3D3" }}>
          <div className="py-2 border-r border-black">
            মোট গজ:
          </div>
          <div className="py-2 border-r border-black">
            {grandTotalFinishGoj}
          </div>
          <div className="py-2 border-r border-black">
            মোট রোল:
          </div>
          <div className="py-2">
            {grandTotalFinishRolls}
          </div>
        </div>
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