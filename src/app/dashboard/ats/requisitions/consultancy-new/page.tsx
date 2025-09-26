"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConsultancyRequisitionForm() {
  const supabase = createClient();
  const router = useRouter();

  const [form, setForm] = useState({
    clientName: "",
    jobTitle: "",
    department: "",
    vacancies: "",
    location: "",
    skills: "",
    experience: "",
    salary: "",
    roles: "",
    responsibilities: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

      const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", session.user.id)
    .single();

  if (profileError || !profile?.company_id) {
    console.error("Profile fetch error:", profileError?.message);
    alert("Failed to get company ID.");
    setLoading(false);
    return;
  }
    const skillsArray = form.skills
     .split(",")
     .map((skill) => skill.trim())
     .filter(Boolean);

     console.log("Final Skills Array:", skillsArray, typeof skillsArray);
    // Insert into Supabase
    const { error } = await supabase.from("requisitions").insert([
      {
        type: "consultancy",
        raised_by: session.user.id,
        client_name: form.clientName,
        job_title: form.jobTitle,
        department: form.department,
        vacancies: parseInt(form.vacancies),
        location: form.location,
        skills: skillsArray,
        experience: form.experience,
        salary: form.salary,
        roles: form.roles,
        responsibilities: form.responsibilities,
        notes: form.notes,
        final_status: "pending_dept_head", // approval flow
        dept_head_status: "pending",
        md_status: "pending",
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error inserting requisition:", error.message);
      alert("Failed to save requisition.");
    } else {
      alert("Requisition created successfully!");
      router.push("/dashboard/ats/requisitions");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>New Requisition</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="clientName"
              placeholder="Client Name"
              value={form.clientName}
              onChange={handleChange}
              required
            />
            <Input
              name="jobTitle"
              placeholder="Job Title"
              value={form.jobTitle}
              onChange={handleChange}
              required
            />
            <Input
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
            />
            <Input
              type="number"
              name="vacancies"
              placeholder="No. of Vacancies"
              value={form.vacancies}
              onChange={handleChange}
            />
            <Input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />
            <Input
              name="skills"
              placeholder="Skills (comma separated)"
              value={form.skills}
              onChange={handleChange}
            />
            <Input
              name="experience"
              placeholder="Experience Required"
              value={form.experience}
              onChange={handleChange}
            />
            <Input
              name="salary"
              placeholder="Salary Range"
              value={form.salary}
              onChange={handleChange}
            />

            {/* New fields */}
            <Textarea
              name="roles"
              placeholder="Roles"
              value={form.roles}
              onChange={handleChange}
            />
            <Textarea
              name="responsibilities"
              placeholder="Responsibilities"
              value={form.responsibilities}
              onChange={handleChange}
            />

            <Textarea
              name="notes"
              placeholder="Additional Notes"
              value={form.notes}
              onChange={handleChange}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Create Requisition"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
