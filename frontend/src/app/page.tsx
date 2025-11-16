"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { Zap } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
            <Zap className="size-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Platform
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Gerencie suas empresas e equipes de forma simples e eficiente
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <Link href="/login" className="block">
            <Button size="lg" className="w-full">
              Entrar
            </Button>
          </Link>
          <Link href="/login?signup=true" className="block">
            <Button variant="outline" size="lg" className="w-full">
              Criar Conta
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
