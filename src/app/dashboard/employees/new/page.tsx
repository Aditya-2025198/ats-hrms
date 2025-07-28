"use client";
import EmployeeForm from "@/components/EmployeeForm";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AddEmployeePage() {
  const router = useRouter();

  const handleAdd = async (data: any) => {
    // Get current logged-in user to attach company_id
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in");
      return;
    }

    const { error } = await supabase.from("employees").insert([
      {
        ...data,
        company_id: user.user_metadata.company_id, // attach company
      },
    ]);

    if (error) {
      console.error(error);
      alert("Failed to add employee");
    } else {
      router.push("/dashboard/employees"); // Go back to employee list
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Employee</h1>
      <EmployeeForm onSubmit={handleAdd} />
    </div>
  );
}
