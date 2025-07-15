import Link from "next/link"
import { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
        <h1 className="text-xl font-bold mb-6">ATS/HRMS</h1>
        <nav className="space-y-2">
  <Link href="/dashboard" className="block hover:text-gray-300">Dashboard</Link>
  <Link href="/dashboard/jobs" className="block hover:text-gray-300">Job Posts</Link>
  <Link href="/dashboard/jobs/new" className="block hover:text-gray-300 pl-4 text-sm">+ New Job</Link>
  <Link href="/dashboard/candidates" className="block hover:text-gray-300">Candidates</Link>
  <Link href="/dashboard/employees" className="block hover:text-gray-300">Employees</Link>
</nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-6">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <button className="text-sm bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700">
            Logout
          </button>
        </div>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  )
}
