"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import {
  loginSchema,
  signupSchema,
  SignupFormData,
  LoginFormData,
} from "@/lib/schemas";

export function useAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isSignup = searchParams.get("signup") === "true";
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const { isAuthenticated, login, signup } = useAuth();

  const schema = isSignup ? signupSchema : loginSchema;

  const form = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(schema),
  });

  const { setError, clearErrors, formState } = form;

  useEffect(() => {
    if (isAuthenticated && !formState.isSubmitting) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, formState.isSubmitting, router, redirectTo]);

  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    clearErrors("root");

    try {
      if (isSignup) {
        const payload = data as SignupFormData;
        await signup(payload.email, payload.password, payload.name);
      } else {
        const payload = data as LoginFormData;
        await login(payload.email, payload.password);
      }
    } catch (error) {
      let errorMessage = isSignup
        ? "Erro ao criar conta."
        : "Erro ao fazer login.";

      if (error instanceof ApiError) {
        errorMessage = error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }

      setError(
        "root",
        {
          type: "manual",
          message: errorMessage,
        },
        { shouldFocus: false }
      );
    }
  };

  return {
    isSignup,
    onSubmit,
    form,
    formState,
    switchMode: () => {
      router.push(isSignup ? "/login" : "/login?signup=true");
    },
  };
}
