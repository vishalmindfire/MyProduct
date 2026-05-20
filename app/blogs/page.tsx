import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Axon DAM",
  description:
    "Tips, product updates, and deep dives on digital asset management from the Axon team.",
};

const posts = [
  {
    slug: "ai-visual-search",
    category: "Product",
    date: "May 12, 2026",
    title: "Introducing AI Visual Search",
    excerpt:
      "Find any asset by describing what's in it — no tags, no folders, no guessing. Here's how we built it and what it means for your workflow.",
    readTime: "5 min read",
    accent: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900",
    tag: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400",
  },
  {
    slug: "version-history-deep-dive",
    category: "Guide",
    date: "Apr 29, 2026",
    title: "A Deep Dive into Version History",
    excerpt:
      "Rolling back a product image an hour before launch shouldn't require a prayer. We walk through every version-control feature in Axon.",
    readTime: "8 min read",
    accent: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900",
    tag: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
  },
  {
    slug: "guest-links-with-expiry",
    category: "Tips",
    date: "Apr 14, 2026",
    title: "Share Files Without Losing Control",
    excerpt:
      "Guest links, expiry dates, download watermarks — a practical guide to sharing assets with clients and contractors the safe way.",
    readTime: "4 min read",
    accent: "bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900",
    tag: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
  },
  {
    slug: "metadata-strategy",
    category: "Guide",
    date: "Mar 31, 2026",
    title: "Building a Metadata Strategy That Scales",
    excerpt:
      "Custom fields, auto-tagging, and taxonomy design — what we've seen work across hundreds of teams and what almost always goes wrong.",
    readTime: "10 min read",
    accent: "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900",
    tag: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400",
  },
  {
    slug: "scim-sso-enterprise",
    category: "Engineering",
    date: "Mar 18, 2026",
    title: "How We Built SCIM Provisioning in Six Weeks",
    excerpt:
      "Enterprise customers need just-in-time user provisioning. We shipped SCIM support on a tight timeline — here's what we learned.",
    readTime: "7 min read",
    accent: "bg-sky-50 dark:bg-sky-950/30 border-sky-100 dark:border-sky-900",
    tag: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-400",
  },
  {
    slug: "brand-consistency-ecommerce",
    category: "Use case",
    date: "Mar 3, 2026",
    title: "Keeping Product Images Consistent Across Every Channel",
    excerpt:
      "How a mid-size e-commerce brand cut asset prep time by 60% and eliminated inconsistent product photography in under a month.",
    readTime: "6 min read",
    accent: "bg-violet-50 dark:bg-violet-950/30 border-violet-100 dark:border-violet-900",
    tag: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-400",
  },
];

const categories = ["All", "Product", "Guide", "Tips", "Engineering", "Use case"];

export default async function BlogPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const [featured, ...rest] = posts;

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-zinc-950 font-sans">
      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-20 pb-12">
        <span className="inline-block rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-6">
          Axon Blog
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight max-w-2xl">
          Insights on digital asset management
        </h1>
        <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
          Product updates, workflow guides, and engineering deep dives from the Axon team.
        </p>
      </section>

      {/* Category filter */}
      <div className="border-b border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center gap-1 overflow-x-auto pb-0 -mb-px">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`shrink-0 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  i === 0
                    ? "border-zinc-950 dark:border-zinc-50 text-zinc-950 dark:text-zinc-50"
                    : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 py-12 space-y-12">
        {/* Featured post */}
        <Link
          href={`/blog/${featured.slug}`}
          className={`group block rounded-2xl border p-8 transition-shadow hover:shadow-md ${featured.accent}`}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${featured.tag}`}>
              {featured.category}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">{featured.date}</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">&middot;</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">{featured.readTime}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 group-hover:underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-600 mb-3">
            {featured.title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
            {featured.excerpt}
          </p>
          <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Read article
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-3.5 transition-transform group-hover:translate-x-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </div>
        </Link>

        {/* Post grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${post.tag}`}>
                  {post.category}
                </span>
              </div>
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50 leading-snug mb-2 group-hover:underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-600">
                {post.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1">
                {post.excerpt}
              </p>
              <div className="mt-5 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Load more */}
        <div className="text-center pt-4">
          <button className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 px-5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            Load more articles
          </button>
        </div>
      </div>
    </div>
  );
}
