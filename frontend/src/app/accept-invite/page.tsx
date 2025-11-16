'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { invitesApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { Zap, CheckCircle2 } from 'lucide-react';

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { setActiveCompany } = useAuthStore();

  const [inputToken, setInputToken] = useState(token || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAccept = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await invitesApi.accept(inputToken);
      setActiveCompany(result.company);
      setSuccess(true);

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: unknown) {
      const errorWithMessage = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        errorWithMessage.response?.data?.message ||
          'Erro ao aceitar convite',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="size-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              Convite Aceito!
            </CardTitle>
            <CardDescription className="text-center">
              Você foi adicionado à empresa com sucesso. Redirecionando...
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Zap className="size-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            Aceitar Convite
          </CardTitle>
          <CardDescription className="text-center">
            Digite o token do convite para entrar na empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAccept} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="token" className="text-sm font-medium">
                Token do Convite
              </label>
              <Input
                id="token"
                type="text"
                placeholder="Cole o token aqui"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processando...' : 'Aceitar Convite'}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-muted-foreground hover:underline"
              >
                Voltar para a home
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="text-lg text-muted-foreground">Carregando...</div>
          </div>
        </main>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
}
