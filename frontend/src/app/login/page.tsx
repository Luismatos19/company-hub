"use client";

import { Suspense } from "react";
import { useAuthForm } from "@/hooks/use-auth-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Zap } from "lucide-react";

function LoginContent() {
  const { isSignup, form, formState, onSubmit, switchMode } = useAuthForm();

  const { register, handleSubmit } = form;
  const { errors, isSubmitting } = formState;

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isSignup && (
              <FormField
                label="Nome"
                type="text"
                placeholder="Seu nome"
                {...register("name" as any)}
                error={(errors as any).name?.message}
              />
            )}

            <FormField
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              error={errors?.email?.message}
            />

            <FormField
              label="Senha"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors?.password?.message}
            />

            {errors?.root?.message && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {errors.root.message}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Carregando..."
                : isSignup
                ? "Criar conta"
                : "Entrar"}
            </Button>

            <div className="text-center text-sm">
              <p>
                {isSignup ? "Já tem uma conta?" : "Ainda não tem conta?"}{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-primary hover:underline"
                >
                  {isSignup ? "Fazer login" : "Criar conta"}
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <LoginContent />
    </Suspense>
  );
}
