"use client";

import { useEffect, useState } from "react";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);

  useEffect(() => {
    fetchCandidates();
    fetchJobs();
  }, []);

  const fetchCandidates = async () => {
    const res = await fetch("/api/candidates");
    const data = await res.json();
    setCandidates(data);
  };

  const fetchJobs = async () => {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, id?: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch(id ? `/api/candidates/${id}` : "/api/candidates", {
      method: id ? "PUT" : "POST",
      body: formData,
    });
    if (res.ok) {
      alert(id ? "Candidate updated!" : "Candidate created!");
      setEditingCandidate(null);
      fetchCandidates();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/candidates/${id}`, { method: "DELETE" });
    fetchCandidates();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Candidates</h1>

      <form
        onSubmit={(e) => handleSubmit(e, editingCandidate?.id)}
        className="grid grid-cols-2 gap-4 border p-4 mb-6"
      >
        <input name="name" defaultValue={editingCandidate?.name} placeholder="Full Name" className="border p-2" required />
        <input name="email" defaultValue={editingCandidate?.email} placeholder="Email" className="border p-2" required />
        <input name="phone" defaultValue={editingCandidate?.phone} placeholder="Phone" className="border p-2" required />
        <input name="department" defaultValue={editingCandidate?.department} placeholder="Department" className="border p-2" required />
        <select name="status" defaultValue={editingCandidate?.status || "Applied"} className="border p-2">
          <option>Applied</option>
          <option>Interviewed</option>
          <option>Hired</option>
          <option>Rejected</option>
        </select>
        <select name="jobId" defaultValue={editingCandidate?.jobId} className="border p-2">
          <option value="">Select Job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title} ({job.code})
            </option>
          ))}
        </select>
        <input type="file" name="resume" className="border p-2 col-span-2" />
        <input type="hidden" name="companyId" value="COMPANY_ID_HERE" />
        <button className="bg-blue-500 text-white p-2 col-span-2">
          {editingCandidate ? "Update Candidate" : "Add Candidate"}
        </button>
      </form>

      <ul>
        {candidates.map((cand) => (
          <li key={cand.id} className="border p-3 mb-2 flex justify-between">
            <div>
              <strong>{cand.name}</strong> - {cand.status} ({cand.job?.title || "No Job"})
              {cand.resumeUrl && (
                <a href={cand.resumeUrl} target="_blank" rel="noreferrer" className="ml-2 text-blue-500">
                  View Resume
                </a>
              )}
            </div>
            <div>
              <button onClick={() => setEditingCandidate(cand)} className="mr-2 text-blue-500">Edit</button>
              <button onClick={() => handleDelete(cand.id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
