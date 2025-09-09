"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Stepper from "./Stepper";
import StatusDescription from "./StatusDescription";
import StatusModal from "./StatusModal";
import ProcessingModal from "./ProcessingModal";
import OrderTableData from "./OrderTableData";

const steps = [
  { id: 1, title: "Pending", description: "Order is pending and waiting to be processed." },
  { id: 2, title: "In Process", description: "Your order is being processed." },
  { id: 3, title: "Completed Process", description: "Specific process for the order has been completed." },
  { id: 4, title: "Delivered", description: "Your order has been delivered." },
  { id: 5, title: "Billing", description: "Billing is being finalized." },
  { id: 6, title: "Completed", description: "Order is completed successfully." },
];

export default function OrderStatus({ orderId, currentStatus, tableData, onStatusChange }) {
  const [currentStep, setCurrentStep] = useState(
    steps.find((s) => s.title === currentStatus)?.id || 1
  );
  const [selectedStep, setSelectedStep] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔹 Processing List
  const [processes, setProcesses] = useState([]);
  const [loadingProcesses, setLoadingProcesses] = useState(false);

  // 🔹 Used rows (lifted state)
  const [usedRowIndexes, setUsedRowIndexes] = useState([]); // ✅ Now maintained here

  useEffect(() => {
    if (steps[currentStep - 1]?.title === "In Process") {
      const fetchProcesses = async () => {
        setLoadingProcesses(true);
        try {
          const res = await fetch("/api/menu/process");
          if (!res.ok) throw new Error("Failed to fetch processes");
          const data = await res.json();
          setProcesses(data); // expects [{name:"Dyeing", selected:true}, ...]
        } catch (err) {
          console.error(err);
          toast.error("Failed to load processes");
        } finally {
          setLoadingProcesses(false);
        }
      };
      fetchProcesses();
    }
  }, [currentStep]);

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

  const toggleProcessSelection = (index) => {
    setProcesses((prev) =>
      prev.map((p, i) => (i === index ? { ...p, selected: !p.selected } : p))
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6 text-gray-800">Status</h2>

      <Stepper steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />

      <StatusDescription steps={steps} currentStep={currentStep} />

      {steps[currentStep - 1]?.title === "In Process" && (
        <>
          <OrderTableData
            orderId={orderId}
            tableData={tableData}
            currentStep={currentStep}
            usedRowIndexes={usedRowIndexes}
            setUsedRowIndexes={setUsedRowIndexes}
          />

          {/* Processing List Table */}
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-md font-semibold mb-3">Current Processing List:</h3>

            {loadingProcesses ? (
              <p className="text-gray-500">Loading processes...</p>
            ) : processes?.length > 0 ? (
              <>
                <ul className="space-y-2">
                  {processes.map((process, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                      onClick={() => toggleProcessSelection(idx)}
                    >
                      <span>{process?.name}</span>
                      {process?.selected ? (
                        <span className="text-green-600 font-semibold">✅ Selected</span>
                      ) : (
                        <span className="text-red-500">⭕ Unselected</span>
                      )}
                    </li>
                  ))}
                </ul>

                {processes?.some((p) => p.selected) && (
                  <div className="mt-4 bg-white text-sm border-t p-1 text-gray-700 font-semibold">
                    Total Price:{" "}
                    <span className="text-blue-600">
                      {processes
                        ?.filter((p) => p.selected)
                        .reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0)
                        .toFixed(2)}{" "}
                      ৳
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500">No processes available.</p>
            )}

            <p className="text-xs text-gray-400 mt-2">
              Note: Processing list is required.
            </p>
          </div>
        </>
      )}

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
