"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function NewJobPostPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [status, setStatus] = useState("Open")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Save to database or file
    console.log({
      title,
      department,
      status,
    })

    alert("Job posted (mock save). Redirecting...")
    router.push("/dashboard/jobs")
  }

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h2 className="text-2xl font-semibold">New Job Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label>Job Title</Label>
          <Input
            placeholder="e.g. Frontend Developer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <Label>Department</Label>
          <Input
            placeholder="e.g. Engineering"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          Post Job
        </Button>
      </form>
    </div>
  )
}
