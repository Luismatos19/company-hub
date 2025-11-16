"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";

const navLinks = [
  { href: "/", label: "Início", authOnly: false },
  { href: "/dashboard", label: "Dashboard", authOnly: true },
  { href: "/login", label: "Entrar", authOnly: false },
];

export function Header() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { user, activeCompany } = useAuthStore();

  const isAuthenticated = !!user;

  const visibleLinks = navLinks.filter((link) => {
    if (link.authOnly && !isAuthenticated) return false;
    if (!link.authOnly && isAuthenticated && link.href === "/login")
      return false;
    return true;
  });

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white">
              <Zap className="size-4" />
            </span>
            <span className="text-sm font-semibold leading-tight">
              Platform
              <span className="block text-xs font-normal text-muted-foreground">
                Company Hub
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          {visibleLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {isAuthenticated && (
            <>
              {activeCompany && (
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  Empresa ativa:{" "}
                  <span className="font-medium">{activeCompany.name}</span>
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="ml-2"
              >
                Sair
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
