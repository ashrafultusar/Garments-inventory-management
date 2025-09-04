"use client";
import { useState } from "react";
import { toast } from "react-toastify";

const steps = [
  { id: 1, title: "Pending", description: "Order is pending and waiting to be processed." },
  { id: 2, title: "In Process", description: "Your order is being processed." },
  { id: 3, title: "Delivered", description: "Your order has been delivered." },
  { id: 4, title: "Billing", description: "Billing is being finalized." },
  { id: 5, title: "Completed", description: "Order is completed successfully." },
];

const processingOptions = [
  "Dyeing",
  "Finishing",
  "Calculate yards",
  "Binding",
  "Test 1",
];

export default function OrderStatus({ orderId, currentStatus, onStatusChange }) {
  const [currentStep, setCurrentStep] = useState(
    steps.find((s) => s.title === currentStatus)?.id || 1
  );
  const [selectedStep, setSelectedStep] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Processing list state
  const [processingList, setProcessingList] = useState({
    Dyeing: true,
    Finishing: true,
    "Calculate yards": false,
    Binding: false,
    "Test 1": false,
  });

  const handleStepClick = (step) => {
    // ✅ শুধু 1 step পরের status এ যেতে দেবে
    if (step.id === currentStep + 1) {
      setSelectedStep(step);
      setShowModal(true);
    } else if (step.id <= currentStep) {
      // আগের step এ click করলে শুধু দেখাবে
      setCurrentStep(step.id);
    } else {
      // Skip করতে চাইলে কিছু হবে না
      toast.error("You must complete the previous step first!");
    }
  };
  

  // ✅ Toggle Selected/Unselected
  const toggleProcessing = (key) => {
    setProcessingList((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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

  // ---------- Modal Content ----------
  const renderModalContent = () => {
    if (!selectedStep) return null;

    if (selectedStep.title === "Delivered") {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-2">Change Order Status</h3>
          <p className="text-sm text-gray-500 mb-4">#{orderId}</p>

          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
              {steps.find((s) => s.id === currentStep)?.title}
            </span>
            <span className="text-gray-500">→</span>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
              {selectedStep.title}
            </span>
          </div>

          {/* ✅ Processing List Styled Like Your Screenshot */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
            <p className="font-semibold text-blue-800 mb-2">Current Processing List:</p>
            <ul className="text-sm space-y-2">
              {processingOptions.map((item) => (
                <li
                  key={item}
                  className="flex justify-between items-center cursor-pointer hover:bg-blue-100 p-2 rounded"
                  onClick={() => toggleProcessing(item)}
                >
                  <span>{item}:</span>
                  {processingList[item] ? (
                    <span className="flex items-center text-green-600 font-medium">
                      ✅ Selected
                    </span>
                  ) : (
                    <span className="flex items-center text-red-500 font-medium">
                      ⭕ Unselected
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-xs text-blue-600 mt-2">
              Note: Processing list is optional. Selected items show which processes the order has passed through.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              onClick={confirmChange}
            >
              Confirm Change
            </button>
          </div>
        </div>
      );
    }

    // Default modal for others
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Change Order Status</h3>
        <p className="text-gray-600 mb-6">
          The order will be moved to <b>{selectedStep?.title}</b>.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={confirmChange}
          >
            Confirm
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-lg font-semibold mb-6 text-gray-800">Status</h2>

      {/* Steps Container */}
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 z-0 mx-[40px]">
          <div
            className="h-0.5 bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-between relative z-10">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center cursor-pointer"
              onClick={() => handleStepClick(step)}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 
                  ${currentStep === step.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : currentStep > step.id
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 text-gray-500"
                  }`}
              >
                {step.id}
              </div>
              <p
                className={`mt-2 text-sm font-medium ${
                  currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {step?.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 bg-green-100 rounded-lg text-gray-700 text-center shadow-sm">
        {steps.find((step) => step.id === currentStep)?.description}
      </div>

      {showModal && selectedStep && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}
