"use client";
import { useState, useEffect } from "react";

export default function AddCandidate({ loggedInUser }) {
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", status: "Applied", position: "" });

  const fetchCandidates = async () => {
    const res = await fetch(`/api/candidates?company_id=${loggedInUser.company_id}`);
    const data = await res.json();
    setCandidates(data);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, hr_user_id: loggedInUser.id }),
    });
    if (res.ok) {
      setForm({ name: "", email: "", status: "Applied", position: "" });
      fetchCandidates();
    } else {
      alert("Error adding candidate");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Add Candidate</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input className="border p-2 w-full" placeholder="Name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Position"
          value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
        <select className="border p-2 w-full"
          value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>Applied</option>
          <option>Interviewed</option>
          <option>Hired</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Candidate
        </button>
      </form>

      <h2 className="text-xl font-bold mt-6 mb-2">Candidates</h2>
      <ul>
        {candidates.map(c => (
          <li key={c.id} className="border-b py-2">
            {c.name} - {c.position} ({c.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
