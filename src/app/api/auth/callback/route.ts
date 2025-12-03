import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/reset-password?error=missing_code");
  }

  const supabase = createRouteHandlerClient({ cookies });

  // 🔥 Supabase v0.10 way of handling OAuth / magic link code
  const { data: session, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Supabase callback error:", error.message);
    return NextResponse.redirect("/reset-password?error=invalid_or_expired");
  }

  // 🔥 Session is now active, redirect user to reset page
  return NextResponse.redirect("/reset-password");
}
