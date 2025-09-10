import { useState, useEffect } from "react";

export default function useBatch(orderId) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/batches?orderId=${orderId}`);
      const data = await res.json();
      setBatches(data);
    } catch (err) {
      console.error("Failed to fetch batches", err);
    } finally {
      setLoading(false);
    }
  };

  const createBatch = async (batchData) => {
    try {
      const res = await fetch(`/api/batches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batchData),
      });
      const data = await res.json();
      await fetchBatches();
      return data;
    } catch (err) {
      console.error("Failed to create batch", err);
    }
  };

  useEffect(() => {
    if (orderId) fetchBatches();
  }, [orderId]);

  return {
    batches,
    loading,
    createBatch,
    fetchBatches,
  };
}
