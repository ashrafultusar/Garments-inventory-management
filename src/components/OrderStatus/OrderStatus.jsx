"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Stepper from "./Stepper";
import StatusDescription from "./StatusDescription";
import StatusModal from "./StatusModal";
import ProcessingModal from "./ProcessingModal";
import OrderTableData from "./OrderTableData";

const steps = [
  { id: 1, title: "Pending", description: "Order is pending." },
  { id: 2, title: "In Process", description: "Your order is being processed." },
  { id: 3, title: "Completed Process", description: "Process completed." },
  { id: 4, title: "Delivered", description: "Order delivered." },
  { id: 5, title: "Billing", description: "Billing finalized." },
  { id: 6, title: "Completed", description: "Order completed." },
];

export default function OrderStatus({ orderId, currentStatus, tableData, onStatusChange, selectedOrder }) {
  const [currentStep, setCurrentStep] = useState(steps.find((s) => s.title === currentStatus)?.id || 1);
  const [selectedStep, setSelectedStep] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [processes, setProcesses] = useState([]);
  const [loadingProcesses, setLoadingProcesses] = useState(false);
  const [usedRowIndexes, setUsedRowIndexes] = useState([]);
  const [createdBatches, setCreatedBatches] = useState([]);

  useEffect(() => {
    if (steps[currentStep - 1]?.title === "In Process") {
      const fetchProcesses = async () => {
        setLoadingProcesses(true);
        try {
          const res = await fetch("/api/menu/process");
          const data = await res.json();
          setProcesses(data);
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
        body: JSON.stringify({ orderId, status: selectedStep.title }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentStep(selectedStep.id);
        setShowModal(false);
        onStatusChange(selectedStep.title);
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const toggleProcessSelection = (index) => {
    setProcesses((prev) => prev.map((p, i) => (i === index ? { ...p, selected: !p.selected } : p)));
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
            sillName={selectedOrder?.sillName}
            processes={processes}
            setProcesses={setProcesses}
            createdBatches={createdBatches}
            setCreatedBatches={setCreatedBatches}
          />

          {/* Processing List */}
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-md font-semibold mb-3">Current Processing List:</h3>
            {loadingProcesses ? (
              <p className="text-gray-500">Loading processes...</p>
            ) : processes?.length > 0 ? (
              <ul className="space-y-2">
                {processes.map((p, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                    onClick={() => toggleProcessSelection(idx)}
                  >
                    <span>{p?.name}</span>
                    {p?.selected ? (
                      <span className="text-green-600 font-semibold">✅ Selected</span>
                    ) : (
                      <span className="text-red-500">⭕ Unselected</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No processes available.</p>
            )}
          </div>
        </>
      )}

      {showModal && selectedStep && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            {selectedStep.title === "Completed Process" ? (
              <ProcessingModal orderId={orderId} confirmChange={confirmChange} onClose={() => setShowModal(false)} />
            ) : (
              <StatusModal selectedStep={selectedStep} confirmChange={confirmChange} onClose={() => setShowModal(false)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
