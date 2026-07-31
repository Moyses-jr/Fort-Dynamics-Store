import { useForm } from "react-hook-form";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthApiError } from "./AuthApiError";
import { RegisterFormValues } from "../types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  isLoading: boolean;
  apiError: string | null;
  onSwitchToLogin: () => void;
}

export function RegisterForm({
  onSubmit,
  isLoading,
  apiError,
  onSwitchToLogin,
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({ mode: "onBlur" });

  // Observa o campo "password" para validar a confirmação em tempo real,
  // substituindo a checagem manual que existia dentro do handleSubmit.
  const password = watch("password");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      <FormInput
        label="Nome completo"
        type="text"
        placeholder="Seu nome"
        error={errors.name?.message}
        {...register("name", { required: "Informe seu nome." })}
      />

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
        placeholder="Mínimo 3 caracteres"
        error={errors.password?.message}
        {...register("password", {
          required: "Informe uma senha.",
          minLength: {
            value: 3,
            message: "A senha deve ter ao menos 3 caracteres.",
          },
        })}
      />

      <PasswordInput
        label="Confirmar senha"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Confirme sua senha.",
          validate: (value) => value === password || "As senhas não coincidem.",
        })}
      />

      <AuthApiError message={apiError} />

      <AuthSubmitButton isLoading={isLoading}>Criar conta</AuthSubmitButton>

      <div className="text-center text-sm text-white/50">
        Já tem conta?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[#F5C542] hover:underline"
        >
          Entrar
        </button>
      </div>
    </form>
  );
}
