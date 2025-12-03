import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/reset-password?error=Missing+code");
  }

  const supabase = createClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Token exchange failed:", error);
    return NextResponse.redirect("/reset-password?error=Invalid+or+expired+link");
  }

  return NextResponse.redirect("/reset-password");
}
