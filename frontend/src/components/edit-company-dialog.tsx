"use client";

import { useEffect } from "react";
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
import { companiesApi } from "@/lib/api";
import { updateCompanySchema, type UpdateCompanyFormData } from "@/lib/schemas";
import { ApiError } from "@/lib/api";
import type { Company } from "@/types";

interface EditCompanyDialogProps {
  open: boolean;
  onClose: () => void;
  company: Company | null;
  onSuccess: () => void;
}

export function EditCompanyDialog({
  open,
  onClose,
  company,
  onSuccess,
}: EditCompanyDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    reset,
  } = useForm<UpdateCompanyFormData>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      name: company?.name || "",
    },
  });

  useEffect(() => {
    if (company) {
      reset({ name: company.name });
    }
  }, [company, reset]);

  if (!open || !company) return null;

  const onSubmit = async (data: UpdateCompanyFormData) => {
    try {
      await companiesApi.update(company.id, data.name);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setFormError("root", { message: err.message });
      } else {
        setFormError("root", { message: "Erro ao editar empresa" });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Editar Empresa</CardTitle>
          <CardDescription>Altere o nome da empresa</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              label="Nome da Empresa"
              type="text"
              placeholder="Nome da empresa"
              required
              {...register("name")}
              error={errors.name?.message}
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
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
