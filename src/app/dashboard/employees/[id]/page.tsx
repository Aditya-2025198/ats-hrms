"use client"

import { useParams, useRouter } from "next/navigation"
import employeesData from "@/data/employees.json"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function EditEmployeePage() {
  const params = useParams()
  const router = useRouter()

  // ✅ Safely parse and check employeeId
  const employeeId = typeof params?.id === "string" ? parseInt(params.id) : null

  if (!employeeId) {
    return <p className="p-6 text-red-500">Invalid employee ID.</p>
  }

  const employee = employeesData.find((e) => e.id === employeeId)

  if (!employee) {
    return <p className="p-6 text-red-500">Employee not found.</p>
  }

  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    department: employee.department,
    role: employee.role,
    status: employee.status,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert("Changes saved (demo only)")
    router.push("/dashboard/employees")
  }

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-2xl font-semibold mb-4">Edit Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <Input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <Input
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Department"
        />
        <Input
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
        />
        <Input
          name="status"
          value={formData.status}
          onChange={handleChange}
          placeholder="Status (Active/Inactive)"
        />
        <Button type="submit">Save</Button>
      </form>
    </div>
  )
}
