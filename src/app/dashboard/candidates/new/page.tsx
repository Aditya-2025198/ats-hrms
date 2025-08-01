"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function NewCandidatePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<{ code: string; title: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    jobCode: "",
    position: "",
    department: "",
    status: "Applied",
    date: new Date().toISOString().split("T")[0],
    initiatedBy: "",
    resume: null as File | null,
  });

  // Fetch jobs for dropdown
  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase.from("jobs").select("code, title");
      if (!error && data) setJobs(data);
    };
    fetchJobs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, resume: e.target.files?.[0] || null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in.");
      setLoading(false);
      return;
    }

    let resumeUrl = null;
    if (formData.resume) {
      const path = `resumes/${user.user_metadata.company_id}/${Date.now()}-${formData.resume.name}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(path, formData.resume, { upsert: true });
      if (uploadError) {
        alert("Error uploading resume!");
        setLoading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from("resumes").getPublicUrl(path);
      resumeUrl = publicUrl;
    }

    const { error } = await supabase.from("candidates").insert([
      {
        ...formData,
        resume: resumeUrl,
        company_id: user.user_metadata.company_id,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Error adding candidate.");
    } else {
      router.push("/dashboard/candidates");
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Add New Candidate</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input name="number" value={formData.number} onChange={handleChange} />
        </div>
        <div>
          <Label>Job Code</Label>
          <select
            name="jobCode"
            value={formData.jobCode}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          >
            <option value="">Select Job</option>
            {jobs.map((job) => (
              <option key={job.code} value={job.code}>
                {job.code} - {job.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Position</Label>
          <Input name="position" value={formData.position} onChange={handleChange} />
        </div>
        <div>
          <Label>Department</Label>
          <Input name="department" value={formData.department} onChange={handleChange} />
        </div>
        <div>
          <Label>Status</Label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          >
            {["Applied", "Interviewed", "Offered", "Hired", "Rejected"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" name="date" value={formData.date} onChange={handleChange} />
        </div>
        <div>
          <Label>Initiated By</Label>
          <Input name="initiatedBy" value={formData.initiatedBy} onChange={handleChange} />
        </div>
        <div>
          <Label>Resume</Label>
          <Input type="file" onChange={handleFileChange} />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Candidate"}
        </Button>
      </form>
    </Card>
  );
}
