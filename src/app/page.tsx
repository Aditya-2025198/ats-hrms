"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="ABS HireLogic Logo"
            width={140}
            height={150}
          />
          <span className="font-bold text-xl text-gray-800">
            ABS HireLogic
          </span>
        </div>
        {/* Menu */}
<div className="hidden md:flex space-x-8 text-gray-700 font-medium">

  {/* Features Dropdown */}
  <div className="relative group">
    <button className="flex items-center hover:font-bold text-gray-900">
      Features
      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {/* Dropdown */}
    <div className="absolute left-0 mt-2 hidden w-48 bg-white border border-gray-200 rounded-md shadow-lg group-hover:block">
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ATS</a>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">HRMS</a>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Payroll</a>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Performance</a>
    </div>
  </div>

  {/* Solutions Dropdown */}
  <div className="relative group">
    <button className="flex items-center hover:font-bold text-gray-900">
      Solutions
      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {/* Dropdown */}
    <div className="absolute left-0 mt-2 hidden w-48 bg-white border border-gray-200 rounded-md shadow-lg group-hover:block">
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">For Startups</a>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">For SMEs</a>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">For Enterprises</a>
    </div>
  </div>

  {/* Normal Links */}
  <a href="#pricing" className="hover:font-bold text-gray-900">Pricing</a>
  <a href="#customers" className="hover:font-bold text-gray-900">Customers</a>

  {/* Partners Dropdown */}
  <div className="relative group">
    <button className="flex items-center hover:font-bold text-gray-900">
      Partners
      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div className="absolute left-0 mt-2 hidden w-48 bg-white border border-gray-200 rounded-md shadow-lg group-hover:block">
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Become a Partner</a>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Integration Partners</a>
    </div>
  </div>

  {/* Resources Dropdown */}
  <div className="relative group">
    <button className="flex items-center hover:font-bold text-gray-900">
      Resources
      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div className="absolute left-0 mt-2 hidden w-48 bg-white border border-gray-200 rounded-md shadow-lg group-hover:block">
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Blog</a>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Case Studies</a>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Help Center</a>
    </div>
  </div>
</div>


        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-700 hover:bold text-gray-900">
            <Link href="/login" className="text-gray-700 hover:text-gray-900">
              Sign In
            </Link>
          </button>
          <Button className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700">
            Get Free Demo
          </Button>
        </div>
      </nav>
{/* Hero Section */}
<section className="bg-[#002b5c] text-white py-20 px-6 md:px-16">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

    {/* Left Content */}
    <div>
      <p className="text-yellow-400 font-semibold mb-4">
        #1 RATED HR SOFTWARE 
      </p>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        AI-Powered HR Software <br /> 
        <span className="text-gray-200">Built for India</span>
      </h1>
      <p className="text-lg text-gray-300 max-w-xl">
        With AI at its core, ABS HireLogic empowers businesses in India to drive HR efficiency,
        transform talent management, enhance employee experience, and more.
      </p>
    </div>

    {/* Right Side Form */}
    <div className="bg-[#003366] p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Schedule a Demo</h2>
      <form className="space-y-4">

        <input
          type="email"
          placeholder="Work Email*"
          className="w-full px-4 py-3 rounded-lg bg-blue-900 text-white placeholder-gray-300 focus:outline-none"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First name*"
            className="px-4 py-3 rounded-lg bg-blue-900 text-white placeholder-gray-300 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Last name*"
            className="px-4 py-3 rounded-lg bg-blue-900 text-white placeholder-gray-300 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select className="px-4 py-3 rounded-lg bg-blue-900 text-white focus:outline-none">
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
          </select>
          <input
            type="text"
            placeholder="+91"
            className="px-4 py-3 rounded-lg bg-blue-900 text-white placeholder-gray-300 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Company name*"
            className="px-4 py-3 rounded-lg bg-blue-900 text-white placeholder-gray-300 focus:outline-none"
          />
          <select className="px-4 py-3 rounded-lg bg-blue-900 text-white focus:outline-none">
            <option>Number of Employees*</option>
            <option>1-10</option>
            <option>11-50</option>
            <option>51-200</option>
            <option>200+</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select className="px-4 py-3 rounded-lg bg-blue-900 text-white focus:outline-none">
            <option>Seniority*</option>
            <option>HR Manager</option>
            <option>HR Head</option>
            <option>CEO</option>
          </select>
          <select className="px-4 py-3 rounded-lg bg-blue-900 text-white focus:outline-none">
            <option>Functional Area*</option>
            <option>HR</option>
            <option>Finance</option>
            <option>IT</option>
          </select>
        </div>

        <div className="flex items-center text-sm text-gray-300">
          <input type="checkbox" className="mr-2" />
          <p>
            I have read and understood the{" "}
            <a href="#" className="underline">Privacy Policy</a>,{" "}
            <a href="#" className="underline">Terms of Use</a>
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition"
        >
          REQUEST A DEMO
        </button>
      </form>
    </div>

  </div>
</section>

{/* Features Section */}
<section className="bg-gray-50 py-16 px-6 md:px-16">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

    {/* ATS */}
    <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-2xl">
      <img src="/top-banner.jpeg" alt="ATS" className="w-80 h-80 object-contain mb-6 rounded-lg" />
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Applicant Tracking System (ATS)</h3>
      <p className="text-gray-600 leading-relaxed">
        <strong className="text-red-600">Revolutionize Your Hiring with Our ATS</strong><br/><br/>
        In today's competitive landscape, finding and hiring the right talent is more challenging than ever...
        Our ATS transforms your hiring process from a chaotic chore into a streamlined, strategic advantage.
      </p>
    </div>

    {/* HRMS */}
    <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-2xl">
      <img src="/12341.png" alt="HRMS" className="w-80 h-80 object-contain mb-6 rounded-lg" />
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Human Resource Management System (HRMS)</h3>
      <p className="text-gray-600 leading-relaxed">
        <strong className="text-red-600">Transform Your Workforce Management</strong><br/><br/>
        Managing people is the core of your business, but manual processes and scattered data make it tough.
        Our HRMS automates HR operations and provides strategic insights for a high-performing organization.
      </p>
    </div>

    {/* Payroll */}
    <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-2xl">
      <img src="/payroll.jpg" alt="Payroll" className="w-80 h-80 object-contain mb-6 rounded-lg" />
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Payroll</h3>
      <p className="text-gray-600 leading-relaxed">
        <strong className="text-red-600">Simplify and Secure Your Payroll</strong><br/><br/>
        Payroll is the heartbeat of your business. Our solution ensures accuracy, compliance, and timely payments,
        removing the risk of errors and delays.
      </p>
    </div>

    {/* Performance Management */}
    <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-2xl">
      <img src="/performance.webp" alt="Performance Management" className="w-80 h-80 object-contain mb-6 rounded-lg" />
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Performance Management</h3>
      <p className="text-gray-600 leading-relaxed">
        <strong className="text-red-600">Drive Growth and Engagement</strong><br/><br/>
        Move beyond annual reviews with a modern system that fosters continuous feedback, accountability,
        and goal alignment to build a high-performing culture.
      </p>
    </div>

  </div>
</section>


      {/* Features Section */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Powerful Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "ATS", desc: "Streamline recruitment with advanced applicant tracking." },
            { title: "HRMS", desc: "Manage employee data, policies, and documents seamlessly." },
            { title: "Onboarding", desc: "Smooth onboarding experience for new hires." },
            { title: "Attendance", desc: "Track attendance and shifts with accuracy." },
            { title: "Performance", desc: "Evaluate employee performance effortlessly." },
            { title: "Payroll", desc: "Automate payroll processing and compliance." },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

     {/* Footer Section */}
<footer className="bg-gray-900 text-gray-300 py-12 px-6 md:px-16">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

    {/* Features */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
      <ul className="space-y-2">
        <li>Onboarding</li>
        <li>Employee management</li>
        <li>Attendance management</li>
        <li>Shift management</li>
        <li>Leave management (Time-off)</li>
        <li>Timesheets</li>
        <li>HR help desk</li>
        <li>Document management</li>
        <li>Performance management</li>
        <li>Compensation management</li>
        <li>Learning management</li>
        <li>Employee engagement</li>
        <li>HR analytics</li>
      </ul>
    </div>

    {/* Integrated Solutions */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Integrated Solutions</h3>
      <ul className="space-y-2">
        <li>Recruitment</li>
        <li>Payroll</li>
        <li>Travel and expense</li>
      </ul>
      <h3 className="text-lg font-semibold text-white mt-6 mb-4">Partner Resources</h3>
      <ul className="space-y-2">
        <li>Become a partner</li>
        <li>Partner training</li>
        <li>Partner success stories</li>
      </ul>
      <h3 className="text-lg font-semibold text-white mt-6 mb-4">Quick Links</h3>
      <ul className="space-y-2">
        <li>Pricing</li>
        <li>Customer success stories</li>
      </ul>
    </div>

    {/* Resources */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
      <ul className="space-y-2">
        <li>Why ABS HireLogic</li>
        <li>Welcome guide</li>
        <li>HR knowledge hub</li>
        <li>HR glossary</li>
        <li>Webinars</li>
        <li>Integrations</li>
        <li>What's new</li>
        <li>Mobile app</li>
        <li>HR chatbot</li>
        <li>GDPR compliance</li>
        <li>Data security & privacy</li>
        <li>Scalability</li>
      </ul>
    </div>

    {/* Help Documentation */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Help Documentation</h3>
      <ul className="space-y-2">
        <li>Administrator guide</li>
        <li>Employee handbook</li>
        <li>Help videos</li>
        <li>API guide</li>
      </ul>
      <h3 className="text-lg font-semibold text-white mt-6 mb-4">Let's Talk</h3>
      <ul className="space-y-2">
        <li>Request demo</li>
        <li>Request a price quote</li>
        <li>Events & workshops</li>
        <li>Forums</li>
      </ul>
    </div>

  </div>

  {/* Bottom bar */}
  <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400">
    © {new Date().getFullYear()} ABS HireLogic. All rights reserved.
  </div>
</footer>

    </div>
  );
}
