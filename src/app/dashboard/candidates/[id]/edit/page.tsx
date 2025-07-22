"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function EditCandidatePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [candidate, setCandidate] = useState<any>(null);

  useEffect(() => {
    // Replace with API call: fetch(`/api/candidates/${id}`)
    const mockCandidate = {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "9876543210",
      position: "Product Manager",
      department: "Product",
      jobCode: "013",
      status: "Interviewed",
      initiatedBy: "Arjun",
    };
    setCandidate(mockCandidate);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setCandidate((prev: any) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated candidate:", candidate);
    // PUT or PATCH request to update candidate
    router.push("/dashboard/candidates");
  };

  if (!candidate) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Candidate</h2>
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
          <Label>Upload New Resume</Label>
          <Input name="resume" type="file" onChange={handleChange} />
        </div>

        <Button type="submit" className="w-full">Update Candidate</Button>
      </form>
    </div>
  );
}
