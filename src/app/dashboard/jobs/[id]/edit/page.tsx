"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import JobForm from "@/components/jobs/JobForm";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Error fetching job: " + error.message);
        router.push("/dashboard/jobs");
      } else {
        setJob(data);
      }
      setLoading(false);
    };
    if (id) fetchJob();
  }, [id, router]);

  const handleUpdate = async (updatedData: any) => {
    const { error } = await supabase.from("jobs").update(updatedData).eq("id", id);
    if (error) {
      alert("Error updating job: " + error.message);
    } else {
      router.push("/dashboard/jobs");
    }
  };

  if (loading) return <p>Loading job...</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Job</h1>
      <JobForm initialData={job} onSubmit={handleUpdate} submitText="Update Job" />
    </div>
  );
}
