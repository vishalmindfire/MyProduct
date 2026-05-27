import qs from "qs";
export type Feature = {
  id: string;
  feature: {
    id: number;
    title: string;
    description: string;
    icon: string;
  }
};

const featuresQuery = qs.stringify({
  populate: {
    title: {
      populate: {
        fields: ['heading','subheading']
      }
    },
    Features: {
      populate: {
        feature: {
          populate: {
            feature: {
              fields: ['title', 'description', 'icon']
            }
          }
        }
      }
    }
  }
})

export const getFeatures = async () => {
  if (!process.env.STRAPI_URL) return null;

  const url = new URL('/api/feature-page', process.env.STRAPI_URL)
  url.search = featuresQuery;

  try {
    const res = await fetch(url.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) return null;

    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

export const allFeatures= [
  {
    id: "organization",
    title: "Smart Organization",
    description:
      "Structure assets with nested folders, collections, and custom metadata schemas. Tag at scale and keep every file exactly where you expect it.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v8.25m19.5 0v.75A2.25 2.25 0 0 1 19.5 17.25h-15A2.25 2.25 0 0 1 2.25 15v-.75" />
      </svg>
    ),
  },
  {
    id: "versions",
    title: "Version History",
    description:
      "Every upload is snapshotted automatically. Compare, restore, or branch any version without overwriting live assets.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    id: "formats",
    title: "Any Format, Any Size",
    description:
      "Images, video, audio, PDFs, 3D models, fonts — upload anything up to 50 GB and preview it right in the browser.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    id: "collaboration",
    title: "Team Collaboration",
    description:
      "Leave comments on any asset, request approvals, and share lightweight guest links — all without leaving the platform.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    id: "permissions",
    title: "Granular Permissions",
    description:
      "Assign roles at the workspace, folder, or file level. Share guest links with expiry dates and optional watermarks.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    id: "analytics",
    title: "Usage Analytics",
    description:
      "Track views, downloads, and shares per asset. Surface top-performing content and spot what's going stale.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    id: "integrations",
    title: "Integrations & CDN",
    description:
      "Push assets to your CMS, design tool, or storefront via REST API. Serve files globally through a built-in CDN with automatic image optimization.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
  },
];

export const homepageFeatures = allFeatures.filter((f) =>
  ["search", "versions", "permissions", "formats", "analytics", "integrations"].includes(f.id)
);
