
export default function PrintBillingInvoice() {
  return (
    <div className="max-w-[900px] mx-auto p-6 text-[12px] font-sans border border-black">
      <div className="text-center">
        <h1 className="text-xl font-bold">
          মেসার্স এস.এন ডাইং এন্ড ফিনিশিং এজেন্ট
        </h1>
        <p className="font-bold text-[14px]">ঠিখানা: মাধবদী, নরসিংদী</p>
      </div>

      <div className="flex justify-between mt-3">
        <div>
          <p>পাটির নাম</p>
          <p>পাটির ঠিকানা</p>
        </div>
        <div className="text-right text-[10px]">
          <p>Cloth Type</p>
          <p>Cloth Quality</p>
        </div>
        <div className="text-right text-[10px]">
          <p>তারিখ + সময়</p>
          <p>Finishing Width </p>
        </div>
        <div className="text-right text-[10px]">
          <p>invoice Number </p>
          <p>Order number </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="border border-black p-2 text-center font-bold text-[12px]">
          বেট - ১ - সিল
        </div>
        <div className="border border-black p-2 text-center font-bold text-[12px]">
          বেট - ২ - সিল
        </div>
        <div className="border border-black p-2 text-center font-bold text-[12px]">
          বেট - ৩ - সিল
        </div>
      </div>

      <div className="mt-2 text-center text-[12px] font-bold">
        ডাইং - যেকোন ফিনিশিং - ফুল হাচ
      </div>

      <table className="w-full border border-black mt-3 text-[11px] text-center">
        <thead>
          <tr>
            <th className="border border-black">ক্রঃ</th>
            <th className="border border-black">ফিনিশিং - বেট ১</th>
            <th className="border border-black">ক্রঃ</th>
            <th className="border border-black">ফিনিশিং - বেট ২</th>
            <th className="border border-black">ক্রঃ</th>
            <th className="border border-black">ফিনিশিং - বেট ৩</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(20)].map((_, i) => (
            <tr key={i}>
              <td className="border border-black p-1">{i + 1}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1">{i + 1}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1">{i + 1}</td>
              <td className="border border-black p-1"></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-3 text-center font-bold mt-4">
        <div className="border border-black p-1">মোট গজঃ 800</div>
        <div className="border border-black p-1">মোটঃ 1520</div>
        <div className="border border-black p-1">বাকীঃ 7</div>
      </div>
    </div>
  );
}
