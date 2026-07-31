import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes condicionalmente (clsx) e resolve conflitos do Tailwind
 * (tailwind-merge). Se você já tem um `cn` em outro lugar do projeto
 * (comum em setups com shadcn/ui), pode ignorar este arquivo e ajustar
 * os imports dos componentes abaixo para apontar para o seu.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
