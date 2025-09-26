"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

type FormState = {
  job_title: string;
  department: string;
  location: string;
  employment_type: string;
  openings: string; // keep as string for input
  priority: string;
  needed_by?: string;

  job_description: string;
  responsibilities?: string;
  skills?: string; // comma-separated
  experience?: string;
  education?: string;

  currency: string;
  salary_type: string;
  salary_min?: string;
  salary_max?: string;
  budget_notes?: string;

  // Approvals
  dept_head_id?: string | null;
  dept_head_email?: string;
  md_id?: string | null;
  md_email?: string;
  approver_message?: string;

  // Internals
  type: "company";
};

export default function CompanyRequisitionForm() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"draft" | "send" | null>(null);
  const [error, setError] = useState<string>("");

  const [userId, setUserId] = useState<string | null>(null);
  const [departments, setDepartments] = useState<string[]>([
    "IT",
    "HR",
    "Finance",
    "Sales",
    "Operations",
  ]);
  const [form, setForm] = useState<FormState>({
    job_title: "",
    department: "",
    location: "",
    employment_type: "",
    openings: "1",
    priority: "Medium",
    needed_by: "",

    job_description: "",
    responsibilities: "",
    skills: "",
    experience: "",
    education: "",

    currency: "USD",
    salary_type: "CTC",
    salary_min: "",
    salary_max: "",
    budget_notes: "",

    dept_head_id: null,
    dept_head_email: "",
    md_id: null,
    md_email: "",
    approver_message: "",

    type: "company",
  });

  // Helpers
  const skillsArray = useMemo(
    () =>
      form.skills
        ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    [form.skills]
  );

  const setField = (key: keyof FormState, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    (async () => {
      const { data: sessionRes } = await supabase.auth.getSession();
      const uid = sessionRes.session?.user?.id ?? null;
      if (!uid) {
        router.push("/login");
        return;
      }
      setUserId(uid);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-detect approvers whenever department changes
  useEffect(() => {
    if (!form.department) return;

    (async () => {
      const { data: head } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("role", "dept_head")
        .eq("department", form.department)
        .limit(1)
        .maybeSingle();

      if (head) {
        setField("dept_head_id", head.id);
        setField("dept_head_email", head.email);
      } else {
        setField("dept_head_id", null);
      }

      const { data: md } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("role", "md")
        .limit(1)
        .maybeSingle();

      if (md) {
        setField("md_id", md.id);
        setField("md_email", md.email);
      } else {
        setField("md_id", null);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.department]);

  const validate = (action: "draft" | "send") => {
    if (!form.job_title) return "Job Title is required.";
    if (!form.department) return "Department is required.";
    if (!form.openings || Number(form.openings) < 1)
      return "Openings must be at least 1.";
    if (!form.job_description) return "Job Description is required.";

    if (
      form.salary_min &&
      form.salary_max &&
      Number(form.salary_max) < Number(form.salary_min)
    ) {
      return "Salary max must be greater than or equal to salary min.";
    }

    if (action === "send") {
      const hasDeptHead =
        (form.dept_head_id && form.dept_head_id.length > 0) ||
        (form.dept_head_email && form.dept_head_email.length > 0);
      const hasMD =
        (form.md_id && form.md_id.length > 0) ||
        (form.md_email && form.md_email.length > 0);

      if (!hasDeptHead)
        return "Department Head is required (auto-detected or enter email).";
      if (!hasMD) return "MD is required (auto-detected or enter email).";
    }

    return null;
  };

  const submit = async (action: "draft" | "send") => {
    setError("");
    const v = validate(action);
    if (v) {
      setError(v);
      return;
    }

    if (!userId) {
      setError("No user session found.");
      return;
    }

    setSaving(action);

    const payload: any = {
      type: "company",
      title: form.job_title,
      department: form.department,
      location: form.location,
      employment_type: form.employment_type || null,
      openings: Number(form.openings),
      priority: form.priority,
      needed_by: form.needed_by || null,

      job_description: form.job_description,
      responsibilities: form.responsibilities || null,
      skills: skillsArray.length ? skillsArray : null,
      experience: form.experience || null,
      education: form.education || null,

      currency: form.currency,
      salary_type: form.salary_type,
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      budget_notes: form.budget_notes || null,

      raised_by: userId,

      // Workflow
      final_status: action === "draft" ? "draft" : "pending_dept_head",

      // Approvals placeholders
      dept_head_id: form.dept_head_id,
      dept_head_email: form.dept_head_email || null,
      dept_head_status: "pending",
      dept_head_remarks: null,

      md_id: form.md_id,
      md_email: form.md_email || null,
      md_status: "pending",
      md_remarks: null,

      approver_message: form.approver_message || null,
    };

    const { error: insertErr } = await supabase
      .from("requisitions")
      .insert([payload]);

    if (insertErr) {
      console.error("Insert failed:", insertErr);
      setError(
        insertErr.details ||
          insertErr.message ||
          "Failed to create requisition."
      );
    } else {
      router.push("/dashboard/requisitions");
    }

    setSaving(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6">New Requisition</h1>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Basics */}
      <section className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold">Basics</h2>
        <input
          className="w-full p-2 border rounded"
          placeholder="Job Title *"
          value={form.job_title}
          onChange={(e) => setField("job_title", e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="w-full p-2 border rounded"
            value={form.department}
            onChange={(e) => setField("department", e.target.value)}
          >
            <option value="">Select Department *</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            className="w-full p-2 border rounded"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setField("location", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="w-full p-2 border rounded"
            value={form.employment_type}
            onChange={(e) => setField("employment_type", e.target.value)}
          >
            <option value="">Employment Type</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>

          <input
            type="number"
            min={1}
            className="w-full p-2 border rounded"
            placeholder="Openings *"
            value={form.openings}
            onChange={(e) => setField("openings", e.target.value)}
          />

          <select
            className="w-full p-2 border rounded"
            value={form.priority}
            onChange={(e) => setField("priority", e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <input
          type="date"
          className="w-full p-2 border rounded"
          value={form.needed_by}
          onChange={(e) => setField("needed_by", e.target.value)}
        />
      </section>

      {/* Role Details */}
      <section className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold">Role Details</h2>
        <textarea
          className="w-full p-2 border rounded min-h-[120px]"
          placeholder="Job Description *"
          value={form.job_description}
          onChange={(e) => setField("job_description", e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded min-h-[80px]"
          placeholder="Responsibilities (optional)"
          value={form.responsibilities}
          onChange={(e) => setField("responsibilities", e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Required Skills (comma separated)"
          value={form.skills}
          onChange={(e) => setField("skills", e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="w-full p-2 border rounded"
            placeholder="Experience"
            value={form.experience}
            onChange={(e) => setField("experience", e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Education"
            value={form.education}
            onChange={(e) => setField("education", e.target.value)}
          />
        </div>
      </section>

      {/* Salary / Budget */}
      <section className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold">Salary / Budget</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            className="w-full p-2 border rounded"
            placeholder="Currency"
            value={form.currency}
            onChange={(e) => setField("currency", e.target.value)}
          />
          <select
            className="w-full p-2 border rounded"
            value={form.salary_type}
            onChange={(e) => setField("salary_type", e.target.value)}
          >
            <option value="CTC">CTC</option>
            <option value="Monthly">Monthly</option>
            <option value="Hourly">Hourly</option>
          </select>
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Min"
            value={form.salary_min}
            onChange={(e) => setField("salary_min", e.target.value)}
          />
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Max"
            value={form.salary_max}
            onChange={(e) => setField("salary_max", e.target.value)}
          />
        </div>
        <textarea
          className="w-full p-2 border rounded min-h-[80px]"
          placeholder="Budget Notes"
          value={form.budget_notes}
          onChange={(e) => setField("budget_notes", e.target.value)}
        />
      </section>

      {/* Approvals */}
      <section className="space-y-3 mb-8">
        <h2 className="text-lg font-semibold">Approvals</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Department Head (auto)
            </label>
            <input
              className="w-full p-2 border rounded bg-gray-50"
              placeholder="Auto-selected"
              value={form.dept_head_id ? form.dept_head_email : ""}
              readOnly
            />
          </div>
          {!form.dept_head_id && (
            <input
              className="w-full p-2 border rounded"
              placeholder="Approver Email (Dept Head)"
              value={form.dept_head_email}
              onChange={(e) => setField("dept_head_email", e.target.value)}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm text-gray-600 mb-1">MD (auto)</label>
            <input
              className="w-full p-2 border rounded bg-gray-50"
              placeholder="Auto-selected"
              value={form.md_id ? form.md_email : ""}
              readOnly
            />
          </div>
          {!form.md_id && (
            <input
              className="w-full p-2 border rounded"
              placeholder="MD Email"
              value={form.md_email}
              onChange={(e) => setField("md_email", e.target.value)}
            />
          )}
        </div>

        <textarea
          className="w-full p-2 border rounded min-h-[80px]"
          placeholder="Message to approvers (optional)"
          value={form.approver_message}
          onChange={(e) => setField("approver_message", e.target.value)}
        />
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => submit("draft")}
          disabled={!!saving}
          className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
        >
          {saving === "draft" ? "Saving…" : "Save Draft"}
        </button>
        <button
          type="button"
          onClick={() => submit("send")}
          disabled={!!saving}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {saving === "send" ? "Sending…" : "Send for Approval"}
        </button>
      </div>
    </div>
  );
}
