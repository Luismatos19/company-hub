"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { membershipsApi } from "@/lib/api";
import { updateMembershipSchema, type UpdateMembershipFormData } from "@/lib/schemas";
import { ApiError } from "@/lib/api";
import type { Membership } from "@/types";

interface EditMemberDialogProps {
  open: boolean;
  onClose: () => void;
  membership: Membership | null;
  onSuccess: () => void;
}

export function EditMemberDialog({
  open,
  onClose,
  membership,
  onSuccess,
}: EditMemberDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    watch,
    setValue,
    reset,
  } = useForm<UpdateMembershipFormData>({
    resolver: zodResolver(updateMembershipSchema),
    defaultValues: {
      role: membership?.role || "MEMBER",
    },
  });

  const role = watch("role");

  useEffect(() => {
    if (membership) {
      reset({ role: membership.role });
    }
  }, [membership, reset]);

  if (!open || !membership) return null;

  const onSubmit = async (data: UpdateMembershipFormData) => {
    try {
      await membershipsApi.update(membership.id, data.role);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setFormError("root", { message: err.message });
      } else {
        setFormError("root", { message: "Erro ao editar membro" });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Editar Membro</CardTitle>
          <CardDescription>
            {membership.user?.email || "Email não disponível"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Função
              </label>
              <Select
                value={role}
                onValueChange={(value) =>
                  setValue("role", value as "OWNER" | "ADMIN" | "MEMBER", {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OWNER">OWNER</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="MEMBER">MEMBER</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.role.message}
                </p>
              )}
            </div>

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
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
