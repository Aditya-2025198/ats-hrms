"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    code: "",
    department: "",
    description: "",
    vacancy: 1,
    status: "Open",
    initiatedBy: "",
    jdUrl: "",
    supportingDocUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create job");
      router.push("/dashboard/jobs");
    } catch (error) {
      console.error(error);
      alert("Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Create New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="code"
          placeholder="Job Code"
          value={form.code}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="vacancy"
          placeholder="Vacancy"
          value={form.vacancy}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="status"
          placeholder="Status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="initiatedBy"
          placeholder="Initiated By"
          value={form.initiatedBy}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Job"}
        </button>
      </form>
    </div>
  );
}
