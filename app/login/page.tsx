'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const router = useRouter();

    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn(
            'credentials',
            {
                email: email.current?.value,
                password: password.current?.value,
                redirect: false,
            }
        );

        setLoading(false);

        if (result?.error) {
            setError('Invalid email or password.');
            return;
        }

        router.push('/dashboard');
    }

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 font-sans">

            {/* Nav */}
            <header className="sticky top-0 z-50 border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
                <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 h-14">
                    <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                        Axon<span className="text-zinc-400 dark:text-zinc-500"> DAM</span>
                    </Link>
                    <div className="hidden sm:flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/features" className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">Features</Link>
                        <Link href="/pricing" className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">Pricing</Link>
                    </div>
                    <Link
                        href="#"
                        className="flex h-8 items-center rounded-full bg-zinc-950 dark:bg-zinc-50 px-4 text-sm font-medium text-white dark:text-zinc-950 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
                    >
                        Get started
                    </Link>
                </nav>
            </header>

            {/* Form */}
            <main className="flex flex-1 items-center justify-center px-6 py-20">
                <div className="w-full max-w-sm">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Sign in to your Axon account
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-8 flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                ref={email}
                                required
                                className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-zinc-50/10 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                ref={password}
                                required
                                className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-zinc-50/10 transition"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-500 dark:text-red-400">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 flex h-10 w-full items-center justify-center rounded-full bg-zinc-950 dark:bg-zinc-50 text-sm font-medium text-white dark:text-zinc-950 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>

                    <p className="mt-5 text-center text-xs text-zinc-400 dark:text-zinc-500">
                        Don&apos;t have an account?{' '}
                        <Link href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">
                            Get started for free
                        </Link>
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-100 dark:border-zinc-800">
                <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 dark:text-zinc-500">
                    <span className="font-semibold text-zinc-500 dark:text-zinc-400">Axon DAM</span>
                    <div className="flex items-center gap-6">
                        <Link href="/features" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Features</Link>
                        <Link href="/pricing" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Pricing</Link>
                        <a href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Terms</a>
                    </div>
                    <span>© 2026 Axon DAM</span>
                </div>
            </footer>

        </div>
    );
}
