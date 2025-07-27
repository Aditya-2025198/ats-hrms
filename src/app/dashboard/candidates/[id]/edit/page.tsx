"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EditCandidatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState({
    name: "",
    number: "",
    email: "",
    jobCode: "",
    position: "",
    department: "",
    status: "Applied",
    date: "",
    initiatedBy: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch candidate data
  useEffect(() => {
    const fetchCandidate = async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Error fetching candidate: " + error.message);
        router.push("/dashboard/candidates");
      } else if (data) {
        setForm({
          name: data.name || "",
          number: data.number || "",
          email: data.email || "",
          jobCode: data.jobCode || "",
          position: data.position || "",
          department: data.department || "",
          status: data.status || "Applied",
          date: data.date || new Date().toISOString().split("T")[0],
          initiatedBy: data.initiatedBy || "",
        });
      }
      setLoading(false);
    };
    if (id) fetchCandidate();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("candidates")
      .update({ ...form })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert("Error updating candidate: " + error.message);
    } else {
      router.push("/dashboard/candidates");
    }
  };

  if (loading) return <p>Loading candidate...</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Candidate</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "number", "email", "jobCode", "position", "department", "initiatedBy"].map((field) => (
          <div key={field}>
            <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
            <Input
              id={field}
              name={field}
              value={(form as any)[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <div>
          <Label>Status</Label>
          <Input name="status" value={form.status} onChange={handleChange} />
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" name="date" value={form.date} onChange={handleChange} />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Candidate"}
        </Button>
      </form>
    </div>
  );
}
