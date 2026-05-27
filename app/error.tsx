"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center">
      {/* Icon */}
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-red-100 bg-red-50 dark:border-red-900/40 dark:bg-red-950/30">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="size-8 text-red-500 dark:text-red-400"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        Something went wrong
      </h1>

      {/* Description */}
      <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        An unexpected error occurred while loading this page. The issue has been
        noted and our team will look into it.
      </p>

      {/* Error digest (for support reference) */}
      {error.digest && (
        <p className="mt-3 font-mono text-xs text-zinc-400 dark:text-zinc-600">
          Error ID: {error.digest}
        </p>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={reset}
          className="flex h-10 items-center justify-center rounded-full bg-zinc-950 dark:bg-zinc-50 px-5 text-sm font-medium text-white dark:text-zinc-950 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
        >
          Try again
        </button>
        <Link
          href="/"
          className="flex h-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 px-5 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
