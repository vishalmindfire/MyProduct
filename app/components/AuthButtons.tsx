'use client';

import Link from 'next/link';

import { useSession } from 'next-auth/react';

import LogoutButton from '@/app/components/LogoutButton';
import Loader from '@/app/components/Loader';

export default function AuthButtons() {
  const { data: session, status } =
    useSession();

  if (status === 'loading') {
    return (
      <Loader/>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <Link
            href="/dashboard"
            className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
            >
            <div className="flex items-center gap-4">
              <div>
                <p className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                  {session.user.name}
                </p>
              </div>
            </div>
        </Link>
        <LogoutButton />
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
    >
      Login
    </Link>
  );
}