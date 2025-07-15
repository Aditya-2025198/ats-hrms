"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type Job = {
  id: number
  title: string
  department: string
  status: "Open" | "Closed"
}

const dummyJobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    status: "Open"
  },
  {
    id: 2,
    title: "Backend Developer",
    department: "Engineering",
    status: "Closed"
  },
  {
    id: 3,
    title: "HR Manager",
    department: "HR",
    status: "Open"
  }
]

export default function JobListPage() {
  const [search, setSearch] = useState("")

  const filtered = dummyJobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.department.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Job Posts</h2>
        <Link href="/dashboard/jobs/new">
          <Button variant="default">+ New Post</Button>
        </Link>
      </div>

      <Input
        placeholder="Search by title or department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="space-y-4">
        {filtered.map((job) => (
          <Card key={job.id} className="border p-4">
            <CardContent className="p-0 space-y-1">
              <div className="text-lg font-medium">{job.title}</div>
              <div className="text-sm text-gray-500">{job.department}</div>
              <div
                className={`text-xs font-semibold mt-1 ${
                  job.status === "Open" ? "text-green-600" : "text-red-600"
                }`}
              >
                Status: {job.status}
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-500 mt-4">No job posts found.</p>
        )}
      </div>
    </div>
  )
}
