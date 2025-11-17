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

  const { setError, formState } = form;

  useEffect(() => {
    if (isAuthenticated && !formState.isSubmitting) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, formState.isSubmitting, router, redirectTo]);

  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    try {
      if (isSignup) {
        const payload = data as SignupFormData;
        await signup(payload.email, payload.password, payload.name);
      } else {
        const payload = data as LoginFormData;
        await login(payload.email, payload.password);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setError("root", { message: error.message });
      } else if (error instanceof Error) {
        setError("root", { message: error.message });
      } else {
        setError("root", {
          message: isSignup ? "Erro ao criar conta." : "Erro ao fazer login.",
        });
      }
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
