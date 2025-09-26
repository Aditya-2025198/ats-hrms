import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // ✅ Create a Supabase middleware client
  const supabase = createMiddlewareClient({ req, res });

  // ✅ Ensure the session is loaded so API routes can access it
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 🚨 Redirect unauthenticated users away from dashboard routes
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

// ✅ Apply to both dashboard pages AND API routes
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
