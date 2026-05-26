import LiveSectionBox from "@/app/components/LiveSectionBox";

export default async function LiveSection() {
  let data = null;
  try {
    const res = await fetch(`${process.env.AUTH_URL}/api/stats`, {
      cache: "no-store",
    });
    if (res.ok) {
      data = await res.json();
    }
  } catch {
    // stats unavailable — LiveSectionBox renders "—" placeholders
  }

  return <LiveSectionBox fallback={data} />;
}
