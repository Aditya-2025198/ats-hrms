"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import employeesData from "@/data/employees.json"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function EditEmployeePage() {
  const params = useParams()
  const router = useRouter()

  const employeeId =
    typeof params?.id === "string" ? parseInt(params.id) : null

  if (!employeeId) {
    return <p className="p-6 text-red-500">Invalid employee ID.</p>
  }

  const employee = employeesData.find((e) => e.id === employeeId)

  if (!employee) {
    return <p className="p-6 text-red-500">Employee not found.</p>
  }

  const [form, setForm] = useState({
    name: employee.name,
    email: employee.email,
    department: employee.department,
    role: employee.role,
    status: employee.status,
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log("Updated Employee:", { id: employeeId, ...form })
    alert("Changes saved locally (not persistent).")
    router.push("/dashboard/employees")
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Edit Employee</h2>
      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div>
            <Label>Department</Label>
            <Input
              value={form.department}
              onChange={(e) => handleChange("department", e.target.value)}
            />
          </div>

          <div>
            <Label>Role</Label>
            <Input
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(val) => handleChange("status", val)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
