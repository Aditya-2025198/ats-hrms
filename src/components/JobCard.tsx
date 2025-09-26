"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    jobCode: string;
    createdAt: string;
    title: string;
    department: string;
    vacancies: number;
    location: string;
    salaryRange: string;
    roles?: string;
    skills?: string;
    status: string;
  };
  onUpdate: (updatedJob: any) => void;
}

export default function JobCard({ job, onUpdate }: JobCardProps) {
  const [roles, setRoles] = useState(job.roles || "");
  const [skills, setSkills] = useState(job.skills || "");
  const [status, setStatus] = useState(job.status || "open");

  const handleSave = () => {
    const updatedJob = {
      ...job,
      roles,
      skills,
      status,
    };
    onUpdate(updatedJob);
  };

  return (
    <Card className="p-4 shadow-lg rounded-2xl border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          {job.title} <span className="text-sm text-gray-500">({job.jobCode})</span>
        </CardTitle>
        <p className="text-xs text-gray-500">Created on: {new Date(job.createdAt).toLocaleDateString()}</p>
      </CardHeader>

      <CardContent className="grid gap-3">
        {/* Static fields */}
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Department:</strong> {job.department}</p>
          <p><strong>No. of Vacancies:</strong> {job.vacancies}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Salary Range:</strong> {job.salaryRange}</p>
        </div>

        {/* Editable fields */}
        <div>
          <label className="block text-sm font-medium mb-1">Roles</label>
          <Input
            value={roles}
            onChange={(e) => setRoles(e.target.value)}
            placeholder="Enter roles..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Skills</label>
          <Input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Enter required skills..."
          />
        </div>

        {/* JD Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload JD</label>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload JD
          </Button>
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="hold">Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
