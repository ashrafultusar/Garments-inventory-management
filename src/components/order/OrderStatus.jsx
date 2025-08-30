"use client";
import { useState } from "react";

const steps = [
  { id: 1, title: "Pending", description: "Order is pending and waiting to be processed." },
  { id: 2, title: "In Process", description: "Your order is being processed." },
  { id: 3, title: "Delivered", description: "Your order has been delivered." },
  { id: 4, title: "Billing", description: "Billing is being finalized." },
  { id: 5, title: "Completed", description: "Order is completed successfully." },
];

export default function OrderStatus() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-lg font-semibold mb-6 text-gray-800">Status</h2>

      {/* Steps Container */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 z-0 mx-[40px]">
          <div
            className="h-0.5 bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {/* Steps */}
        <div className="flex justify-between relative z-10">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center cursor-pointer"
              onClick={() => setCurrentStep(step.id)}
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
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Step Description */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-gray-700 text-center shadow-sm">
        {steps.find((step) => step.id === currentStep)?.description}
      </div>
    </div>
  );
}
