import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Iniciar Sesión',
    description: 'Inicia sesión en tu cuenta de Gestor de Cursos.',
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Bienvenido de Vuelta"
      description="Inicia sesión para acceder al panel de cursos."
    >
      <LoginForm />
    </AuthCard>
  );
}
