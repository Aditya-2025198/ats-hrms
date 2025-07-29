"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddCandidatePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    number: "",
    email: "",
    jobCode: "",
    position: "",
    department: "",
    status: "Applied",
    date: new Date().toISOString().split("T")[0],
    initiatedBy: "",
  });
  const [resume, setResume] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let resumeUrl = null;
    if (resume) {
      const fileName = `${Date.now()}-${resume.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, resume);
      if (uploadError) {
        alert("Resume upload failed!");
        return;
      }
      resumeUrl = supabase.storage.from("resumes").getPublicUrl(fileName).data.publicUrl;
    }

    const { error } = await supabase.from("candidates").insert([
      { ...form, resume: resumeUrl, company_id: user.user_metadata.company_id },
    ]);
    if (!error) router.push("/dashboard/candidates");
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Add New Candidate</h1>
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-lg">
        {["name", "number", "email", "jobCode", "position", "department", "initiatedBy"].map((field) => (
          <Input
            key={field}
            name={field}
            placeholder={field}
            value={(form as any)[field]}
            onChange={handleChange}
            required
          />
        ))}
        <div>
          <label className="block font-medium mb-1">Resume</label>
          <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files?.[0] || null)} />
        </div>
        <Button type="submit" className="bg-black text-white">Save Candidate</Button>
      </form>
    </div>
  );
}
