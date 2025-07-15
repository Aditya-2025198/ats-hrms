"use client"

import { useParams } from "next/navigation"
import employeesData from "@/data/employees.json"
import { Card, CardContent } from "@/components/ui/card"

export default function EmployeeDetailPage() {
  const params = useParams()
  const employeeId = parseInt(params.id as string)
  const employee = employeesData.find((e) => e.id === employeeId)

  if (!employee) return <p className="p-6 text-red-500">Employee not found.</p>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Employee Detail</h2>
      <Card className="p-4 space-y-2">
        <CardContent className="space-y-2">
          <div><strong>Name:</strong> {employee.name}</div>
          <div><strong>Email:</strong> {employee.email}</div>
          <div><strong>Department:</strong> {employee.department}</div>
          <div><strong>Role:</strong> {employee.role}</div>
          <div><strong>Status:</strong> {employee.status}</div>
        </CardContent>
      </Card>
    </div>
  )
}
