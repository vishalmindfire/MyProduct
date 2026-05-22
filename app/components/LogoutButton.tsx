'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors cursor-pointer"
      onClick={() =>
        signOut({
          callbackUrl: '/login',
        })
      }
    >
      Logout
    </button>
  );
}