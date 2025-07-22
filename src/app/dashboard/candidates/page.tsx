"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";

type Candidate = {
  id: string;
  name: string;
  number: string;
  email: string;
  jobCode: string;
  position: string;
  department: string;
  status: "Applied" | "Interviewed" | "Hired" | "Rejected" | "Offered";
  date: string;
  initiatedBy: string;
  resume?: string;
};

const initialCandidates: Candidate[] = [
  {
    id: "1",
    name: "Aarav Mehta",
    number: "9876543210",
    email: "aarav@example.com",
    jobCode: "012",
    position: "Frontend Developer",
    department: "Engineering",
    status: "Applied",
    date: "2025-07-01",
    initiatedBy: "Admin",
  },
  {
    id: "2",
    name: "Neha Sharma",
    number: "9876543211",
    email: "neha@example.com",
    jobCode: "013",
    position: "Backend Developer",
    department: "Engineering",
    status: "Interviewed",
    date: "2025-07-03",
    initiatedBy: "Admin",
  },
  {
    id: "3",
    name: "Rohan Desai",
    number: "9876543212",
    email: "rohan@example.com",
    jobCode: "014",
    position: "HR Manager",
    department: "Human Resources",
    status: "Hired",
    date: "2025-07-05",
    initiatedBy: "Admin",
  },
];

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [jobCodeFilter, setJobCodeFilter] = useState("All");

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesJob =
      jobCodeFilter === "All" || candidate.jobCode === jobCodeFilter;
    const matchesStatus = filter === "All" || candidate.status === filter;
    const matchesSearch =
      candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      candidate.position.toLowerCase().includes(search.toLowerCase()) ||
      candidate.jobCode.includes(search);
    return matchesJob && matchesStatus && matchesSearch;
  });

  const handleDelete = (id: string) => {
    const updated = candidates.filter((c) => c.id !== id);
    setCandidates(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Candidates</h1>
        <div className="flex gap-2">
          <Link
            href="/dashboard/candidates/new"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Add New Candidate
          </Link>
          <a
            href="/api/candidates/export"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download Excel
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Input
          type="text"
          placeholder="Search by name, role or code..."
          className="max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={jobCodeFilter}
          onChange={(e) => setJobCodeFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Job Codes</option>
          <option value="012">012</option>
          <option value="013">013</option>
          <option value="014">014</option>
        </select>

        <div className="flex gap-2">
          {["All", "Applied", "Interviewed", "Offered", "Hired", "Rejected"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCandidates.map((candidate) => (
          <Card
            key={candidate.id}
            className="p-5 space-y-2 rounded-xl shadow border bg-gradient-to-br from-white to-gray-50 hover:scale-[1.01] transition-transform"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-blue-800">{candidate.name}</h2>
                <p className="text-sm text-gray-600">{candidate.email}</p>
                <p className="text-sm text-gray-600">{candidate.number}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/dashboard/candidates/${candidate.id}/edit`}>
                    <Pencil className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(candidate.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-700 grid grid-cols-2 gap-x-4 gap-y-1">
              <div><strong>Job Code:</strong> {candidate.jobCode}</div>
              <div><strong>Position:</strong> {candidate.position}</div>
              <div><strong>Department:</strong> {candidate.department}</div>
              <div><strong>Status:</strong> {candidate.status}</div>
              <div><strong>Date:</strong> {candidate.date}</div>
              <div className="col-span-2"><strong>Initiated by:</strong> {candidate.initiatedBy}</div>
            </div>

            <div className="pt-2 border-t mt-2">
              <Label htmlFor={`resume-${candidate.id}`}>Resume:</Label>
              <Input type="file" id={`resume-${candidate.id}`} className="mt-1" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
