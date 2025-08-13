"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        console.error("API did not return an array:", data);
        setJobs([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch jobs:", err);
      setError(err.message || "Something went wrong");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    id?: string
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch(id ? `/api/jobs/${id}` : "/api/jobs", {
      method: id ? "PUT" : "POST",
      body: formData,
    });
    if (res.ok) {
      alert(id ? "Job updated!" : "Job created!");
      setEditingJob(null);
      fetchJobs();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    fetchJobs();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Jobs</h1>

      <form
        onSubmit={(e) => handleSubmit(e, editingJob?.id)}
        className="grid grid-cols-2 gap-4 border p-4 mb-6"
      >
        <input
          name="title"
          defaultValue={editingJob?.title}
          placeholder="Job Title"
          className="border p-2"
          required
        />
        <input
          name="code"
          defaultValue={editingJob?.code}
          placeholder="Job Code"
          className="border p-2"
          required
        />
        <input
          name="department"
          defaultValue={editingJob?.department}
          placeholder="Department"
          className="border p-2"
          required
        />
        <input
          name="vacancy"
          type="number"
          defaultValue={editingJob?.vacancy}
          placeholder="Vacancy"
          className="border p-2"
          required
        />
        <select
          name="status"
          defaultValue={editingJob?.status || "Open"}
          className="border p-2"
        >
          <option>Open</option>
          <option>Closed</option>
          <option>Hold</option>
        </select>
        <textarea
          name="description"
          defaultValue={editingJob?.description}
          placeholder="Description"
          className="border p-2 col-span-2"
        />
        <input type="file" name="jdFile" className="border p-2" />
        <input type="file" name="supportingFile" className="border p-2" />
        <input type="hidden" name="companyId" value="COMPANY_ID_HERE" />
        <button className="bg-blue-500 text-white p-2 col-span-2">
          {editingJob ? "Update Job" : "Create Job"}
        </button>
      </form>

      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <ul>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <li
                key={job.id}
                className="border p-3 mb-2 flex justify-between"
              >
                <div>
                  <strong>{job.title}</strong> ({job.code}) - {job.status}
                </div>
                <div>
                  <button
                    onClick={() => setEditingJob(job)}
                    className="mr-2 text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No jobs available</p>
          )}
        </ul>
      )}
    </div>
  );
}
