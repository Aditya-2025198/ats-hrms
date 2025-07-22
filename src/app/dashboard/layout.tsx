import Link from 'next/link'
import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="bg-gray-800 text-white p-4 text-xl font-bold">
        ATS & HRMS
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
  )
}
