"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NewJobPostPage() {
  const router = useRouter();

  const [job, setJob] = useState({
    title: "",
    jobCode: "",
    date: new Date().toISOString().split("T")[0],
    department: "",
    vacancy: "",
    status: "Open",
    initiatedBy: "",
    jd: "",
    supportingDoc: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setJob({ ...job, [name]: files[0].name });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Job Post:", job);
    // Future: Send job to DB or API here
    router.push("/dashboard/jobs");
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-blue-900">New Job Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input id="title" name="title" value={job.title} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="jobCode">Job Code</Label>
          <Input id="jobCode" name="jobCode" value={job.jobCode} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="department">Department</Label>
          <Input id="department" name="department" value={job.department} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="vacancy">Vacancy</Label>
          <Input id="vacancy" name="vacancy" type="number" value={job.vacancy} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="initiatedBy">Initiated By</Label>
          <Input id="initiatedBy" name="initiatedBy" value={job.initiatedBy} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            value={job.status}
            onChange={handleChange}
            className="w-full border rounded px-2 py-2"
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Hold">Hold</option>
          </select>
        </div>

        <div>
          <Label htmlFor="jd">Upload JD</Label>
          <Input id="jd" name="jd" type="file" onChange={handleFileChange} />
        </div>

        <div>
          <Label htmlFor="supportingDoc">Upload Supporting Document</Label>
          <Input id="supportingDoc" name="supportingDoc" type="file" onChange={handleFileChange} />
        </div>

        <Button type="submit" className="w-full">
          Post Job
        </Button>
      </form>
    </Card>
  );
}
