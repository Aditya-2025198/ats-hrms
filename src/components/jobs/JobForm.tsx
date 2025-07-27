"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type JobFormProps = {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  submitText?: string;
};

export default function JobForm({
  initialData = {},
  onSubmit,
  submitText = "Save",
}: JobFormProps) {
  const [form, setForm] = useState({
    job_code: initialData.job_code || "",
    title: initialData.title || "",
    department: initialData.department || "",
    location: initialData.location || "",
    description: initialData.description || "",
    status: initialData.status || "Open",
    posted_on: initialData.posted_on || new Date().toISOString().split("T")[0],
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {["job_code", "title", "department", "location"].map((field) => (
        <div key={field}>
          <Label htmlFor={field}>{field.replace("_", " ").toUpperCase()}</Label>
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
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          className="w-full border rounded p-2"
          rows={4}
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label>Status</Label>
        <Input name="status" value={form.status} onChange={handleChange} />
      </div>
      <div>
        <Label>Posted On</Label>
        <Input type="date" name="posted_on" value={form.posted_on} onChange={handleChange} />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : submitText}
      </Button>
    </form>
  );
}
