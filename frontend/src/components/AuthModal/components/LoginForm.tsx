import { useForm } from "react-hook-form";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthApiError } from "./AuthApiError";
import type { LoginFormValues } from "../types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isLoading: boolean;
  apiError: string | null;
  onSwitchToRegister: () => void;
}

export function LoginForm({
  onSubmit,
  isLoading,
  apiError,
  onSwitchToRegister,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ mode: "onBlur" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      <FormInput
        label="Email"
        type="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        {...register("email", {
          required: "Informe seu email.",
          pattern: {
            value: EMAIL_PATTERN,
            message: "Informe um email válido.",
          },
        })}
      />

      <PasswordInput
        label="Senha"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password", {
          required: "Informe sua senha.",
        })}
      />

      <AuthApiError message={apiError} />

      <AuthSubmitButton isLoading={isLoading}>Entrar</AuthSubmitButton>

      <div className="text-center text-sm text-white/50">
        Não tem conta?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-[#F5C542] hover:underline"
        >
          Cadastre-se
        </button>
      </div>
    </form>
  );
}
