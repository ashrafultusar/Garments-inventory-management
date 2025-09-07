export default function StatusDescription({ steps, currentStep }) {
    return (
      <div className="mt-8 p-4 bg-green-100 rounded-lg text-gray-700 text-center shadow-sm">
        {steps.find((step) => step.id === currentStep)?.description}
      </div>
    );
  }
  