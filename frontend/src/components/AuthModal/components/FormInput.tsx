import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Input de texto padrão do formulário de auth.
 * Usa forwardRef para funcionar com `register()` do react-hook-form.
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, ...inputProps }, ref) => {
    return (
      <div>
        <label className="text-[10px] uppercase tracking-widest text-[#D4B896] block mb-2">
          {label}
        </label>
        <input
          ref={ref}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:border-[#F5C542] focus:outline-none transition-colors",
            error && "border-red-500/50",
            className,
          )}
          {...inputProps}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
