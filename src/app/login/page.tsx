import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login to your School Shuttle Tracker account.',
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to access the shuttle tracker dashboard."
    >
      <LoginForm />
    </AuthCard>
  );
}
