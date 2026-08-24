interface WizardStepIndicatorProps {
  steps: { title: string }[];
  currentStep: number;
}

export function WizardStepIndicator({
  steps,
  currentStep,
}: WizardStepIndicatorProps) {
  return (
    <div className="flex items-center">
      {steps.map((_, index) => (
        <div
          key={index}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            index <= currentStep ? "bg-fd-gold" : "bg-fd-gold/20"
          }`}
        />
      ))}
    </div>
  );
}
