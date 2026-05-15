import type { Metadata } from "next";
import FeatureGrid from "@/app/components/FeatureGrid";
import { allFeatures } from "@/app/data/features";

export const metadata: Metadata = {
  title: "Features — Digital Asset Management",
  description:
    "Organize, search, and share your digital assets with powerful tools built for modern teams.",
};

const highlights = [
  {
    label: "Assets stored",
    value: "2B+",
  },
  {
    label: "Teams worldwide",
    value: "40k+",
  },
  {
    label: "Uptime SLA",
    value: "99.99%",
  },
  {
    label: "Formats supported",
    value: "200+",
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-zinc-950 font-sans">
      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-24 pb-16 text-center">
        <span className="inline-block rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-6">
          Digital Asset Management
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
          One place for every asset
          <br />
          your team will ever need
        </h1>
        <p className="mt-5 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Ingest, organize, transform, and distribute files at any scale — with
          the search, permissions, and integrations your workflow already
          demands.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#"
            className="flex h-11 items-center justify-center rounded-full bg-zinc-950 dark:bg-zinc-50 px-6 text-sm font-medium text-white dark:text-zinc-950 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
          >
            Start for free
          </a>
          <a
            href="#"
            className="flex h-11 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 px-6 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            See a demo
          </a>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {highlights.map((h) => (
            <div key={h.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50 tabular-nums">
                {h.value}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {h.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Built for the full asset lifecycle
          </h2>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            From first upload to final delivery, every stage is covered.
          </p>
        </div>

        <FeatureGrid features={allFeatures} cols={4} iconSize="md" />
      </section>

      {/* Deep-dive: Search */}
      <section className="border-t border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Search
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Stop hunting. Start finding.
            </h2>
            <p className="mt-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Our search index understands what is inside your files — not just
              their names. Ask for &ldquo;blue product photos on white
              background&rdquo; and get exactly that, across millions of assets,
              in under a second.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Visual similarity search",
                "Full-text extraction from PDFs and slides",
                "Color palette filtering",
                "Custom metadata facets",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-4 shrink-0 text-zinc-400 dark:text-zinc-500"
                  >
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm3.78 4.78a.75.75 0 0 0-1.06-1.06L7 7.44 5.28 5.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.25-4.25Z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Search mockup */}
          <div className="flex-1 w-full max-w-sm lg:max-w-none">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 shadow-sm">
              <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-4 shrink-0 text-zinc-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <span className="text-sm text-zinc-400 dark:text-zinc-500">
                  blue product photos on white background
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-zinc-200 dark:bg-zinc-700 animate-pulse"
                    style={{ animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-zinc-400 dark:text-zinc-500">
                2,341 results &middot; 0.4 s
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deep-dive: Permissions */}
      <section className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-6 py-20 flex flex-col lg:flex-row-reverse items-center gap-12">
          <div className="flex-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Access Control
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Share what you want, protect what you don&rsquo;t.
            </h2>
            <p className="mt-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Grant access at the workspace, collection, or file level. Set
              expiry dates on guest links, mandate download approvals, or
              watermark assets on the fly — no engineering work needed.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "SSO and SCIM provisioning",
                "Expiring and password-protected share links",
                "Dynamic watermarking",
                "Audit log for every action",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-4 shrink-0 text-zinc-400 dark:text-zinc-500"
                  >
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm3.78 4.78a.75.75 0 0 0-1.06-1.06L7 7.44 5.28 5.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.25-4.25Z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Permissions mockup */}
          <div className="flex-1 w-full max-w-sm lg:max-w-none">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800">
              {[
                { name: "Design team", role: "Editor", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400" },
                { name: "Marketing", role: "Viewer", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" },
                { name: "Agency (guest)", role: "Download", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" },
                { name: "Legal", role: "No access", color: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400" },
              ].map((row) => (
                <div key={row.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      {row.name[0]}
                    </div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {row.name}
                    </span>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${row.color}`}>
                    {row.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Ready to bring order to your assets?
          </h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Get started free — no credit card required. Upgrade when your team
            is ready.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#"
              className="flex h-11 items-center justify-center rounded-full bg-zinc-950 dark:bg-zinc-50 px-6 text-sm font-medium text-white dark:text-zinc-950 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
            >
              Get started free
            </a>
            <a
              href="#"
              className="flex h-11 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 px-6 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Contact sales
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
