interface AuthApiErrorProps {
  message: string | null;
}

export function AuthApiError({ message }: AuthApiErrorProps) {
  if (!message) return null;

  return (
    <div className="text-center bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3">
      {message}
    </div>
  );
}
