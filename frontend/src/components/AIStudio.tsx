import { useState } from "react";
import { Wand2, Loader2, Download, Share2 } from "lucide-react";
import type { AICharacter, Stamp } from "../types";
import {
  generateStampWithAI,
  generateCharacterWithAI,
} from "../utils/aiEngine";

type AIStudioProps = {
  onStampCreated: (stamp: Stamp) => void;
  onCharacterCreated: (character: AICharacter) => void;
};

export function AIStudio({
  onStampCreated,
  onCharacterCreated,
}: AIStudioProps) {
  const [activeTab, setActiveTab] = useState<"stamp" | "character">("stamp");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItem, setGeneratedItem] = useState<
    Stamp | AICharacter | null
  >(null);

  // Stamp fields
  const [stampPrompt, setStampPrompt] = useState("");

  // Character fields
  const [characterStyle, setCharacterStyle] =
    useState<AICharacter["style"]>("urban");
  const [characterDescription, setCharacterDescription] = useState("");

  const handleGenerateStamp = async () => {
    if (!stampPrompt.trim()) return;

    setIsGenerating(true);
    setGeneratedItem(null);
    try {
      const newStamp = await generateStampWithAI(stampPrompt);
      setGeneratedItem(newStamp);
      onStampCreated(newStamp);
    } catch (error) {
      console.error("Erro ao gerar estampa:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCharacter = async () => {
    if (!characterDescription.trim()) return;

    setIsGenerating(true);
    setGeneratedItem(null);
    try {
      const newCharacter = await generateCharacterWithAI(
        characterStyle,
        characterDescription,
      );
      setGeneratedItem(newCharacter);
      onCharacterCreated(newCharacter);
    } catch (error) {
      console.error("Erro ao gerar personagem:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="ai-studio" className="py-20 bg-fd-black">
      <div className="container-fd">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-fd-gold/10 border border-fd-gold/30 rounded-full mb-6">
            <Wand2 className="w-4 h-4 text-fd-gold" />
            <span className="text-fd-gold text-sm tracking-widest uppercase">
              IA Studio
            </span>
          </div>
          <h2 className="text-fd-white mb-4">
            Criação com Inteligência Artificial
          </h2>
          <p className="text-fd-white/60 max-w-2xl mx-auto">
            Use o poder da IA para criar estampas e personagens exclusivos para
            suas peças.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-fd-gray-lighter">
            <button
              onClick={() => setActiveTab("stamp")}
              className={`px-6 py-4 font-display text-lg uppercase tracking-wider transition-all ${
                activeTab === "stamp"
                  ? "text-fd-gold border-b-2 border-fd-gold"
                  : "text-fd-white/60 hover:text-fd-white"
              }`}
            >
              Gerador de Estampas
            </button>
            <button
              onClick={() => setActiveTab("character")}
              className={`px-6 py-4 font-display text-lg uppercase tracking-wider transition-all ${
                activeTab === "character"
                  ? "text-fd-gold border-b-2 border-fd-gold"
                  : "text-fd-white/60 hover:text-fd-white"
              }`}
            >
              Gerador de Personagens
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Area */}
            <div className="space-y-6">
              {activeTab === "stamp" ? (
                <>
                  <div>
                    <label className="block text-sm uppercase tracking-wider text-fd-white/80 mb-3">
                      Descreva a estampa
                    </label>
                    <textarea
                      value={stampPrompt}
                      onChange={(e) => setStampPrompt(e.target.value)}
                      placeholder="Ex: Leão dourado com coroa, estilo minimalista, traços geométricos..."
                      className="w-full bg-fd-gray border border-fd-gray-lighter rounded px-4 py-3 text-fd-white placeholder:text-fd-white/40 focus:outline-none focus:border-fd-gold min-h-[200px]"
                    />
                  </div>

                  <div className="bg-fd-gray/50 border border-fd-gray-lighter rounded-lg p-4">
                    <h4 className="text-fd-gold text-sm uppercase tracking-wider mb-3">
                      Dicas para melhores resultados:
                    </h4>
                    <ul className="text-sm text-fd-white/60 space-y-2">
                      <li>
                        • Seja específico sobre o estilo (minimalista, street,
                        futurista)
                      </li>
                      <li>
                        • Inclua cores principais (dourado, preto, branco)
                      </li>
                      <li>
                        • Mencione elementos visuais (geométrico, orgânico,
                        abstrato)
                      </li>
                      <li>
                        • Defina o mood (autoritário, elegante, agressivo)
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleGenerateStamp}
                    disabled={isGenerating || !stampPrompt.trim()}
                    className="w-full btn-primary btn-primary-lg py-4"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="inline-block w-5 h-5 mr-2 animate-spin" />
                        Gerando Estampa...
                      </>
                    ) : (
                      <>
                        <Wand2 className="inline-block w-5 h-5 mr-2" />
                        Gerar Estampa com IA
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm uppercase tracking-wider text-fd-white/80 mb-3">
                      Estilo do Personagem
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          "urban",
                          "futuristic",
                          "classic",
                          "dynamic",
                          "premium",
                        ] as const
                      ).map((style) => (
                        <button
                          key={style}
                          onClick={() => setCharacterStyle(style)}
                          className={`px-4 py-3 border-2 uppercase text-sm tracking-wider transition-all ${
                            characterStyle === style
                              ? "border-fd-gold bg-fd-gold text-fd-black"
                              : "border-fd-gray-lighter text-fd-white hover:border-fd-gold"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wider text-fd-white/80 mb-3">
                      Descrição do Personagem
                    </label>
                    <textarea
                      value={characterDescription}
                      onChange={(e) => setCharacterDescription(e.target.value)}
                      placeholder="Ex: Guerreiro urbano com jaqueta de couro, óculos futuristas, postura autoritária..."
                      className="w-full bg-fd-gray border border-fd-gray-lighter rounded px-4 py-3 text-fd-white placeholder:text-fd-white/40 focus:outline-none focus:border-fd-gold min-h-[150px]"
                    />
                  </div>

                  <button
                    onClick={handleGenerateCharacter}
                    disabled={isGenerating || !characterDescription.trim()}
                    className="w-full btn-primary btn-primary-lg py-4"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="inline-block w-5 h-5 mr-2 animate-spin" />
                        Gerando Personagem...
                      </>
                    ) : (
                      <>
                        <Wand2 className="inline-block w-5 h-5 mr-2" />
                        Gerar Personagem com IA
                      </>
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Preview Area */}
            <div className="bg-fd-gray rounded-lg p-8 flex items-center justify-center min-h-[400px]">
              {isGenerating ? (
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-fd-gold animate-spin mx-auto mb-4" />
                  <p className="text-fd-white/60">Criando com IA...</p>
                  <p className="text-fd-white/40 text-sm mt-2">
                    Isso pode levar alguns segundos
                  </p>
                </div>
              ) : generatedItem ? (
                <div className="w-full">
                  <div className="aspect-square bg-fd-black rounded-lg overflow-hidden mb-4">
                    <img
                      src={generatedItem.imageUrl}
                      alt={generatedItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-fd-white text-xl font-display mb-2">
                    {generatedItem.name}
                  </h3>

                  {"style" in generatedItem ? (
                    <p className="text-fd-gold text-sm mb-4">
                      Estilo: {generatedItem.style}
                    </p>
                  ) : (
                    <p className="text-fd-gold text-sm mb-4">
                      Categoria: {generatedItem.category}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button className="flex-1 btn-secondary py-3 text-sm">
                      <Download className="inline-block w-4 h-4 mr-2" />
                      Baixar
                    </button>
                    <button className="flex-1 btn-secondary py-3 text-sm">
                      <Share2 className="inline-block w-4 h-4 mr-2" />
                      Compartilhar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Wand2 className="w-16 h-16 text-fd-gold/20 mx-auto mb-4" />
                  <p className="text-fd-white/40">Sua criação aparecerá aqui</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
