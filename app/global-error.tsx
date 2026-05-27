"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * global-error.tsx replaces the root layout when the root layout itself throws.
 * It must render its own <html> and <body> tags.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-white text-zinc-950 antialiased px-6">
        {/* Logo mark */}
        <div className="mb-8 flex size-12 items-center justify-center rounded-xl bg-zinc-950">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 text-white"
            aria-hidden="true"
          >
            <path d="M5.507 4.048A3 3 0 0 1 7.785 3h8.43a3 3 0 0 1 2.278 1.048l1.722 2.008A4.533 4.533 0 0 0 19.5 6h-15c-.243 0-.482.02-.715.056l1.722-2.008Z" />
            <path
              fillRule="evenodd"
              d="M1.5 10.5a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v7.5a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3v-7.5Zm9 3.75a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H11.25a.75.75 0 0 1-.75-.75v-.008Zm.75-2.25a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5H11.25Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Alert icon */}
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-red-100 bg-red-50">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="size-7 text-red-500"
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
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
          A critical error occurred
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-sm text-center text-sm leading-6 text-zinc-500">
          The application encountered an unrecoverable error. Please try again
          or contact support if the problem persists.
        </p>

        {/* Error digest */}
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-zinc-400">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={reset}
            className="flex h-10 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Try again
          </button>
          <a
            href="/"
            className="flex h-10 items-center justify-center rounded-full border border-zinc-200 px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Go home
          </a>
        </div>

        {/* Footer */}
        <p className="mt-16 text-xs text-zinc-400">
          &copy; {new Date().getFullYear()} DAM. All rights reserved.
        </p>
      </body>
    </html>
  );
}
