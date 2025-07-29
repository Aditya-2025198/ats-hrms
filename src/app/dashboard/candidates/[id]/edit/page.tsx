"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditCandidatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [form, setForm] = useState<any>(null);
  const [resume, setResume] = useState<File | null>(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      const { data } = await supabase.from("candidates").select("*").eq("id", id).single();
      setForm(data);
    };
    if (id) fetchCandidate();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let resumeUrl = form.resume;
    if (resume) {
      const fileName = `${Date.now()}-${resume.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, resume);
      if (!uploadError) {
        resumeUrl = supabase.storage.from("resumes").getPublicUrl(fileName).data.publicUrl;
      }
    }

    const { error } = await supabase.from("candidates").update({ ...form, resume: resumeUrl }).eq("id", id);
    if (!error) router.push("/dashboard/candidates");
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Candidate</h1>
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-lg">
        {["name", "number", "email", "jobCode", "position", "department", "status", "initiatedBy"].map((field) => (
          <Input
            key={field}
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            required
          />
        ))}
        <div>
          <label className="block font-medium mb-1">Resume</label>
          {form.resume && (
            <a href={form.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View Current Resume
            </a>
          )}
          <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files?.[0] || null)} />
        </div>
        <Button type="submit" className="bg-black text-white">Update Candidate</Button>
      </form>
    </div>
  );
}
