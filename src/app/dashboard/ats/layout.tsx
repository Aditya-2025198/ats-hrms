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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push("/login");
        } else {
          setSession(session);
        }
      }
    );

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
      {/* Header with centered nav */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        {/* Left: Logo / Title */}
        <span className="text-xl font-bold">ATS</span>

        {/* Center: Navigation */}
        <nav>
          <ul className="flex space-x-8 text-sm font-bold">
            <li>
              <Link href="/dashboard" className="hover:text-blue-400">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/dashboard/ats/jobs" className="hover:text-blue-400">
                Job
              </Link>
            </li>
            <li>
              <Link href="/dashboard/ats/candidates" className="hover:text-blue-400">
                Candidates
              </Link>
            </li>
            <li>
              <Link href="/dashboard/ats/interviews" className="hover:text-blue-400">
                Interviews
              </Link>
            </li>
            <li>
              <Link href="/dashboard/ats/pipeline" className="hover:text-blue-400">
                Pipeline
              </Link>
            </li>
            <li>
              <Link href="/dashboard/ats/analytics" className="hover:text-blue-400">
                Analytics
              </Link>
            </li>
            <li>
              <Link href="/dashboard/ats/requisitions" className="hover:text-blue-400">
                Requisition
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right: User info + logout */}
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

      {/* Main Content - full width */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
