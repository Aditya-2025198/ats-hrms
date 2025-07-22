import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Banner Image with overlay */}
      <div className="relative w-full h-[400px]">
        <Image
          src="/top-banner.jpeg" // Make sure this file is inside the public folder
          alt="ATS HRMS Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Simplify Hiring with ATS & HRMS
          </h1>
          <p className="text-lg max-w-xl">
            Powerful applicant tracking and employee management in one platform.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Login
          </Link>
        </div>
      </div>

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
