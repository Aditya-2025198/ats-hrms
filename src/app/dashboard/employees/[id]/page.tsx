"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import employeesData from "@/data/employees.json";

export default function EditEmployeePage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeCode: "",
    name: "",
    email: "",
    personalEmail: "",
    contact: "",
    altContact: "",
    department: "",
    role: "",
    designation: "",
    doj: "",
    grade: "",
    pan: "",
    aadhar: "",
    address: "",
    uan: "",
    fatherName: "",
    highestEducation: "",
    location: "",
    nationality: "",
    reportingTo: "",
    status: "Active",
    modeOfSeparation: "",
    lwd: "",
  });

  useEffect(() => {
    const employee = employeesData.find((e) => String(e.id) === id);
    if (employee) {
      setFormData({
        ...formData,
        ...employee,
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Employee:", formData);
    router.push("/dashboard/employees");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Edit Employee</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(formData).map(([key, value]) =>
          key === "doj" ? (
            // Disable editing DOJ
            <Input
              key={key}
              name={key}
              placeholder="Date of Joining"
              value={value}
              disabled
            />
          ) : key !== "modeOfSeparation" && key !== "lwd" ? (
            <Input
              key={key}
              name={key}
              placeholder={key.replace(/([A-Z])/g, " $1")}
              value={value}
              onChange={handleChange}
            />
          ) : null
        )}

        {(formData.status === "Inactive" || formData.status === "Serving Notice") && (
          <>
            <Input
              name="modeOfSeparation"
              placeholder="Mode of Separation"
              value={formData.modeOfSeparation}
              onChange={handleChange}
            />
            <Input
              name="lwd"
              placeholder="Last Working Date"
              value={formData.lwd}
              onChange={handleChange}
            />
          </>
        )}

        <div className="col-span-full">
          <Button type="submit">Update Employee</Button>
        </div>
      </form>
    </div>
  );
}
