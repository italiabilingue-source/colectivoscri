import { AuthCard } from '@/components/auth/auth-card';
import { RegisterForm } from '@/components/auth/register-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register',
    description: 'Create a new School Shuttle Tracker account.',
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create an Account"
      description="Get started with the shuttle tracker by creating an account."
    >
      <RegisterForm />
    </AuthCard>
  );
}
