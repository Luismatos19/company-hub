"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Zap } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignup = searchParams.get("signup") === "true";
  const { isAuthenticated, login, signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignup) {
        await signup(email, password, name || undefined);
      } else {
        await login(email, password);
      }
    } catch (err: unknown) {
      const errorWithMessage = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        errorWithMessage.response?.data?.message ||
          (isSignup ? "Erro ao criar conta" : "Erro ao fazer login")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Zap className="size-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {isSignup ? "Criar Conta" : "Entrar"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignup
              ? "Preencha os dados para criar sua conta"
              : "Digite suas credenciais para acessar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nome (opcional)
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Carregando..."
                : isSignup
                ? "Criar Conta"
                : "Entrar"}
            </Button>

            <div className="text-center text-sm">
              {isSignup ? (
                <p>
                  Já tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="text-primary hover:underline"
                  >
                    Fazer login
                  </button>
                </p>
              ) : (
                <p>
                  Não tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/login?signup=true")}
                    className="text-primary hover:underline"
                  >
                    Criar conta
                  </button>
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="text-lg text-muted-foreground">Carregando...</div>
          </div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
