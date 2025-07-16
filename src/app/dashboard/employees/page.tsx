"use client"

import Link from "next/link"
import { useState } from "react"
import employeesData from "@/data/employees.json"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Employee = {
  id: number
  name: string
  email: string
  department: string
  role: string
  status: string // 👈 made this less strict to allow "active"/"inactive" from JSON
}

const statuses = ["All", "Active", "Inactive"]

export default function EmployeesPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")

  const filtered = employeesData.filter((e: Employee) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase())

    const normalizedStatus = e.status.toLowerCase() === "active" ? "Active" :
                             e.status.toLowerCase() === "inactive" ? "Inactive" :
                             e.status

    const matchStatus = filter === "All" || normalizedStatus === filter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Employees</h2>
        <Link href="/dashboard/employees/new">
          <Button>Add New Employee</Button>
        </Link>
        <a
          href="/api/employees/export"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download Excel
        </a>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Input
          placeholder="Search by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />

        <div className="flex gap-2 flex-wrap">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-sm rounded border ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((e: Employee) => {
          const normalizedStatus = e.status.toLowerCase() === "active" ? "Active" :
                                   e.status.toLowerCase() === "inactive" ? "Inactive" :
                                   e.status

          return (
            <Card key={e.id} className="border p-4">
              <CardContent className="p-0 space-y-1">
                <div className="text-lg font-medium">{e.name}</div>
                <div className="text-sm text-gray-500">{e.email}</div>
                <div className="text-sm">
                  {e.department} - {e.role}
                </div>
                <div
                  className={`text-xs font-semibold mt-1 ${
                    normalizedStatus === "Active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Status: {normalizedStatus}
                </div>
                <Link
                  href={`/dashboard/employees/${e.id}/edit`}
                  className="text-blue-600 text-sm underline mt-2 inline-block"
                >
                  Edit
                </Link>
              </CardContent>
            </Card>
          )
        })}

        {filtered.length === 0 && (
          <p className="text-gray-500 mt-4">No employees found.</p>
        )}
      </div>
    </div>
  )
}
