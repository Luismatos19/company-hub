"use client";

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
import { invitesApi } from "@/lib/api";
import { inviteMemberSchema, type InviteMemberFormData } from "@/lib/schemas";
import { ApiError } from "@/lib/api";

interface InviteMemberDialogProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess: () => void;
}

export function InviteMemberDialog({
  open,
  onClose,
  companyId,
  onSuccess,
}: InviteMemberDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    reset,
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      expiresAt: "",
    },
  });

  if (!open) return null;

  const onSubmit = async (data: InviteMemberFormData) => {
    try {
      await invitesApi.create(companyId, data.email, data.expiresAt);
      reset();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setFormError("root", { message: err.message });
      } else {
        setFormError("root", { message: "Erro ao enviar convite" });
      }
    }
  };

  const minDate = new Date().toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Convidar Membro</CardTitle>
          <CardDescription>
            Envie um convite para adicionar um novo membro à empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              label="Email"
              type="email"
              placeholder="email@example.com"
              required
              {...register("email")}
              error={errors.email?.message}
            />

            <FormField
              label="Data de Expiração"
              type="datetime-local"
              required
              min={minDate}
              {...register("expiresAt")}
              error={errors.expiresAt?.message}
            />

            {errors.root && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {errors.root.message}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Convite"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
