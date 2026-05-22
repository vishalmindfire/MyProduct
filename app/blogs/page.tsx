import type { Metadata } from "next";
import Blog from "@/app/components/Blog";

export const metadata: Metadata = {
  title: "Blog — Axon DAM",
  description:
    "Tips, product updates, and deep dives on digital asset management from the Axon team.",
};

export default function BlogPage() {
  return (
    <Blog/>
  );
}
