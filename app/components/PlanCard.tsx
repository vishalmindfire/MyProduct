import Link from "next/link";
import type { Plan } from "@/app/data/plans";

type Props = {
  plan: Plan;
  /** CTA button destination — caller decides (e.g. "#" on pricing page, "/pricing" on home). */
  href: string;
  /** Compact mode: smaller price, shorter feature list, tighter spacing. */
  compact?: boolean;
};

const muted = "text-zinc-400 dark:text-zinc-500";
const mutedOnDark = "text-zinc-400 dark:text-zinc-500";

export default function PlanCard({ plan, href, compact = false }: Props) {
  const inv = plan.highlighted;
  const featureList = compact ? plan.featuresCompact : plan.features;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        inv
          ? "border-zinc-950 dark:border-zinc-50 bg-zinc-950 dark:bg-zinc-50"
          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-950 dark:bg-zinc-50 border border-zinc-800 dark:border-zinc-200 px-3 py-0.5 text-xs font-semibold text-white dark:text-zinc-950 whitespace-nowrap">
          {plan.badge}
        </span>
      )}

      {/* Name */}
      <p className={`text-xs font-semibold uppercase tracking-widest ${mutedOnDark}`}>
        {plan.name}
      </p>

      {/* Price */}
      <div className="mt-2 flex items-end gap-1.5">
        <span
          className={`font-semibold tracking-tight ${
            compact ? "text-3xl" : "text-4xl"
          } ${inv ? "text-white dark:text-zinc-950" : "text-zinc-950 dark:text-zinc-50"}`}
        >
          {plan.price}
        </span>
        {plan.period && (
          <span className={`mb-1 text-sm ${muted}`}>/ {plan.period}</span>
        )}
      </div>

      {/* Description */}
      <p className={`mt-2 text-sm leading-6 ${muted}`}>{plan.description}</p>

      {/* CTA */}
      <Link
        href={href}
        className={`mt-5 flex ${compact ? "h-9" : "h-10"} items-center justify-center rounded-full text-sm font-medium transition-colors ${
          inv
            ? "bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            : "border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        }`}
      >
        {plan.cta}
      </Link>

      {/* Features */}
      <ul className={`${compact ? "mt-5 space-y-2" : "mt-6 space-y-2.5"}`}>
        {featureList.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm">
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className={`size-4 shrink-0 ${muted}`}
            >
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm3.78 4.78a.75.75 0 0 0-1.06-1.06L7 7.44 5.28 5.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.25-4.25Z" />
            </svg>
            <span
              className={
                inv
                  ? "text-zinc-300 dark:text-zinc-600"
                  : "text-zinc-600 dark:text-zinc-400"
              }
            >
              {f}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
