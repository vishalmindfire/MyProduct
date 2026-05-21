import type { NextRequest } from "next/server";

const COLLECTION = "marketings";

export async function GET(_req: NextRequest) {
  const strapiUrl = process.env.STRAPI_URL;
  const apiToken  = process.env.STRAPI_API_TOKEN;

  if (!strapiUrl || !apiToken) {
    return Response.json(
      { error: "STRAPI_URL or STRAPI_API_TOKEN is not configured" },
      { status: 500 }
    );
  }

  const url = new URL(`${strapiUrl}/api/${COLLECTION}`);
  url.searchParams.set("pagination[pageSize]", "1");
  url.searchParams.set("pagination[withCount]", "true");
  url.searchParams.set("status", "published");

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json(
      { error: `Strapi responded with ${res.status}`, detail: text },
      { status: res.status }
    );
  }

  const json = await res.json();
  const count: number = json?.meta?.pagination?.total ?? 0;

  return Response.json({ count });
}

export async function POST(_req: NextRequest) {
  const strapiUrl = process.env.STRAPI_URL;
  
  if (!strapiUrl) {
    return Response.json(
      { error: "STRAPI_URL is not configured" },
      { status: 500 }
    );
  }

  const body = await _req.json()
  const {  email } = body;
  const data = {
    data: {
      "email": email
    }
  }

  const url = new URL(`${strapiUrl}/api/${COLLECTION}`);

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const detail = await res.json();
    return Response.json(
      { error: `Strapi responded with ${res.status}`, detail: detail?.error },
      { status: res.status }
    );
  }

  const json = await res.json();

  return Response.json({ json });
}