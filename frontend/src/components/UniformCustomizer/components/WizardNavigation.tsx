import { ChevronLeft, ChevronRight } from "lucide-react";

interface WizardNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
}

/**
 * Na última etapa não exibimos "Próximo": o próprio CartSummary já traz
 * o botão "Adicionar ao Carrinho" como call-to-action final, então um
 * segundo botão de avanço seria redundante.
 */
export function WizardNavigation({
  isFirstStep,
  isLastStep,
  onBack,
  onNext,
}: WizardNavigationProps) {
  if (isFirstStep && isLastStep) return null;

  return (
    <div className="flex gap-3">
      {!isFirstStep && (
        <button
          onClick={onBack}
          className="flex-1 btn-secondary flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar
        </button>
      )}
      {!isLastStep && (
        <button
          onClick={onNext}
          className="flex-1 btn-primary btn-primary-lg flex items-center justify-center gap-2"
        >
          Próximo
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
