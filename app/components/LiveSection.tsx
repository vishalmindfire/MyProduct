import LiveSectionBox from "@/app/components/LiveSectionBox";

export default async function LiveSection() {
  const res = await fetch(
    `${process.env.AUTH_URL}/api/stats`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  return <LiveSectionBox fallback={data} />;
}
