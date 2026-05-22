import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const strapiUrl = process.env.STRAPI_URL;
    if (!strapiUrl) {
        return Response.json(
        { error: "STRAPI_URL or STRAPI_API_TOKEN is not configured" },
        { status: 500 }
        );
    }
    
    const url = new URL(`${strapiUrl}/api/stats/users/count`);

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        next: { revalidate: 3600 },
    });
    console.log(res);
    if (!res.ok) {
        const text = await res.text();
        return Response.json(
        { error: `Strapi responded with ${res.status}`, detail: text },
        { status: res.status }
        );
    }

    const json = await res.json();

    return Response.json(json);
}