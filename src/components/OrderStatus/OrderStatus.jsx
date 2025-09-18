"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Stepper from "./Stepper";
import StatusDescription from "./StatusDescription";
import StatusModal from "./StatusModal";
import ProcessingModal from "./ProcessingModal";
import OrderTableData from "./OrderTableData";
import BatchList from "./BatchList";

// ✅ Steps for UI
const steps = [
  { id: 1, title: "Pending", description: "Order is pending." },
  { id: 2, title: "In Process", description: "Your order is being processed." },
  { id: 3, title: "All Batches", description: "All Batches." },
  { id: 4, title: "Delivered", description: "Order delivered." },
  { id: 5, title: "Billing", description: "Billing finalized." },
  { id: 6, title: "Completed", description: "Order completed." },
];

// ✅ Mapping UI titles ↔ DB enum
const statusMap = {
  "Pending": "pending",
  "In Process": "inprocess",
  "All Batches": "batch",
  "Delivered": "delivered",
  "Billing": "billing",
  "Completed": "completed",
};

export default function OrderStatus({
  orderId,
  currentStatus,
  tableData,
  onStatusChange,
  selectedOrder,
}) {
  // find matching step from DB status
  const [currentStep, setCurrentStep] = useState(
    steps.find((s) => statusMap[s.title] === currentStatus)?.id || 1
  );
  const [selectedStep, setSelectedStep] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [usedRowIndexes, setUsedRowIndexes] = useState([]);
  const [createdBatches, setCreatedBatches] = useState([]);

  const handleStepClick = (step) => {
    // ✅ Moving forward
    if (step.id === currentStep + 1) {
      // Special condition: In Process → must create batch
      if (currentStep === 2 && createdBatches.length === 0) {
        toast.error("You must create at least one batch first!");
        return;
      }

      setSelectedStep(step);
      setShowModal(true);
    }
    // ✅ Going back
    else if (step.id <= currentStep) {
      setCurrentStep(step.id);
    }
    // ✅ Skipping steps
    else {
      toast.error("You must complete the previous step first!");
    }
  };

  // ✅ Confirm status change → PATCH API
  const confirmChange = async () => {
    try {
      const res = await fetch(`/api/order/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusMap[selectedStep.title] }),
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentStep(selectedStep.id);
        setShowModal(false);
        onStatusChange(statusMap[selectedStep.title]);
        toast.success("Status updated!");
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
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

      <StatusDescription steps={steps} currentStep={currentStep} />

      {/* ✅ Only show OrderTableData in In Process step */}
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

{/* ✅ Only show BatchList in "All Batches" step */}
{steps[currentStep - 1]?.title === "All Batches" && (
  <BatchList orderId={orderId} />
)}



      {/* ✅ Modal for confirming status change */}
      {showModal && selectedStep && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            {selectedStep.title === "Completed Process" ? (
              <ProcessingModal
                orderId={orderId}
                confirmChange={confirmChange}
                onClose={() => setShowModal(false)}
              />
            ) : (
              <StatusModal
                selectedStep={selectedStep}
                confirmChange={confirmChange}
                onClose={() => setShowModal(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
