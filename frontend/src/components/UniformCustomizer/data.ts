import type { MockupTemplate, ViewSide } from "./types";

export const mockupTemplates: MockupTemplate[] = [
  {
    id: "mockup-001",
    name: "Camiseta Básica Lisa",
    type: "camiseta",
    imageFront:
      "https://images.unsplash.com/photo-1655141559812-42f8c1e8942d?w=800",
    imageBack:
      "https://images.unsplash.com/photo-1655141559812-42f8c1e8942d?w=800&flip=h",
    price: 89.9,
  },
  {
    id: "mockup-002",
    name: "Moletom Liso",
    type: "moletom",
    imageFront:
      "https://images.unsplash.com/photo-1759972524936-26c44fb258ca?w=800",
    imageBack:
      "https://images.unsplash.com/photo-1759972524936-26c44fb258ca?w=800&flip=h",
    price: 179.9,
  },
  {
    id: "mockup-003",
    name: "Polo Lisa",
    type: "polo",
    imageFront:
      "https://images.unsplash.com/photo-1655141559812-42f8c1e8942d?w=800",
    imageBack:
      "https://images.unsplash.com/photo-1655141559812-42f8c1e8942d?w=800&flip=h",
    price: 129.9,
  },
];

export const colors = [
  { name: "Preto", hex: "#000000" },
  { name: "Branco", hex: "#ffffff" },
  { name: "Cinza", hex: "#808080" },
  { name: "Azul Marinho", hex: "#001f3f" },
  { name: "Verde Musgo", hex: "#4a5d23" },
];

export const sizes = ["PP", "P", "M", "G", "GG", "XG", "XXG"];

export const viewOptions: { value: ViewSide; label: string }[] = [
  { value: "frente", label: "FRENTE" },
  { value: "verso", label: "VERSO" },
];

export const uploadTargets: { view: ViewSide; label: string }[] = [
  { view: "frente", label: "Frente" },
  { view: "verso", label: "Verso" },
];

export const wizardSteps = [
  { title: "Escolha o Modelo" },
  { title: "Upload da Arte" },
  { title: "Cor do Tecido" },
  { title: "Tamanho e Quantidade" },
  { title: "Adicionar ao Carrinho" },
];

export const infoHighlights = [
  {
    title: "Produção Profissional",
    description: "Impressão em alta qualidade com durabilidade garantida",
  },
  {
    title: "Pedidos em Quantidade",
    description: "Descontos progressivos para pedidos acima de 10 unidades",
  },
  {
    title: "Aprovação de Arte",
    description: "Nossa equipe revisa e ajusta sua arte antes da produção",
  },
];
