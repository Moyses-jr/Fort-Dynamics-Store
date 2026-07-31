import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../../lib/utils";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Input de senha com botão de mostrar/ocultar embutido.
 * Antes esse estado (showPassword / showCheckPassword) vivia duplicado
 * dentro do AuthModal; agora cada instância cuida do próprio estado.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className, ...inputProps }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div>
        <label className="text-[10px] uppercase tracking-widest text-[#D4B896] block mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={visible ? "text" : "password"}
            aria-invalid={Boolean(error)}
            className={cn(
              "w-full bg-white/5 border border-white/20 text-white px-4 py-3 pr-12 focus:border-[#F5C542] focus:outline-none transition-colors",
              error && "border-red-500/50",
              className,
            )}
            {...inputProps}
          />
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            tabIndex={-1}
            aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
          >
            {visible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
