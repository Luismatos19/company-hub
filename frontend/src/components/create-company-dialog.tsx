"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { companiesApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

interface CreateCompanyDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCompanyDialog({
  open,
  onClose,
}: CreateCompanyDialogProps) {
  const router = useRouter();
  const { setActiveCompany, setCompanies, companies } = useAuthStore();
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const newCompany = await companiesApi.create(name, logo || undefined);

      // Atualizar lista de empresas
      setCompanies([...companies, newCompany]);

      // Selecionar a nova empresa
      await companiesApi.select(newCompany.id);
      setActiveCompany(newCompany);

      // Fechar diálogo e redirecionar
      onClose();
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorWithMessage = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        errorWithMessage.response?.data?.message ||
          "Erro ao criar empresa",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar Nova Empresa</CardTitle>
          <CardDescription>
            Preencha os dados para criar uma nova empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome da Empresa *
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Nome da empresa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="logo" className="text-sm font-medium">
                URL do Logo (opcional)
              </label>
              <Input
                id="logo"
                type="url"
                placeholder="https://example.com/logo.png"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
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
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
