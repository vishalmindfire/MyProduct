import type { Feature } from "@/app/data/features";

type Props = {
  features: Feature[];
  /** Number of columns at large breakpoint. Defaults to 3. */
  cols?: 3 | 4;
  /** Icon container size. "sm" = size-9, "md" = size-10. Defaults to "sm". */
  iconSize?: "sm" | "md";
};

const colsClass: Record<NonNullable<Props["cols"]>, string> = {
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

const iconContainerClass: Record<NonNullable<Props["iconSize"]>, string> = {
  sm: "size-9",
  md: "size-10",
};

export default function FeatureGrid({ features, cols = 3, iconSize = "sm" }: Props) {
  return (
    <div
      className={`grid ${colsClass[cols]} gap-px bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800`}
    >
      {features.map((f) => (
        <div
          key={f.id}
          className="flex flex-col gap-3 bg-white dark:bg-zinc-950 p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <span
            className={`flex ${iconContainerClass[iconSize]} items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 [&_svg]:size-5`}
          >
            {f.icon}
          </span>
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            {f.title}
          </h3>
          <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {f.description}
          </p>
        </div>
      ))}
    </div>
  );
}
