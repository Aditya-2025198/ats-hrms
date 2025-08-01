"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function EditCandidatePage() {
  const router = useRouter();
  const params = useParams();
  const candidateId = params?.id as string;

  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const companyId = user.user_metadata.company_id;
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", candidateId)
        .eq("company_id", companyId)
        .single();

      if (error || !data) {
        alert("Candidate not found or you don't have access.");
        router.push("/dashboard/candidates");
        return;
      }

      setCandidate(data);
      setLoading(false);
    };
    if (candidateId) fetchCandidate();
  }, [candidateId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
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

    let resumeUrl = candidate.resume;
    if (resumeFile) {
      const path = `resumes/${candidate.company_id}/${Date.now()}-${resumeFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(path, resumeFile, { upsert: true });
      if (uploadError) {
        alert("Error uploading resume!");
        setLoading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from("resumes").getPublicUrl(path);
      resumeUrl = publicUrl;
    }

    const { error } = await supabase
      .from("candidates")
      .update({ ...candidate, resume: resumeUrl })
      .eq("id", candidateId)
      .eq("company_id", user.user_metadata.company_id);

    setLoading(false);

    if (error) {
      alert("Error updating candidate.");
    } else {
      router.push("/dashboard/candidates");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!candidate) return <p>Candidate not found.</p>;

  return (
    <Card className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Edit Candidate</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input name="name" value={candidate.name} onChange={handleChange} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input name="email" value={candidate.email} onChange={handleChange} />
        </div>
        <div>
          <Label>Phone</Label>
          <Input name="number" value={candidate.number} onChange={handleChange} />
        </div>
        <div>
          <Label>Position</Label>
          <Input name="position" value={candidate.position} onChange={handleChange} />
        </div>
        <div>
          <Label>Department</Label>
          <Input name="department" value={candidate.department} onChange={handleChange} />
        </div>
        <div>
          <Label>Status</Label>
          <select
            name="status"
            value={candidate.status}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          >
            {["Applied", "Interviewed", "Offered", "Hired", "Rejected"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Resume</Label>
          {candidate.resume && (
            <a href={candidate.resume} target="_blank" className="text-blue-600 underline block">
              View Current Resume
            </a>
          )}
          <Input type="file" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Update Candidate"}
        </Button>
      </form>
    </Card>
  );
}
