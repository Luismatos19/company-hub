"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth-store";
import { companiesApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Zap, Plus, LogOut, Building2 } from "lucide-react";

export function Sidebar() {
  const router = useRouter();
  const { user, activeCompany, companies, setActiveCompany } = useAuthStore();
  const { logout } = useAuth();
  const [isDark, setIsDark] = useState(false);

  const handleSelectCompany = async (companyId: string) => {
    try {
      await companiesApi.select(companyId);
      const company = companies.find((c) => c.id === companyId);
      if (company) {
        setActiveCompany(company);
      }
      router.refresh();
    } catch (error) {
      console.error("Erro ao selecionar empresa:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getCompanyColor = (index: number) => {
    const colors = [
      "bg-purple-600",
      "bg-orange-600",
      "bg-blue-600",
      "bg-green-600",
      "bg-red-600",
    ];
    return colors[index % colors.length];
  };

  return (
    <aside className="flex flex-col h-screen w-64 bg-sidebar border-r border-sidebar-border dark:bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Zap className="size-5 text-purple-600 dark:text-purple-400" />
          <span className="font-semibold text-sidebar-foreground">
            Platform
          </span>
        </div>
        <Switch
          checked={isDark}
          onCheckedChange={(checked) => {
            setIsDark(checked);
            document.documentElement.classList.toggle("dark", checked);
          }}
        />
      </div>

      {/* Active Company */}
      {activeCompany && (
        <div className="p-4 border-b border-sidebar-border">
          <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
            ACTIVE COMPANY
          </h3>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            <div className="size-12 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {getInitials(activeCompany.name)}
            </div>
            <span className="text-white text-sm font-medium text-center">
              {activeCompany.name}
            </span>
          </button>
        </div>
      )}

      {/* My Companies */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
          MY COMPANIES
        </h3>
        <div className="space-y-2">
          {companies
            .filter((c) => c.id !== activeCompany?.id)
            .map((company, index) => (
              <button
                key={company.id}
                onClick={() => handleSelectCompany(company.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors"
              >
                <div
                  className={`size-10 rounded-lg ${getCompanyColor(
                    index
                  )} flex items-center justify-center text-white font-semibold text-sm`}
                >
                  {getInitials(company.name)}
                </div>
                <span className="text-sm text-sidebar-foreground flex-1 text-left">
                  {company.name}
                </span>
              </button>
            ))}
        </div>

        <Separator className="my-4" />

        <Button
          onClick={() => router.push("/dashboard?new=true")}
          variant="ghost"
          className="w-full justify-start gap-2"
        >
          <Plus className="size-4" />
          Create New Company
        </Button>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          Log Out
        </Button>
      </div>
    </aside>
  );
}
