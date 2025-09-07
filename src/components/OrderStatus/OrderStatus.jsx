"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import Stepper from "./Stepper";
import StatusDescription from "./StatusDescription";
import StatusModal from "./StatusModal";
import ProcessingModal from "./ProcessingModal";

const steps = [
  { id: 1, title: "Pending", description: "Order is pending and waiting to be processed." },
  { id: 2, title: "In Process", description: "Your order is being processed." },
  { id: 3, title: "Completed Process", description: "Specific process for the order has been completed." },
  { id: 4, title: "Delivered", description: "Your order has been delivered." },
  { id: 5, title: "Billing", description: "Billing is being finalized." },
  { id: 6, title: "Completed", description: "Order is completed successfully." },
];



export default function OrderStatus({ orderId, currentStatus, onStatusChange }) {
  const [currentStep, setCurrentStep] = useState(
    steps.find((s) => s.title === currentStatus)?.id || 1
  );
  const [selectedStep, setSelectedStep] = useState(null);
  const [showModal, setShowModal] = useState(false);

 

  const handleStepClick = (step) => {
    if (step.id === currentStep + 1) {
      setSelectedStep(step);
      setShowModal(true);
    } else if (step.id <= currentStep) {
      setCurrentStep(step.id);
    } else {
      toast.error("You must complete the previous step first!");
    }
  };

 

  const confirmChange = async () => {
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: selectedStep.title,
          processing: processingList,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentStep(selectedStep.id);
        setShowModal(false);
        onStatusChange(selectedStep.title);
      } else {
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-lg font-semibold mb-6 text-gray-800">Status</h2>

      {/* ✅ Stepper */}
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {/* ✅ নিচে description */}
      <StatusDescription steps={steps} currentStep={currentStep} />

      {/* ✅ Modal Handling */}
      {showModal && selectedStep && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            {selectedStep.title === "Completed Process" ? (
              <ProcessingModal
                orderId={orderId}
                processingOptions={processingOptions}
                processingList={processingList}
                toggleProcessing={toggleProcessing}
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
