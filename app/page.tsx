import type { Metadata } from "next";
import Link from "next/link";
import Image from 'next/image'
import FeatureGrid from "@/app/components/FeatureGrid";
import PlanGrid from "@/app/components/PlanGrid";
import qs from "qs";
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: "DAM — Digital Asset Management for Modern Teams",
  description:
    "Organize, search, and distribute every file your team creates — images, video, documents, and more — from one fast, secure hub.",
};

const testimonials = [
  {
    quote:
      "We went from spending half a day hunting down brand-approved files to finding anything in under 10 seconds. Our whole marketing team is faster now.",
    name: "Sarah Chen",
    title: "Head of Brand, Luminary Studio",
    initials: "SC",
  },
  {
    quote:
      "The version history alone was worth switching. Being able to roll back a product image an hour before launch saved us once — that was enough.",
    name: "Marcus Williams",
    title: "Creative Director, Foundry Commerce",
    initials: "MW",
  },
  {
    quote:
      "We manage assets for 120 clients. Guest links with expiry dates and watermarks let us share files without losing control. We wouldn't go back.",
    name: "Priya Anand",
    title: "Operations Lead, Scope Agency",
    initials: "PA",
  },
];

const homePageQuery = qs.stringify({
  populate: {
  title: {
    fields: ['heading', 'subheading']
  },
  blocks: {
      on: {
        'layout.hero-section': {
          populate: {
            image: {
              fields: ['url', 'alternativeText']
            },
            link: {
              populate: true
            }
          }
        },
        'layout.features-section': {
           populate: {
            feature: {
              populate: {
                feature: {
                  fields: ['id','title','description','icon']
                }
              }
            }
          }
        }
      }
    }
  }
});


const getHomePageData = async() => { 
  const strapiUrl = process.env.STRAPI_URL;
  if (!strapiUrl) {
    return Response.json(
      { error: 'STRAPI_URL is not configured' },
      { status: 500 }
    );
  }
  const url = new URL(`/api/home`,strapiUrl);
  url.search = homePageQuery;
  const res = await fetch(url.href, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: "GET",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return Response.json(
      { error: `Strapi responded with ${res.status}`, detail: err?.error?.message },
      { status: res.status }
    );
  }

  const json = await res.json();
  return json;
}

function getStrapiURL(url: string){
  return process.env.NODE_ENV !== "production" ? process.env.STRAPI_URL + url : url;
}

export default async function HomePage() {
  const session = await auth();
  const homePageData = await getHomePageData();
  const { title, description } = homePageData.data;
  const [hero, features] = homePageData.data.blocks;
  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-zinc-950 font-sans">
      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-12 pb-20 text-center">

        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.1]">
          {title.heading}
          <br />
          <span className="text-zinc-400 dark:text-zinc-500">{title.subheading}</span>
        </h1>

        <p className="mt-6 text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {!session && <Link
            href="/register"
            className="flex h-11 items-center justify-center rounded-full bg-zinc-950 dark:bg-zinc-50 px-6 text-sm font-medium text-white dark:text-zinc-950 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
          >
            Start for free
          </Link>}
          <Link
            href="/features"
            className="flex h-11 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 px-6 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            See all features
          </Link>
        </div>

        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
          Free plan available · No credit card required · 14-day Pro trial
        </p>

        {/* Hero UI mockup */}
        <div className="mt-16 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 shadow-sm text-left">
          <Image
            src={getStrapiURL(hero?.image?.url)} alt={hero?.image?.alternativeText} 
            width="1200" height="500"/>
        </div>
      </section>

      {/* ── Social proof strip ──────────────────────────────────────────── */}
      <section className="border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-6 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
            Trusted by teams at
          </span>
          {["Luminary", "Foundry Co.", "Scope Agency", "Vertex Labs", "Meridian"].map((name) => (
            <span
              key={name}
              className="text-sm font-semibold text-zinc-400 dark:text-zinc-600"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="mx-auto w-full max-w-5xl px-6 py-24">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Features
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Built for the full asset lifecycle
          </h2>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            From first upload to final delivery — every stage covered, nothing
            bolted on.
          </p>
        </div>

        <FeatureGrid features={features.feature} cols={3} />

        <div className="mt-8 text-center">
          <Link
            href="/features"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 px-4 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Explore all features
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Pricing / Plans ─────────────────────────────────────────────── */}
      <section id="pricing" className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto w-full max-w-5xl px-6 py-24">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Pricing
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Simple, transparent pricing
            </h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              Start free. Upgrade when your team is ready. Annual billing saves 20%.
            </p>
          </div>

          <PlanGrid ctaHref="/pricing" compact />

          <div className="mt-6 text-center">
            <Link
              href="/pricing"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 px-4 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 transition-colors"
            >
              See full plan comparison
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section id="testimonials" className="border-t border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-24">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Testimonials
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Teams that made the switch
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col gap-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6"
              >
                {/* stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 16 16" fill="currentColor" className="size-4 text-amber-400">
                      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="flex-1 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <figcaption className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-600 dark:text-zinc-300 shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      {t.name}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {t.title}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
