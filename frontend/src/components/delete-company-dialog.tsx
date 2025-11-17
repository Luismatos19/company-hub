"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { companiesApi } from "@/lib/api";
import type { Company } from "@/types";
import { useRouter } from "next/navigation";

interface DeleteCompanyDialogProps {
  open: boolean;
  onClose: () => void;
  company: Company | null;
}

export function DeleteCompanyDialog({
  open,
  onClose,
  company,
}: DeleteCompanyDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open || !company) return null;

  const handleDelete = async () => {
    setError("");
    setIsLoading(true);

    try {
      await companiesApi.delete(company.id);
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorWithMessage = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        errorWithMessage.response?.data?.message || "Erro ao deletar empresa"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Deletar Empresa</CardTitle>
          <CardDescription>
            Tem certeza que deseja deletar a empresa "{company.name}"? Esta
            ação não pode ser desfeita.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Deletando..." : "Deletar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

