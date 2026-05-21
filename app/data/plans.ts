export type Plan = {
  name: string;
  price: string;
  period?: string;
  description: string;
  badge?: string;
  cta: string;
  features: string[];
  featuresCompact: string[];
  highlighted: boolean;
};

export const allPlans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals and small projects getting started.",
    cta: "Get started free",
    features: [
      "5 GB storage",
      "Up to 3 users",
      "200+ file formats",
      "Basic search",
      "Public share links",
      "7-day version history",
    ],
    featuresCompact: ["5 GB storage", "3 users", "Basic search", "7-day history"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "seat / month",
    description: "For growing teams that need more power and control.",
    badge: "Most popular",
    cta: "Start free trial",
    features: [
      "500 GB storage",
      "Unlimited users",
      "AI-powered search",
      "Custom metadata schemas",
      "Password-protected links",
      "1-year version history",
      "Usage analytics",
      "Priority support",
    ],
    featuresCompact: [
      "500 GB storage",
      "Unlimited users",
      "AI search",
      "Analytics",
      "1-year history",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organisations with advanced security and compliance needs.",
    cta: "Contact sales",
    features: [
      "Unlimited storage",
      "Unlimited users",
      "SSO & SCIM provisioning",
      "Dynamic watermarking",
      "Dedicated CDN",
      "Audit log & eDiscovery",
      "SLA 99.99% uptime",
      "Dedicated CSM",
      "Custom integrations",
    ],
    featuresCompact: [
      "Unlimited storage",
      "SSO & SCIM",
      "Audit log",
      "99.99% SLA",
      "Dedicated CSM",
    ],
    highlighted: false,
  },
];
