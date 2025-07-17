// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-gray-900 py-20 text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Simplify Hiring with ATS/HRMS
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto mb-8">
          Powerful applicant tracking and employee management in one platform.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition"
        >
          Go to Dashboard
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-950 px-4">
        <div className="max-w-5xl mx-auto grid gap-10 sm:grid-cols-3 text-center">
          {[
            { title: "Track Candidates", desc: "View, filter, and manage applicants easily." },
            { title: "Manage Employees", desc: "Maintain employee profiles and roles." },
            { title: "Export Data", desc: "Download employee or applicant data in one click." },
          ].map((f, i) => (
            <div key={i}>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 text-center py-6 text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} ATS/HRMS — All rights reserved.
      </footer>
    </div>
  );
}
