import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import RegisterForm from '@/app/components/RegisterForm';

export const metadata: Metadata = {
  title: 'Create account — DAM',
  description:
    'Sign up for a free DAM account. No credit card required. Start organising your digital assets in seconds.',
};

export default async function RegisterPage() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return <RegisterForm />;
}
