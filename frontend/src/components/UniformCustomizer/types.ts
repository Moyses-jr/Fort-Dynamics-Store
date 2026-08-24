export type MockupType = "camiseta" | "moletom" | "polo";
export type ViewSide = "frente" | "verso";

export interface MockupTemplate {
  id: string;
  name: string;
  type: MockupType;
  imageFront: string;
  imageBack: string;
  price: number;
}

export interface ViewCustomization {
  image?: string;
  scale: number;
  rotation: number;
}

export interface UniformCustomization {
  mockup: MockupTemplate;
  uploadedDesignFront?: string;
  uploadedDesignBack?: string;
  color: string;
  size: string;
  quantity: number;
  scaleFront: number;
  scaleBack: number;
  rotationFront: number;
  rotationBack: number;
  totalPrice: number;
}
