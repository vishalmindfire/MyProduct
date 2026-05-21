"use client";

import  { useActionState } from "react";

export type SubscribeState = { status: "idle" | "success" | "error"; message?: string };

const subscribe = async (
  _prev: SubscribeState,
  formData: FormData
): Promise<SubscribeState> => {
  const email = (formData.get("email") as string)?.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }

   const url = `/api/subscribe`;
   const data = {
                    "email": email
                  }
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: "POST",
      body: JSON.stringify(data),
    });

    if(!res.ok){
        return { status: "error", message: "Unexpected error occured. Try again."}
    }

  return { status: "success", message: "You're on the list!" };
}

export default function SubscriptionBox() {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(
    subscribe,
    { status: "idle" }
  );

  if (state.status === "success") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-5 py-2.5 text-sm text-emerald-700 dark:text-emerald-400">
        <svg viewBox="0 0 16 16" fill="currentColor" className="size-4 shrink-0">
          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm3.78 4.78a.75.75 0 0 0-1.06-1.06L7 7.44 5.28 5.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.25-4.25Z" />
        </svg>
        {state.message}
      </div>
    );
  }

  return (
    <form action={action} className="w-full max-w-md">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 dark:text-zinc-500 pointer-events-none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={`w-full rounded-full border bg-white dark:bg-zinc-900 pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none transition-colors
              ${state.status === "error"
                ? "border-red-300 dark:border-red-700 focus:border-red-400"
                : "border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500"
              }`}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 inline-flex h-10 items-center gap-1.5 rounded-full bg-zinc-950 dark:bg-zinc-50 px-5 text-sm font-medium text-white dark:text-zinc-950 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? (
            <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          )}
          {pending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {state.status === "error" && (
        <p className="mt-2 pl-4 text-xs text-red-500 dark:text-red-400">{state.message}</p>
      )}
    </form>
  );
}