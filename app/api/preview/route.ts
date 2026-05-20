import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const status = searchParams.get("status");
  const slug = searchParams.get("slug");

  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  const draft = await draftMode();
  if (status === "draft") {
    draft.enable();
  } else {
    draft.disable();
  }

  redirect(`/blogs/${slug}`);
};   