"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { CreateCompanyDialog } from "@/components/create-company-dialog";
import { CompanyCard } from "@/components/company/company-card";
import { Pagination } from "@/components/company/pagination";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuthStore } from "@/store/auth-store";
import { useCompanies } from "@/hooks/use-companies";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

function DashboardContent() {
  const searchParams = useSearchParams();
  const showNewCompany = searchParams.get("new") === "true";
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [showCreateCompany, setShowCreateCompany] = useState(showNewCompany);

  const { companies, isLoading } = useCompanies({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    enabled: !!user,
  });

  const totalPages = Math.ceil(companies.length / DEFAULT_PAGE_SIZE);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <CreateCompanyDialog
        open={showCreateCompany}
        onClose={() => setShowCreateCompany(false)}
      />

      <main className="flex-1 overflow-y-auto bg-background">
        <div className="p-8 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Minhas Empresas</h1>

          {isLoading ? (
            <Loading message="Carregando empresas..." />
          ) : companies.length === 0 ? (
            <EmptyState
              message="Você ainda não faz parte de nenhuma empresa."
              actionLabel="Criar Primeira Empresa"
              onAction={() => setShowCreateCompany(true)}
            />
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {companies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
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
