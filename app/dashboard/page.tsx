import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard — Axon DAM' };

export default async function Dashboard() {
  const session = await auth();

  if (!session) redirect('/login');

  const { user, error } = session;
  const initials = (user?.name ?? 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-zinc-950 font-sans">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 space-y-6">

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Your account at a glance.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-4 shrink-0">
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM7.25 4.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5Zm.75 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
            </svg>
            Session error: {error}. Please sign out and sign back in.
          </div>
        )}

        <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-lg font-semibold text-zinc-700 dark:text-zinc-200 shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                {user?.name ?? '—'}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {user?.email ?? '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Detail rows */}
        <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
          {[
            { label: 'Display name', value: user?.name ?? '—' },
            { label: 'Email',        value: user?.email ?? '—' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {label}
              </span>
              
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 font-mono">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Token card */}
        <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-5 py-4 space-y-1.5">
          <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            Total Newsletter Subscribers
          </p>
          <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 break-all leading-relaxed">
            5
          </p>
        </div>

      </div>
    </div>
  );
}