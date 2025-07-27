"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import JobForm from "@/components/jobs/JobForm";

export default function NewJobPage() {
  const router = useRouter();

  const handleCreate = async (data: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("jobs")
      .insert({ ...data, company_id: user.user_metadata.company_id });

    if (error) {
      alert("Error creating job: " + error.message);
    } else {
      router.push("/dashboard/jobs");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Add New Job</h1>
      <JobForm onSubmit={handleCreate} submitText="Create Job" />
    </div>
  );
}
