"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AddCandidatePage() {
  const router = useRouter();
  const [candidate, setCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    jobCode: "",
    status: "Applied",
    initiatedBy: "",
    resume: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setCandidate((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting candidate:", candidate);
    // Add POST request here if backend is connected
    router.push("/dashboard/candidates");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Candidate</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ["Name", "name"],
          ["Email", "email"],
          ["Phone", "phone"],
          ["Position", "position"],
          ["Department", "department"],
          ["Job Code", "jobCode"],
          ["Initiated By", "initiatedBy"]
        ].map(([label, name]) => (
          <div key={name}>
            <Label>{label}</Label>
            <Input name={name} value={(candidate as any)[name]} onChange={handleChange} required />
          </div>
        ))}

        <div>
          <Label>Status</Label>
          <select name="status" value={candidate.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option>Applied</option>
            <option>Screening</option>
            <option>Interviewed</option>
            <option>Offered</option>
            <option>Hired</option>
            <option>Rejected</option>
          </select>
        </div>

        <div>
          <Label>Upload Resume</Label>
          <Input name="resume" type="file" onChange={handleChange} />
        </div>

        <Button type="submit" className="w-full">Add Candidate</Button>
      </form>
    </div>
  );
}
