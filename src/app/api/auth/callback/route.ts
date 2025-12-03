import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/reset-password?error=missing_code");
  }

  // 🔥 This is the correct Supabase client for server route handlers
  const supabase = createRouteHandlerClient({ cookies });

  // Exchange the code for a session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Token exchange failed:", error.message);
    return NextResponse.redirect("/reset-password?error=invalid_or_expired_link");
  }

  // Redirect to reset password page with an active session
  return NextResponse.redirect("/reset-password");
}
