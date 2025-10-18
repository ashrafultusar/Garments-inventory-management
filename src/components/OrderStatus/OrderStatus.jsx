"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import Stepper from "./Stepper";
import StatusModal from "./StatusModal";
import OrderTableData from "./OrderTableData";
import BatchList from "./BatchList";
import DeliveredBatchList from "../Batch/DeliveredBatchList";

// ✅ Steps for UI
const steps = [
  { id: 1, title: "Pending" },
  { id: 2, title: "Process" },
  { id: 3, title: "Batches" },
  { id: 4, title: "Calender" },
  { id: 5, title: "Delivered" },
  { id: 6, title: "Billing" },
  { id: 7, title: "Completed" },
];

// ✅ Mapping UI titles ↔ DB enum
const statusMap = {
  Pending: "pending",
  Process: "inprocess",
  Batches: "batch",
  Calender: "calender",
  Delivered: "delivered",
  Billing: "billing",
  Completed: "completed",
};

export default function OrderStatus({
  orderId,
  currentStatus,
  tableData,
  onStatusChange,
  selectedOrder,
}) {
  const [currentStep, setCurrentStep] = useState(
    steps.find((s) => statusMap[s.title] === currentStatus)?.id || 1
  );
  const [selectedStep, setSelectedStep] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [usedRowIndexes, setUsedRowIndexes] = useState([]);
  const [createdBatches, setCreatedBatches] = useState([]);

  // ✅ Direct status update
  const updateStatusDirectly = async (step) => {
    try {
      const res = await fetch(`/api/order/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusMap[step.title] }),
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentStep(step.id);
        onStatusChange(statusMap[step.title]);
        // toast.success("Status updated!");
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // ✅ Confirm change (Pending → Process only)
  const confirmChange = async () => {
    await updateStatusDirectly(selectedStep);
    setShowModal(false);
  };

  // ✅ Handle step click
  const handleStepClick = async (step) => {
    // Only show confirm when going from Pending → Process
    if (currentStep === 1 && step.id === 2) {
      setSelectedStep(step);
      setShowModal(true);
      return;
    }

    // Allow any other status change directly
    await updateStatusDirectly(step);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6 text-gray-800">Status</h2>

      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {/* Show content based on current step */}
      {steps[currentStep - 1]?.title === "Process" && (
        <OrderTableData
          selectedOrder={selectedOrder}
          orderId={orderId}
          tableData={tableData}
          currentStep={currentStep}
          usedRowIndexes={usedRowIndexes}
          setUsedRowIndexes={setUsedRowIndexes}
          sillName={selectedOrder?.sillName}
          createdBatches={createdBatches}
          setCreatedBatches={setCreatedBatches}
        />
      )}

      {steps[currentStep - 1]?.title === "Batches" && (
        <BatchList orderId={orderId} />
      )}

      {steps[currentStep - 1]?.title === "Delivered" && (
        <DeliveredBatchList orderId={orderId} />
      )}

      {/* Confirmation modal only for first change */}
      {showModal && selectedStep && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <StatusModal
              selectedStep={selectedStep}
              confirmChange={confirmChange}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
