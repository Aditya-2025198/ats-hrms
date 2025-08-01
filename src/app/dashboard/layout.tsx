import Link from "next/link";
import { ReactNode } from "react";
import { createClient } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();

  // Get current session (server-side)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If not logged in, redirect to login
  if (!session) {
    redirect("/login");
  }

  // Server action for logout
  const handleLogout = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="bg-gray-800 text-white p-4 text-xl font-bold flex justify-between items-center">
        <span>ATS & HRMS</span>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300">{session?.user?.email}</span>
          <form action={handleLogout}>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/dashboard"
              className="hover:bg-gray-800 rounded px-3 py-2 font-semibold"
            >
              Dashboard
            </Link>

            <div>
              <p className="text-sm uppercase text-gray-400 px-3 mt-4">ATS</p>
              <Link
                href="/dashboard/jobs"
                className="hover:bg-gray-800 rounded px-3 py-2 block"
              >
                Job Post
              </Link>
              <Link
                href="/dashboard/candidates"
                className="hover:bg-gray-800 rounded px-3 py-2 block"
              >
                Candidate
              </Link>
            </div>

            <div>
              <p className="text-sm uppercase text-gray-400 px-3 mt-4">HRMS</p>
              <Link
                href="/dashboard/employees"
                className="hover:bg-gray-800 rounded px-3 py-2 block"
              >
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
