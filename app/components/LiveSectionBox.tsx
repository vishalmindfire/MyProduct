"use client";

import useSWR from "swr";

type UserCountInfo = {
  loginUserCount: string;
  newUserCount: string;
};

const fetcher = (url: string) =>
  fetch(url).then((res) => (res.ok ? res.json() : null));

export default function LiveSectionBox({ fallback }: Record<string, UserCountInfo>) {
  const { data } = useSWR<UserCountInfo>("/api/stats", fetcher, {
    fallbackData: fallback,
    refreshInterval: 5000,
  });

  return (
    <div className="ml-auto w-full sm:w-1/2 lg:w-[30%] grid grid-cols-2 gap-4">
      {/* Block 1 — Active users */}
      <div className="flex flex-col gap-1.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            Active now
          </span>
        </div>
        <p className="text-3xl font-semibold tabular-nums text-zinc-950 dark:text-zinc-50">
          {data?.loginUserCount ?? "—"}
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">logged-in users</p>
      </div>

      {/* Block 2 — New users */}
      <div className="flex flex-col gap-1.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-indigo-500" />
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            New today
          </span>
        </div>
        <p className="text-3xl font-semibold tabular-nums text-zinc-950 dark:text-zinc-50">
          {data?.newUserCount ?? "—"}
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">new sign-ups</p>
      </div>
    </div>
  );
}