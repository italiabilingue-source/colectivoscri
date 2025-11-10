'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { signInWithEmail } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Iniciar Sesión
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(signInWithEmail, null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (state?.status === 'error') {
      toast({
        title: 'Error de Autenticación',
        description: state.message,
        variant: 'destructive',
      });
    }
    if (state?.status === 'success') {
      toast({
        title: 'Éxito',
        description: 'Has iniciado sesión correctamente.',
      });
      router.push('/dashboard');
    }
  }, [state, router, toast]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="tu@email.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <SubmitButton />
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{' '}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
