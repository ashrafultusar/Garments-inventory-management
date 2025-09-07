export default function Stepper({ steps, currentStep, onStepClick }) {
    return (
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
              onClick={() => onStepClick(step)}
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
    );
  }
  