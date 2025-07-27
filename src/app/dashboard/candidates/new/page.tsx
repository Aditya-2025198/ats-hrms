"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("candidates").insert([
      {
        ...form,
        company_id: user.user_metadata.company_id,
      },
    ]);

    setLoading(false);
    if (error) {
      alert("Error adding candidate: " + error.message);
    } else {
      router.push("/dashboard/candidates");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Add New Candidate</h1>
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
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Candidate"}
        </Button>
      </form>
    </div>
  );
}
