"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const employeesData = [
  {
    id: 1,
    employeeCode: "EMP001",
    name: "Arjun Verma",
    email: "arjun@company.com",
    personalEmail: "arjun.verma@gmail.com",
    contact: "9876543210",
    altContact: "9876500000",
    department: "Engineering",
    role: "Frontend Developer",
    designation: "Senior Developer",
    doj: "2022-04-01",
    grade: "G5",
    pan: "ABCDE1234F",
    aadhar: "1234-5678-9012",
    address: "123 Main Street, Delhi",
    uan: "123456789012",
    fatherName: "Raj Verma",
    highestEducation: "B.Tech",
    location: "Delhi",
    nationality: "Indian",
    reportingTo: "Nisha Rao",
    status: "Active",
  },
  {
    id: 2,
    employeeCode: "EMP002",
    name: "Sneha Sharma",
    email: "sneha@company.com",
    personalEmail: "sneha.sharma@gmail.com",
    contact: "9876543211",
    altContact: "9876511111",
    department: "Human Resources",
    role: "HR Manager",
    designation: "Manager",
    doj: "2020-06-15",
    grade: "G6",
    pan: "ABCDE1234G",
    aadhar: "2234-5678-9012",
    address: "456 Secondary Road, Mumbai",
    uan: "223456789012",
    fatherName: "Vikas Sharma",
    highestEducation: "MBA",
    location: "Mumbai",
    nationality: "Indian",
    reportingTo: "Rahul Mehta",
    status: "Serving Notice",
    modeOfSeparation: "Resignation",
    lwd: "2025-08-10"
  },
  {
    id: 3,
    employeeCode: "EMP003",
    name: "Zoya Khan",
    email: "zoya@company.com",
    personalEmail: "zoya.khan@gmail.com",
    contact: "9876543212",
    altContact: "9876522222",
    department: "Quality Assurance",
    role: "QA Tester",
    designation: "Executive QA",
    doj: "2021-11-20",
    grade: "G4",
    pan: "ABCDE1234H",
    aadhar: "3234-5678-9012",
    address: "789 Tertiary Lane, Bangalore",
    uan: "323456789012",
    fatherName: "Imran Khan",
    highestEducation: "M.Sc",
    location: "Bangalore",
    nationality: "Indian",
    reportingTo: "Sneha Sharma",
    status: "Inactive",
    modeOfSeparation: "Termination",
    lwd: "2024-12-31"
  }
];

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("");
  const [locFilter, setLocFilter] = useState("");
  const [natFilter, setNatFilter] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = employeesData.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.employeeCode.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      filter === "All" ||
      e.status.toLowerCase() === filter.toLowerCase();

    const matchDept = deptFilter === "" || e.department === deptFilter;
    const matchLoc = locFilter === "" || e.location === locFilter;
    const matchNat = natFilter === "" || e.nationality === natFilter;

    return matchSearch && matchStatus && matchDept && matchLoc && matchNat;
  });

  const toggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const departments = [...new Set(employeesData.map((e) => e.department))];
  const locations = [...new Set(employeesData.map((e) => e.location))];
  const nationalities = [...new Set(employeesData.map((e) => e.nationality))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Employee Directory</h2>
        <div className="flex gap-2">
          <Link href="/dashboard/employees/new">
            <Button className="bg-blue-600 hover:bg-blue-700">Add Employee</Button>
          </Link>
          <a
            href="/api/employees/export"
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded shadow"
          >
            Download Excel
          </a>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Input
          placeholder="Search by name or employee code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />

        <div className="flex gap-2 flex-wrap">
          {["All", "Active", "Inactive", "Serving Notice"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 text-sm rounded-full border shadow-sm font-medium transition-all ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm shadow"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={locFilter}
          onChange={(e) => setLocFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm shadow"
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <select
          value={natFilter}
          onChange={(e) => setNatFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm shadow"
        >
          <option value="">All Nationalities</option>
          {nationalities.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((e) => (
          <Card key={e.id} className="border rounded-xl shadow hover:shadow-md transition">
            <CardContent className="p-5">
              <div
                onClick={() => toggleExpand(e.id)}
                className="cursor-pointer space-y-1 hover:bg-gray-50 rounded-md p-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{e.name}</h3>
                  <span className="text-sm text-gray-400">{e.employeeCode}</span>
                </div>
                <p className="text-sm text-gray-500">{e.email}</p>
                <p className="text-sm text-gray-600">{e.department} - {e.designation} - {e.location}</p>
                <p className="text-sm text-gray-600">Reporting to: {e.reportingTo}</p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                    e.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : e.status === "Inactive"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {e.status}
                </span>
              </div>

              {expanded === e.id && (
                <div className="mt-4 border-t pt-4 text-sm text-gray-700 space-y-2">
                  <div><strong>DOJ:</strong> {e.doj}</div>
                  <div><strong>Grade:</strong> {e.grade}</div>
                  <div><strong>Personal Email:</strong> {e.personalEmail}</div>
                  <div><strong>Contact:</strong> {e.contact}</div>
                  <div><strong>Alternate Contact:</strong> {e.altContact}</div>
                  <div><strong>Address:</strong> {e.address}</div>
                  <div><strong>PAN:</strong> {e.pan}</div>
                  <div><strong>Aadhar:</strong> {e.aadhar}</div>
                  <div><strong>UAN:</strong> {e.uan}</div>
                  <div><strong>Father's Name:</strong> {e.fatherName}</div>
                  <div><strong>Highest Education:</strong> {e.highestEducation}</div>
                  {e.status === "Inactive" || e.status === "Serving Notice" ? (
                    <>
                      <div><strong>Mode of Separation:</strong> {e.modeOfSeparation}</div>
                      <div><strong>LWD:</strong> {e.lwd}</div>
                    </>
                  ) : null}

                  <Link
                    href={`/dashboard/employees/${e.id}/edit`}
                    className="text-blue-600 text-sm underline mt-3 inline-block"
                  >
                    Edit
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-500 mt-4">No employees found.</p>
        )}
      </div>
    </div>
  );
}
