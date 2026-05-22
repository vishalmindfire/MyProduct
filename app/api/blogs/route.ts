import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const strapiUrl = process.env.STRAPI_URL;
  const apiToken  = process.env.STRAPI_API_TOKEN;

  if (!strapiUrl || !apiToken) {
    return Response.json(
      { error: 'STRAPI_URL or STRAPI_API_TOKEN is not configured' },
      { status: 500 }
    );
  }

  const category = req.nextUrl.searchParams.get('category')?.trim();
  const page = req.nextUrl.searchParams.get('page') !== null ? req.nextUrl.searchParams.get('page') : "1";
  const limit = req.nextUrl.searchParams.get('limit') !== null ? req.nextUrl.searchParams.get('limit') : "10";
  const url = new URL(`${strapiUrl}/api/blog-posts`);
  url.searchParams.set('populate', '*');
  if(page){
    url.searchParams.set('pagination[start]',page);
  }
  if(limit){
    url.searchParams.set('pagination[limit]',limit);
  }
  if (category && category !== "All") {
    url.searchParams.set('filters[category][$eq]', category);
  }

  const res = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return Response.json(
      { error: `Strapi responded with ${res.status}`, detail: err?.error?.message },
      { status: res.status }
    );
  }

  const json = await res.json();
  return Response.json(json);
}