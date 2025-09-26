// app/api/attachments/signed-url/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const objectKey = searchParams.get("objectKey");
  const expires = parseInt(searchParams.get("expires") ?? "600", 10);

  if (!objectKey) {
    return NextResponse.json({ error: "Missing objectKey" }, { status: 400 });
  }

  const { data, error } = await supabaseServer.storage
    .from("attachments")
    .createSignedUrl(objectKey, expires);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ signedUrl: data.signedUrl });
}
