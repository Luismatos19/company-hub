"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { CreateCompanyDialog } from "@/components/create-company-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import {
  membershipsApi,
  invitesApi,
  companiesApi,
  type Membership,
} from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Mail } from "lucide-react";

type RoleBadgeVariant = "default" | "secondary" | "destructive";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showNewCompany = searchParams.get("new") === "true";
  const { user, activeCompany, companies, setActiveCompany, setUser } =
    useAuthStore();
  const { logout } = useAuth();

  const [members, setMembers] = useState<Membership[]>([]);
  const [email, setEmail] = useState("");
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateCompany, setShowCreateCompany] = useState(showNewCompany);
  const [isSwitchingCompany, setIsSwitchingCompany] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const loadMembers = async () => {
    if (!activeCompany?.id) return;

    setIsLoadingMembers(true);
    try {
      const response = await membershipsApi.getAll();
      setMembers(Array.isArray(response) ? response : []);
    } catch (err: unknown) {
      console.error("Erro ao carregar membros:", err);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (activeCompany?.id) {
      loadMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCompany?.id]);

  const handleSelectCompany = async (companyId: string) => {
    if (!user || companyId === activeCompany?.id) return;

    setIsSwitchingCompany(true);
    setError("");
    setSuccess("");

    try {
      // Atualiza empresa ativa no backend (activeCompanyId do usuário)
      const updatedUser = await companiesApi.select(companyId);
      setUser(updatedUser);

      // Atualiza empresa ativa no estado global
      const company = companies.find((c) => c.id === companyId);
      if (company) {
        setActiveCompany(company);
      }

      // Recarrega membros da nova empresa ativa
      await loadMembers();
    } catch (err) {
      console.error("Erro ao selecionar empresa:", err);
      setError("Erro ao selecionar empresa");
    } finally {
      setIsSwitchingCompany(false);
    }
  };

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeCompany?.id) return;

    setError("");
    setSuccess("");
    setIsInviting(true);

    try {
      await invitesApi.create(activeCompany.id, email);
      setSuccess("Convite enviado com sucesso!");
      setEmail("");
    } catch (err: unknown) {
      const errorWithMessage = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        errorWithMessage.response?.data?.message || "Erro ao enviar convite"
      );
    } finally {
      setIsInviting(false);
    }
  };

  const getRoleBadgeVariant = (role: string): RoleBadgeVariant => {
    switch (role) {
      case "OWNER":
        return "destructive";
      case "ADMIN":
        return "secondary";
      case "MEMBER":
      default:
        return "default";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "OWNER":
        return "bg-red-500";
      case "ADMIN":
        return "bg-yellow-500";
      case "MEMBER":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!user) {
    return null;
  }

  if (!activeCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Nenhuma empresa selecionada</CardTitle>
            <CardDescription>
              Selecione uma empresa abaixo ou crie uma nova
            </CardDescription>
          </CardHeader>
          <CardContent>
            {companies.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Você ainda não faz parte de nenhuma empresa.
              </p>
            ) : (
              <div className="space-y-2">
                {companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => handleSelectCompany(company.id)}
                    className="w-full rounded-lg border px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                  >
                    {company.name}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <CreateCompanyDialog
        open={showCreateCompany}
        onClose={() => setShowCreateCompany(false)}
      />

      <main className="flex-1 overflow-y-auto bg-background">
        <div className="p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          {/* Companies Section */}
          <Card className="mb-6 border-purple-200 dark:border-purple-900">
            <CardHeader>
              <CardTitle>Minhas Empresas</CardTitle>
              <CardDescription>
                Clique em uma empresa para ver e gerenciar seus membros
              </CardDescription>
            </CardHeader>
            <CardContent>
              {companies.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Você ainda não faz parte de nenhuma empresa.
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {companies.map((company) => {
                    const isActive = company.id === activeCompany.id;
                    return (
                      <button
                        key={company.id}
                        onClick={() => handleSelectCompany(company.id)}
                        disabled={isSwitchingCompany}
                        className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "border-purple-500 bg-purple-50 text-purple-900 dark:bg-purple-900/20 dark:text-purple-100"
                            : "border-border hover:bg-accent text-foreground"
                        }`}
                      >
                        {company.name}
                        {isActive && (
                          <span className="ml-2 text-[11px] uppercase tracking-wide text-purple-600 dark:text-purple-300">
                            Ativa
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Members Section */}
          <Card className="mb-6 border-blue-200 dark:border-blue-900">
            <CardHeader>
              <CardTitle>Members of {activeCompany.name}</CardTitle>
              <CardDescription>Role | Email</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMembers ? (
                <div className="text-center py-8 text-muted-foreground">
                  Carregando membros...
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum membro encontrado
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((membership) => (
                    <div
                      key={membership.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded-full ${getRoleColor(
                            membership.role
                          )} flex items-center justify-center text-white font-semibold text-sm`}
                        >
                          {membership.user?.email?.[0].toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {membership.user?.email || "Email não disponível"}
                            </span>
                            {membership.user?.id === user.id && (
                              <span className="text-xs text-muted-foreground">
                                (You)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant={getRoleBadgeVariant(membership.role)}>
                        {membership.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invite Section */}
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
              <CardTitle>Invite New Member</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-md">
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={isInviting}
                >
                  <Mail className="size-4 mr-2" />
                  {isInviting ? "Enviando..." : "Send Invite"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen overflow-hidden">
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center">
              <div className="text-lg text-muted-foreground">Carregando...</div>
            </div>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
