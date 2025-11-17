"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/use-auth";
import { Zap, Plus, LogOut, Mail, Settings, Trash2 } from "lucide-react";
import type { SidebarProps, Company } from "@/types";
import { getInitials, getCompanyMemberCount } from "@/lib/utils/company";

export function Sidebar({
  mode = "dashboard",
  company,
  onInviteMember,
  onEditCompany,
  onDeleteCompany,
}: SidebarProps) {
  const router = useRouter();
  const { activeCompany } = useAuthStore();
  const { logout } = useAuth();
  const [isDark, setIsDark] = useState(false);

  const displayCompany =
    mode === "company-details" && company ? company : activeCompany;
  const memberCount =
    mode === "company-details" && company
      ? getCompanyMemberCount(company)
      : null;

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

      {displayCompany && displayCompany.name && (
        <div className="p-4 border-b border-sidebar-border">
          <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
            {mode === "company-details" ? "COMPANY" : "ACTIVE COMPANY"}
          </h3>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            <div className="size-12 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {getInitials(displayCompany.name)}
            </div>
            <span className="text-white text-sm font-medium text-center">
              {displayCompany.name}
            </span>
            {memberCount !== null && (
              <span className="text-white/80 text-xs">
                {memberCount} {memberCount === 1 ? "membro" : "membros"}
              </span>
            )}
          </button>
        </div>
      )}

      {mode === "dashboard" ? (
        /* Create Company Button */
        <div className="p-4">
          <Button
            onClick={() => router.push("/dashboard?new=true")}
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <Plus className="size-4" />
            Create New Company
          </Button>
        </div>
      ) : (
        <div className="p-4 flex-1 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={onInviteMember}
          >
            <Mail className="size-4" />
            Convidar Membro
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={onEditCompany}
          >
            <Settings className="size-4" />
            Editar Empresa
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onDeleteCompany}
          >
            <Trash2 className="size-4" />
            Deletar Empresa
          </Button>
        </div>
      )}

      <div className="mt-auto p-4 border-t border-sidebar-border">
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
