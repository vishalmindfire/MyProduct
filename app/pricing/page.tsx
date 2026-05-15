import type { Metadata } from "next";
import PlanGrid from "@/app/components/PlanGrid";
import { allPlans } from "@/app/data/plans";

export const metadata: Metadata = {
  title: "Pricing — Digital Asset Management",
  description:
    "Simple, transparent pricing that scales with your team. Start free, upgrade when you're ready.",
};

const faqs = [
  {
    q: "Can I change plans later?",
    a: "Yes. You can upgrade, downgrade, or cancel at any time from your account settings. Upgrades take effect immediately; downgrades apply at the next billing cycle.",
  },
  {
    q: "What happens when I hit my storage limit?",
    a: "You'll receive an email warning at 80% and 95% capacity. Uploads are paused once the limit is reached — existing assets remain fully accessible.",
  },
  {
    q: "Is there a free trial for the Pro plan?",
    a: "Yes. Every new account gets a 14-day Pro trial with no credit card required. You're automatically moved to the Free plan when the trial ends unless you add a payment method.",
  },
  {
    q: "How does per-seat pricing work?",
    a: "A seat is any user who logs in during the billing period. Guests with view-only share links don't count as seats.",
  },
  {
    q: "Do you offer discounts for non-profits or education?",
    a: "Yes — verified non-profits and educational institutions receive 50% off all paid plans. Reach out to our sales team with proof of status.",
  },
  {
    q: "Where is my data stored?",
    a: "Data is stored in your chosen region (US, EU, or APAC) and never leaves that region. Enterprise customers can request dedicated infrastructure.",
  },
];

const comparisons = [
  { feature: "Storage", free: "5 GB", pro: "500 GB", enterprise: "Unlimited" },
  { feature: "Users", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "File formats", free: "200+", pro: "200+", enterprise: "200+" },
  { feature: "AI search", free: false, pro: true, enterprise: true },
  { feature: "Custom metadata", free: false, pro: true, enterprise: true },
  { feature: "Version history", free: "7 days", pro: "1 year", enterprise: "Unlimited" },
  { feature: "Analytics", free: false, pro: true, enterprise: true },
  { feature: "SSO / SCIM", free: false, pro: false, enterprise: true },
  { feature: "Dynamic watermarking", free: false, pro: false, enterprise: true },
  { feature: "Audit log", free: false, pro: false, enterprise: true },
  { feature: "Uptime SLA", free: "—", pro: "99.9%", enterprise: "99.99%" },
  { feature: "Support", free: "Community", pro: "Priority email", enterprise: "Dedicated CSM" },
];

function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-4 text-zinc-950 dark:text-zinc-50 mx-auto">
      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm3.78 4.78a.75.75 0 0 0-1.06-1.06L7 7.44 5.28 5.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.25-4.25Z" />
    </svg>
  );
}

function Dash() {
  return (
    <span className="block w-4 h-px bg-zinc-300 dark:bg-zinc-600 mx-auto" />
  );
}

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check />;
  if (value === false) return <Dash />;
  return (
    <span className="text-sm text-zinc-600 dark:text-zinc-400">{value}</span>
  );
}

export default function PricingPage() {
  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-zinc-950 font-sans">
      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-24 pb-16 text-center">
        <span className="inline-block rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-6">
          Pricing
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
          Pay for what you use.
          <br />
          Nothing more.
        </h1>
        <p className="mt-5 text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          All plans include unlimited asset previews, 200+ file formats, and
          our core organiser. Upgrade for AI search, analytics, and enterprise
          controls.
        </p>
      </section>

      {/* Plan cards */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-20">
        <PlanGrid ctaHref="#" />

        <p className="mt-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
          All prices in USD. Annual billing saves 20%.{" "}
          <a href="#" className="underline underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-300">
            See annual pricing
          </a>
        </p>
      </section>

      {/* Full comparison table */}
      <section className="border-t border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 mb-10 text-center">
            Full plan comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="pb-4 text-sm font-medium text-zinc-400 dark:text-zinc-500 w-1/2">
                    Feature
                  </th>
                  {allPlans.map((p) => (
                    <th
                      key={p.name}
                      className={`pb-4 text-center text-sm font-semibold ${
                        p.highlighted
                          ? "text-zinc-950 dark:text-zinc-50"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-zinc-50 dark:border-zinc-900 ${
                      i % 2 === 0 ? "" : "bg-zinc-50/50 dark:bg-zinc-900/30"
                    }`}
                  >
                    <td className="py-3 text-sm text-zinc-700 dark:text-zinc-300">
                      {row.feature}
                    </td>
                    <td className="py-3 text-center">
                      <CellValue value={row.free} />
                    </td>
                    <td className="py-3 text-center">
                      <CellValue value={row.pro} />
                    </td>
                    <td className="py-3 text-center">
                      <CellValue value={row.enterprise} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto w-full max-w-3xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 mb-10 text-center">
            Frequently asked questions
          </h2>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-6">
                <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 mb-2">
                  {faq.q}
                </p>
                <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Start managing assets today
          </h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Free plan, no credit card. Upgrade when your team grows.
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
