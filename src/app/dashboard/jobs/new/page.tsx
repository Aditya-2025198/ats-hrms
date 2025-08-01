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
    </div>"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/jobs", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    if (res.ok) {
      router.push("/dashboard/jobs");
    } else {
      alert("Failed to create job");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Create New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Job Title" className="w-full border p-2 rounded" required />
        <input name="code" placeholder="Job Code" className="w-full border p-2 rounded" required />
        <input name="department" placeholder="Department" className="w-full border p-2 rounded" required />
        <textarea name="description" placeholder="Description" className="w-full border p-2 rounded" />
        <input type="number" name="vacancy" placeholder="Vacancy" className="w-full border p-2 rounded" required />
        <select name="status" className="w-full border p-2 rounded">
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <input name="initiatedBy" placeholder="Initiated By" className="w-full border p-2 rounded" />

        <label className="block">Job Description (JD) File</label>
        <input type="file" name="jdFile" className="w-full border p-2 rounded" />

        <label className="block">Supporting Document</label>
        <input type="file" name="supportingDoc" className="w-full border p-2 rounded" />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}

  );
}
