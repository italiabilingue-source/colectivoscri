import { AuthCard } from '@/components/auth/auth-card';
import { RegisterForm } from '@/components/auth/register-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Registro',
    description: 'Crea una nueva cuenta en Gestor de Cursos.',
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Crear una Cuenta"
      description="Comienza a gestionar tus cursos creando una cuenta."
    >
      <RegisterForm />
    </AuthCard>
  );
}
