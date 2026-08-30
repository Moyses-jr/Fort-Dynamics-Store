import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { mockupTemplates, wizardSteps } from "./data";
import { createDefaultViewCustomization, formatPrice } from "./utils";
import { ViewToggle } from "./components/ViewToggle";
import { MockupPreview } from "./components/MockupPreview";
import { ImageControls } from "./components/ImageControls";
import { MockupSelector } from "./components/MockupSelector";
import { ArtUpload } from "./components/ArtUpload";
import { ColorPicker } from "./components/ColorPicker";
import { SizeAndQuantitySelector } from "./components/SizeAndQuantitySelector";
import { CartSummary } from "./components/CartSummary";
import { InfoHighlights } from "./components/InfoHighlights";
import { WizardStepIndicator } from "./components/WizardStepIndicator";
import { WizardNavigation } from "./components/WizardNavigation";
import type {
  MockupTemplate,
  UniformCustomization,
  ViewCustomization,
  ViewSide,
} from "./types";

interface UniformCustomizerProps {
  onAddToCart?: (customization: UniformCustomization) => void;
}

export function UniformCustomizer({ onAddToCart }: UniformCustomizerProps) {
  const [selectedMockup, setSelectedMockup] = useState<MockupTemplate>(
    mockupTemplates[0],
  );
  const [currentView, setCurrentView] = useState<ViewSide>("frente");

  const [customizations, setCustomizations] = useState<
    Record<ViewSide, ViewCustomization>
  >({
    frente: createDefaultViewCustomization(),
    verso: createDefaultViewCustomization(),
  });

  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const [currentStep, setCurrentStep] = useState(0);

  // Mede a altura do card de Preview para o wizard acompanhá-la.
  // Só se aplica em telas grandes (lg), onde as colunas ficam lado a
  // lado — no mobile elas empilham e cada uma usa sua altura natural.
  const previewColumnRef = useRef<HTMLDivElement>(null);
  const [previewHeight, setPreviewHeight] = useState<number>();
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateIsDesktopLayout = () => setIsDesktopLayout(mediaQuery.matches);
    updateIsDesktopLayout();
    mediaQuery.addEventListener("change", updateIsDesktopLayout);
    return () =>
      mediaQuery.removeEventListener("change", updateIsDesktopLayout);
  }, []);

  useEffect(() => {
    const element = previewColumnRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      setPreviewHeight(entries[0].contentRect.height);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const current = customizations[currentView];
  const currentMockupImage =
    currentView === "frente"
      ? selectedMockup.imageFront
      : selectedMockup.imageBack;

  const updateView = (view: ViewSide, patch: Partial<ViewCustomization>) => {
    setCustomizations((prev) => ({
      ...prev,
      [view]: { ...prev[view], ...patch },
    }));
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    view: ViewSide,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateView(view, { image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    const customization: UniformCustomization = {
      mockup: selectedMockup,
      uploadedDesignFront: customizations.frente.image,
      uploadedDesignBack: customizations.verso.image,
      color: selectedColor,
      size: selectedSize,
      quantity,
      scaleFront: customizations.frente.scale,
      scaleBack: customizations.verso.scale,
      rotationFront: customizations.frente.rotation,
      rotationBack: customizations.verso.rotation,
      totalPrice: selectedMockup.price * quantity,
    };

    if (onAddToCart) {
      onAddToCart(customization);
    } else {
      alert(
        `Uniforme personalizado adicionado ao carrinho!\n\nPreço total: ${formatPrice(
          selectedMockup.price * quantity,
        )}`,
      );
    }
  };

  const handleDownloadMockup = () => {
    alert("Em produção, aqui você poderia baixar o mockup em alta resolução!");
  };

  const goToNextStep = () => {
    setCurrentStep((step) => Math.min(step + 1, wizardSteps.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  // Cada página do wizard reaproveita, sem alterações, os componentes
  // já existentes na configuração da personalização.
  const wizardStepContent = [
    <>
      <MockupSelector
        mockups={mockupTemplates}
        selectedMockupId={selectedMockup.id}
        onSelect={setSelectedMockup}
      />
      <ArtUpload onUpload={handleFileUpload} />
    </>,
    <>
      <ColorPicker selectedColor={selectedColor} onSelect={setSelectedColor} />
      <SizeAndQuantitySelector
        selectedSize={selectedSize}
        quantity={quantity}
        onSizeChange={setSelectedSize}
        onQuantityChange={setQuantity}
      />
      <CartSummary
        unitPrice={selectedMockup.price}
        quantity={quantity}
        totalPrice={selectedMockup.price * quantity}
        canAddToCart={Boolean(customizations.frente.image)}
        onAddToCart={handleAddToCart}
      />
    </>,
  ];

  return (
    <div className="min-h-screen bg-fd-black py-16">
      <div className="container-fd">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-fd-white mb-4">
            UNIFORMES <span className="text-gold-gradient">PERSONALIZADOS</span>
          </h2>
          <p className="text-xl text-fd-white/80 max-w-3xl mx-auto">
            Faça upload da sua arte e visualize em tempo real no mockup do
            produto. Perfeito para uniformes corporativos, equipes e eventos.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview Area */}
          <div ref={previewColumnRef} className="space-y-6">
            <div className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-fd-white mb-4">
                Preview do Uniforme
              </h3>

              {/* Toggle Frente/Verso */}
              <ViewToggle
                currentView={currentView}
                customizations={customizations}
                onSelect={setCurrentView}
              />

              {/* Mockup Preview */}
              <MockupPreview
                backgroundColor={selectedColor}
                mockupImage={currentMockupImage}
                mockupName={selectedMockup.name}
                customization={current}
              />

              {/* Controles da imagem */}
              {current.image && (
                <ImageControls
                  customization={current}
                  onScaleChange={(value) =>
                    updateView(currentView, { scale: value })
                  }
                  onRotationChange={(value) =>
                    updateView(currentView, { rotation: value })
                  }
                  onRemove={() => updateView(currentView, { image: undefined })}
                />
              )}
            </div>

            <button
              onClick={handleDownloadMockup}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Baixar Mockup em Alta Resolução
            </button>
          </div>

          {/* Configuration Panel: etapas do wizard */}
          <div
            className="flex flex-col space-y-6 lg:h-full"
            style={
              isDesktopLayout && previewHeight
                ? { height: previewHeight }
                : undefined
            }
          >
            {wizardStepContent[currentStep]}

            <WizardNavigation
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === wizardSteps.length - 1}
              onBack={goToPreviousStep}
              onNext={goToNextStep}
            />

            <WizardStepIndicator
              steps={wizardSteps}
              currentStep={currentStep}
            />
          </div>
        </div>

        {/* Informações Adicionais */}
        <InfoHighlights />
      </div>
    </div>
  );
}
