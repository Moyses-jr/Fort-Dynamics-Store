import type { ViewCustomization } from "./types";

export function createDefaultViewCustomization(): ViewCustomization {
  return { image: undefined, scale: 100, rotation: 0 };
}

export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2)}`;
}
