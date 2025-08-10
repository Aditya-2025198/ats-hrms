"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session after component mounts
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    // Optional: Listen for auth changes (helps with auto-logout)
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      } else {
        setSession(session);
      }
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="bg-gray-800 text-white p-4 text-xl font-bold flex justify-between items-center">
        <span>ATS & HRMS</span>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300">{session?.user?.email}</span>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
          <nav className="flex flex-col space-y-2">
            <Link href="/dashboard" className="hover:bg-gray-800 rounded px-3 py-2 font-semibold">
              Dashboard
            </Link>

            <div>
              <p className="text-sm uppercase text-gray-400 px-3 mt-4">ATS</p>
              <Link href="/dashboard/jobs" className="hover:bg-gray-800 rounded px-3 py-2 block">
                Job Post
              </Link>
              <Link href="/dashboard/candidates" className="hover:bg-gray-800 rounded px-3 py-2 block">
                Candidate
              </Link>
            </div>

            <div>
              <p className="text-sm uppercase text-gray-400 px-3 mt-4">HRMS</p>
              <Link href="/dashboard/employees" className="hover:bg-gray-800 rounded px-3 py-2 block">
                Employee Data
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
