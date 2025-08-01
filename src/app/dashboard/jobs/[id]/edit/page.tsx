"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      const res = await fetch(`/api/jobs/${jobId}`);
      const data = await res.json();
      setJob(data);
    }
    fetchJob();
  }, [jobId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (job.jdUrl) formData.append("jdUrl", job.jdUrl);
    if (job.supportingDocUrl) formData.append("supportingDocUrl", job.supportingDocUrl);

    const res = await fetch(`/api/jobs/${jobId}`, {
      method: "PUT",
      body: formData,
    });

    setLoading(false);
    if (res.ok) {
      router.push("/dashboard/jobs");
    } else {
      alert("Failed to update job");
    }
  }

  if (!job) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Edit Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" defaultValue={job.title} className="w-full border p-2 rounded" required />
        <input name="code" defaultValue={job.code} className="w-full border p-2 rounded" required />
        <input name="department" defaultValue={job.department} className="w-full border p-2 rounded" required />
        <textarea name="description" defaultValue={job.description} className="w-full border p-2 rounded" />
        <input type="number" name="vacancy" defaultValue={job.vacancy} className="w-full border p-2 rounded" required />
        <select name="status" defaultValue={job.status} className="w-full border p-2 rounded">
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <input name="initiatedBy" defaultValue={job.initiatedBy} className="w-full border p-2 rounded" />

        <label className="block">Job Description (JD) File</label>
        {job.jdUrl && (
          <a href={job.jdUrl} target="_blank" className="text-blue-600 underline">
            View Current JD
          </a>
        )}
        <input type="file" name="jdFile" className="w-full border p-2 rounded" />

        <label className="block">Supporting Document</label>
        {job.supportingDocUrl && (
          <a href={job.supportingDocUrl} target="_blank" className="text-blue-600 underline">
            View Current Supporting Document
          </a>
        )}
        <input type="file" name="supportingDoc" className="w-full border p-2 rounded" />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Saving..." : "Update Job"}
        </button>
      </form>
    </div>
  );
}
