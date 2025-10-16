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
  { id: 2, title: "In Process" },
  { id: 3, title: "All Batches" },
  { id: 4, title: "Delivered" },
  { id: 5, title: "Billing" },
  { id: 6, title: "Completed" },
];

// ✅ Mapping UI titles ↔ DB enum
const statusMap = {
  Pending: "pending",
  "In Process": "inprocess",
  "All Batches": "batch",
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

  // ✅ Direct status update without showing modal
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
        toast.success("Status updated!");
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // ✅ Confirm status change → only used for first time
  const confirmChange = async () => {
    await updateStatusDirectly(selectedStep);
    setShowModal(false);
  };

  const handleStepClick = async (step) => {
    if (step.id === currentStep + 1) {
      if (currentStep === 1 && step.id === 2) {
        setSelectedStep(step);
        setShowModal(true);
        return;
      }

      await updateStatusDirectly(step);
    } else if (step.id <= currentStep) {
      setCurrentStep(step.id);
    } else {
      toast.error("You must complete the previous step first!");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6 text-gray-800">Status</h2>

      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {/* Only show OrderTableData in In Process step */}
      {steps[currentStep - 1]?.title === "In Process" && (
        <OrderTableData
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

      {/* Only show BatchList in "All Batches" step */}
      {steps[currentStep - 1]?.title === "All Batches" && (
        <BatchList orderId={orderId} />
      )}

      {/* Only show Delivered Batch List in "Delivered" step */}
      {steps[currentStep - 1]?.title === "Delivered" && (
        <DeliveredBatchList orderId={orderId} />
      )}

      {/* Only FIRST confirm modal (Pending → In Process) */}
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
