"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function NewEmployeePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
    status: "Active",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New employee submitted:", form)
    // 🚧 TODO: Save to DB or localStorage
    router.push("/dashboard/employees")
  }

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h2 className="text-2xl font-semibold">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <Label>Department</Label>
          <Input name="department" value={form.department} onChange={handleChange} required />
        </div>
        <div>
          <Label>Role</Label>
          <Input name="role" value={form.role} onChange={handleChange} required />
        </div>

        <div className="pt-2">
          <Button type="submit">Save Employee</Button>
        </div>
      </form>
    </div>
  )
}
