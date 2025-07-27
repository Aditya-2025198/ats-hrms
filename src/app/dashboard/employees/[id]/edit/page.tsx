"use client";
import { useParams, useRouter } from "next/navigation";
import EmployeeForm from "@/components/EmployeeForm";
import { useEffect, useState } from "react";

export default function EditEmployeePage() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    // Fetch the employee (replace with real API call later)
    const demoData = {
      id,
      employeeCode: "E001",
      name: "John Doe",
      department: "HR",
      designation: "Manager",
      profileImage: "/default-avatar.png", // Preloaded image
    };
    setEmployee(demoData);
  }, [id]);

  const handleUpdate = (data: any) => {
    console.log("Updated Employee:", data);
    router.push("/dashboard/hrms/employees");
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Employee</h1>
      <EmployeeForm initialData={employee} onSubmit={handleUpdate} />
    </div>
  );
}
