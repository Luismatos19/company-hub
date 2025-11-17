"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { invitesApi, type Invite, ApiError } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { acceptInviteSchema, type AcceptInviteFormData } from "@/lib/schemas";
import {
  Zap,
  CheckCircle2,
  Building2,
  Calendar,
  Mail,
  Loader2,
} from "lucide-react";

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { setActiveCompany } = useAuthStore();

  const [success, setSuccess] = useState(false);
  const [invite, setInvite] = useState<Invite | null>(null);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    setValue,
  } = useForm<AcceptInviteFormData>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      token: token || "",
    },
  });

  useEffect(() => {
    if (token) {
      setValue("token", token);
      loadInvite(token);
    }
  }, [token, setValue]);

  const loadInvite = async (inviteToken: string) => {
    setLoadingInvite(true);
    setInviteError(null);
    try {
      const inviteData = await invitesApi.getByToken(inviteToken);
      setInvite(inviteData);
      setValue("token", inviteToken);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setInviteError(err.message);
      } else {
        setInviteError("Erro ao carregar informações do convite");
      }
    } finally {
      setLoadingInvite(false);
    }
  };

  const handleTokenSubmit = async (data: AcceptInviteFormData) => {
    await loadInvite(data.token);
  };

  const onSubmit = async (data: AcceptInviteFormData) => {
    try {
      const result = await invitesApi.accept(data.token);
      setActiveCompany(result.company);
      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setFormError("root", { message: err.message });
      } else {
        setFormError("root", { message: "Erro ao aceitar convite" });
      }
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="size-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              Convite Aceito!
            </CardTitle>
            <CardDescription className="text-center">
              Você foi adicionado à empresa {invite?.company?.name || ""} com
              sucesso. Redirecionando...
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

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
            Aceitar Convite
          </CardTitle>
          <CardDescription className="text-center">
            {token
              ? "Confira as informações do convite abaixo"
              : "Digite o token do convite para ver as informações"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(handleTokenSubmit)}
            className="space-y-4"
          >
            <FormField
              label="Token do Convite"
              type="text"
              placeholder="Cole o token aqui"
              required
              {...register("token")}
              error={errors.token?.message}
            />

            {!invite && !loadingInvite && (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Verificando..." : "Verificar Convite"}
              </Button>
            )}

            {inviteError && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {inviteError}
              </div>
            )}
          </form>

          {loadingInvite && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Carregando informações do convite...
              </span>
            </div>
          )}

          {invite && !loadingInvite && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <Building2 className="size-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Empresa
                    </p>
                    <p className="text-base font-semibold">
                      {invite.company?.name || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="size-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Email do convite
                    </p>
                    <p className="text-base">{invite.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="size-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Expira em
                    </p>
                    <p className="text-base">
                      {invite.expiresAt
                        ? new Date(invite.expiresAt).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errors.root && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    {errors.root.message}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processando..." : "Aceitar Convite"}
                </Button>
              </form>
            </div>
          )}

          <div className="text-center text-sm mt-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-muted-foreground hover:underline"
            >
              Voltar para a home
            </button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default function AcceptInvitePage() {
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
      <AcceptInviteContent />
    </Suspense>
  );
}
