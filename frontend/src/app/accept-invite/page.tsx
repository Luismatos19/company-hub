'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { invitesApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { acceptInviteSchema, type AcceptInviteFormData } from '@/lib/schemas';
import { ApiError } from '@/lib/api';
import { Zap, CheckCircle2 } from 'lucide-react';

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { setActiveCompany } = useAuthStore();

  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    setValue,
  } = useForm<AcceptInviteFormData>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      token: token || '',
    },
  });

  // Sincroniza o token da URL com o formulário
  useEffect(() => {
    if (token) {
      setValue('token', token);
    }
  }, [token, setValue]);

  const onSubmit = async (data: AcceptInviteFormData) => {
    try {
      const result = await invitesApi.accept(data.token);
      setActiveCompany(result.company);
      setSuccess(true);

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setFormError('root', { message: err.message });
      } else {
        setFormError('root', { message: 'Erro ao aceitar convite' });
      }
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              label="Token do Convite"
              type="text"
              placeholder="Cole o token aqui"
              required
              {...register('token')}
              error={errors.token?.message}
            />

            {errors.root && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {errors.root.message}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Processando...' : 'Aceitar Convite'}
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
