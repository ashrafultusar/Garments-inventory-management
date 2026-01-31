"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

const DyeingProfilePage = () => {
  const { dyeingId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBillingSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/dyeings/ledger/${dyeingId}`
      );
      if (!res.ok) throw new Error("Failed");
      const result = await res.json();
      setData(result);
    } catch (err) {
      toast.error("Failed to load dyeing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dyeingId) fetchBillingSummary();
  }, [dyeingId]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dyeing Billing Summary</h1>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">No records found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border">Invoice</th>
                <th className="px-3 py-2 border">Batch</th>
                <th className="px-3 py-2 border">Colour</th>
                <th className="px-3 py-2 border">Qty</th>
                <th className="px-3 py-2 border">Price</th>
                <th className="px-3 py-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  <td className="border px-3 py-2">
                    {item.invoiceNumber}
                  </td>
                  <td className="border px-3 py-2">
                    {item.batchName}
                  </td>
                  <td className="border px-3 py-2">
                    {item.colour || "-"}
                  </td>
                  <td className="border px-3 py-2">
                    {item.totalQty}
                  </td>
                  <td className="border px-3 py-2">
                    {item.price}
                  </td>
                  <td className="border px-3 py-2 font-semibold">
                    {item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DyeingProfilePage;
