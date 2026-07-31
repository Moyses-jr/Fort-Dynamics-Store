import { Loader2 } from "lucide-react";

interface AuthSubmitButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export function AuthSubmitButton({
  isLoading,
  children,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 bg-[#F5C542] text-black py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#E0A81F] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
