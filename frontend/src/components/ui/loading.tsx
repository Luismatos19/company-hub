interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Carregando..." }: LoadingProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">{message}</div>
  );
}

