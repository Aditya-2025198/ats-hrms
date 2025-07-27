"use client";
import EmployeeForm from "@/components/EmployeeForm";
import { useRouter } from "next/navigation";

export default function AddEmployeePage() {
  const router = useRouter();

  const handleAdd = (data: any) => {
    // Save new employee (currently in memory, later DB)
    console.log("New Employee:", data);
    router.push("/dashboard/hrms/employees");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Employee</h1>
      <EmployeeForm onSubmit={handleAdd} />
    </div>
  );
}
