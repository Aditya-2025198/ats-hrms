"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Candidate = {
  id: string;
  name: string;
  email: string;
  position: string;
  status: "Interviewed" | "Hired" | "Rejected";
};

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      const res = await fetch("/api/candidates");
      const data = await res.json();
      setCandidates(data);
    };
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesStatus = filter === "All" || candidate.status === filter;
    const matchesSearch =
      candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      candidate.position.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Candidates</h1>
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

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or role..."
          className="px-3 py-2 border rounded w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="space-x-2">
          {["All", "Applied", "Interviewed", "Hired", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded border ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white p-4 rounded shadow border"
          >
            <h2 className="text-lg font-semibold">{candidate.name}</h2>
            <p>{candidate.email}</p>
            <p className="text-sm text-gray-700">{candidate.position}</p>
            <p
              className={`text-sm mt-1 ${
                candidate.status === "Hired"
                  ? "text-green-600"
                  : candidate.status === "Rejected"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              Status: {candidate.status}
            </p>
            <Link
              href={`/dashboard/candidates/${candidate.id}/edit`}
              className="text-sm text-blue-600 hover:underline mt-1 inline-block"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidatesPage;
