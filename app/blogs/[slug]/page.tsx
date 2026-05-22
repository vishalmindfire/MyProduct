import type { Metadata } from "next";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { draftMode } from "next/headers";

type StrapiImage = {
  url: string;
  alternativeText?: string;
};

type StrapiPost = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description?: string;
  // Strapi v4 richtext returns HTML; adjust if using Blocks (v5)
  content: string;
  publishedAt: string;
  readTime?: string;
  cover?: StrapiImage;
  category?: { name: string };
  author?: { name: string; avatar?: StrapiImage };
};

const categoryColors: Record<string, string> = {
  Product:     "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400",
  Guide:       "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
  Tips:        "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
  Engineering: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-400",
  "Use case":  "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-400",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

async function getPost(slug: string): Promise<StrapiPost | null> {
const { isEnabled } = await draftMode();
  const url = `${process.env.STRAPI_URL}/api/blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}&status=${
   isEnabled ? "draft" : "published"
 }&populate=*`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const { data } = await res.json();
  return (data?.[0] as StrapiPost) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const session = await auth();
  if (!session) return {};

  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Post not found — Axon DAM" };

  return {
    title: `${post.title} — Axon DAM`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  const { slug } = await params;

  const post = await getPost(slug);

  if (!post) notFound();

  const categoryClass =
    categoryColors[post.category?.name ?? ""] ??
    "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";

  const coverSrc = post.cover?.url
    ? post.cover.url.startsWith("http")
      ? post.cover.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL ?? process.env.STRAPI_URL}${post.cover.url}`
    : null;

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-zinc-950 font-sans">
      <article className="mx-auto w-full max-w-3xl px-6 py-16">
        {/* Back */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-10"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 8H3M7 4 3 8l4 4" />
          </svg>
          All articles
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {post.category && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryClass}`}>
              {post.category.name}
            </span>
          )}
          <span className="text-sm text-zinc-400 dark:text-zinc-500">
            {formatDate(post.publishedAt)}
          </span>
          {post.readTime && (
            <>
              <span className="text-zinc-300 dark:text-zinc-600">&middot;</span>
              <span className="text-sm text-zinc-400 dark:text-zinc-500">{post.readTime}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Description */}
        {post.description && (
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
            {post.description}
          </p>
        )}

        {/* Author */}
        {post.author && (
          <div className="flex items-center gap-3 mb-10 pb-10 border-b border-zinc-100 dark:border-zinc-800">
            {post.author.avatar ? (
              <Image
                src={
                  post.author.avatar.url.startsWith("http")
                    ? post.author.avatar.url
                    : `${process.env.NEXT_PUBLIC_STRAPI_URL ?? process.env.STRAPI_URL}${post.author.avatar.url}`
                }
                alt={post.author.name}
                width={36}
                height={36}
                className="rounded-full object-cover bg-zinc-200 dark:bg-zinc-700"
              />
            ) : (
              <div className="size-9 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-600 dark:text-zinc-300 shrink-0">
                {post.author.name[0]}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {post.author.name}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">Author</p>
            </div>
          </div>
        )}

        {/* Cover image */}
        {coverSrc && (
          <div className="relative mb-10 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 h-72 sm:h-96">
            <Image
              src={coverSrc}
              alt={post.cover?.alternativeText ?? post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* Content — Strapi v4 richtext (HTML). For Strapi v5 Blocks, replace with a blocks renderer */}
        <div
          className="
            text-zinc-700 dark:text-zinc-300 leading-relaxed
            [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-zinc-950 [&_h2]:dark:text-zinc-50 [&_h2]:mt-10 [&_h2]:mb-4
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-zinc-950 [&_h3]:dark:text-zinc-50 [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:mb-5 [&_p]:leading-7
            [&_ul]:mb-5 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-1
            [&_ol]:mb-5 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1
            [&_li]:leading-7
            [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 [&_blockquote]:dark:border-zinc-600 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-500 [&_blockquote]:dark:text-zinc-400 [&_blockquote]:italic [&_blockquote]:my-6
            [&_pre]:bg-zinc-900 [&_pre]:dark:bg-zinc-800 [&_pre]:text-zinc-100 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:text-sm
            [&_code]:bg-zinc-100 [&_code]:dark:bg-zinc-800 [&_code]:text-zinc-800 [&_code]:dark:text-zinc-200 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm
            [&_a]:text-zinc-950 [&_a]:dark:text-zinc-50 [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-zinc-300 [&_a]:dark:decoration-zinc-600
            [&_img]:rounded-xl [&_img]:my-6 [&_img]:max-w-full
            [&_hr]:border-zinc-100 [&_hr]:dark:border-zinc-800 [&_hr]:my-10
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 8H3M7 4 3 8l4 4" />
            </svg>
            Back to all articles
          </Link>
        </div>
      </article>
    </div>
  );
}
