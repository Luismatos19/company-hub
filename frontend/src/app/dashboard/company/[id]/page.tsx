"use client";

import { useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { EditMemberDialog } from "@/components/edit-member-dialog";
import { InviteMemberDialog } from "@/components/invite-member-dialog";
import { EditCompanyDialog } from "@/components/edit-company-dialog";
import { DeleteCompanyDialog } from "@/components/delete-company-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MemberCard } from "@/components/member/member-card";
import { Loading } from "@/components/ui/loading";
import { useAuthStore } from "@/store/auth-store";
import { useCompanyDetails } from "@/hooks/use-company-details";
import { useAuth } from "@/hooks/use-auth";
import type { Membership } from "@/types";
import { ArrowLeft } from "lucide-react";

function CompanyDetailContent() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  const { user } = useAuthStore();
  const { loadUserCompanies } = useAuth();
  const [editingMember, setEditingMember] = useState<Membership | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEditCompanyDialog, setShowEditCompanyDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { company, members, isLoading, error, refetch } = useCompanyDetails(
    companyId,
    !!user
  );

  const handleRefresh = async () => {
    await refetch();
    await loadUserCompanies();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center bg-background">
          <Loading message="Carregando..." />
        </main>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {error ? "Erro ao carregar empresa" : "Empresa não encontrada"}
              </CardTitle>
              <CardDescription>
                {error ||
                  "A empresa que você tentou acessar não existe ou você não tem permissão."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" onClick={refetch}>
                Tentar Novamente
              </Button>
              <Button onClick={() => router.push("/dashboard")}>
                Voltar ao Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        mode="company-details"
        company={company}
        onInviteMember={() => setShowInviteDialog(true)}
        onEditCompany={() => setShowEditCompanyDialog(true)}
        onDeleteCompany={() => setShowDeleteDialog(true)}
      />

      <main className="flex-1 overflow-y-auto bg-background">
        <div className="p-8 max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="size-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">{company.name}</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Membros</CardTitle>
              <CardDescription>
                Lista de todos os membros da empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <Loading message="Nenhum membro encontrado" />
              ) : (
                <div className="space-y-3">
                  {members.map((membership) => (
                    <MemberCard
                      key={membership.id}
                      membership={membership}
                      isCurrentUser={membership.user?.id === user?.id}
                      onEdit={() => setEditingMember(membership)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {editingMember && (
        <EditMemberDialog
          open={!!editingMember}
          onClose={() => setEditingMember(null)}
          membership={editingMember}
          onSuccess={handleRefresh}
        />
      )}

      <InviteMemberDialog
        open={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        companyId={companyId}
        onSuccess={handleRefresh}
      />

      <EditCompanyDialog
        open={showEditCompanyDialog}
        onClose={() => setShowEditCompanyDialog(false)}
        company={company}
        onSuccess={handleRefresh}
      />

      <DeleteCompanyDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        company={company}
      />
    </div>
  );
}

export default function CompanyDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen overflow-hidden">
          <div className="flex-1 flex items-center justify-center bg-background">
            <Loading message="Carregando..." />
          </div>
        </div>
      }
    >
      <CompanyDetailContent />
    </Suspense>
  );
}
