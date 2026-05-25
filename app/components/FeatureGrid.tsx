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

  const getIcon =(icon: string) => {
    switch(icon){
      case 'CLOCK_ICON':{
        return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v8.25m19.5 0v.75A2.25 2.25 0 0 1 19.5 17.25h-15A2.25 2.25 0 0 1 2.25 15v-.75" />
        </svg>
        );
      }
      case 'CLICK_ICON':{
        return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        );
      }
      case 'CLOUD_ICON':{
        return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        );
      }
      default:
        return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
        );
    }
  }
  return (
    <div
      className={`grid ${colsClass[cols]} gap-px bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800`}
    >
      {features.map((f) => (
        <div
          key={f.feature.id}
          className="flex flex-col gap-3 bg-white dark:bg-zinc-950 p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <span
            className={`flex ${iconContainerClass[iconSize]} items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 [&_svg]:size-5`}
          >
            {getIcon(f.feature.icon)}
          </span>
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            {f.feature.title}
          </h3>
          <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {f.feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
