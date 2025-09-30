"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

/**
 * Requisition type definition
 */
export interface Requisition {
  notes: string;
  responsibilities: string;
  roles: string;
  skills: string | string[];
  experience: string;
  salary: string;
  id: number;
  requisition_code: string;
  company_id?: string | null;
  client_name?: string | null;
  job_title?: string | null;
  department?: string | null;
  location?: string | null;
  vacancies?: number | null;
  final_status?: string | null;
  created_at: string;
  is_edited?: boolean | null;
  priority?: string | null;
  employment_type?: string | null;
  salary?: string | null;
  experience?: string | null;
  description?: string | null;
  initiated_by?: string | null;
}

export default function RequisitionsPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [orgType, setOrgType] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);

  // Search & filter states
  const [searchText, setSearchText] = useState("");
  const [monthFilter, setMonthFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");

  // Inline edit states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Requisition>>({});

  // Fetch requisitions
  useEffect(() => {
    const fetchProfileAndRequisitions = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          console.warn("No active session found");
          setLoading(false);
          return;
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, company_id, org_type")
          .eq("id", session.user.id)
          .single();

        if (profileError || !profile) {
          console.error("Profile fetch error:", profileError?.message);
          setLoading(false);
          return;
        }

        setOrgType(profile.org_type || null);
        setCompanyId(profile.company_id || null);

        if (!profile.company_id) {
          console.warn("No company_id in profile");
          setLoading(false);
          return;
        }

        // Fetch requisitions
        const { data: reqs, error: reqError } = await supabase
          .from("requisitions")
          .select("*")
          .eq("company_id", profile.company_id)
          .in("final_status", ["pending_dept_head", "approved", "Open"])
          .order("created_at", { ascending: false });

        if (reqError) {
          console.error("Requisitions fetch error:", reqError.message);
        } else {
          setRequisitions((reqs || []) as Requisition[]);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndRequisitions();
  }, [supabase]);

  // Start editing — load all fields into editData
  function handleEdit(req: Requisition) {
    setEditingId(req.id);
    setEditData({ ...req });
  }

  // Save changes
  async function handleSave(id: number) {
    const { error } = await supabase
      .from("requisitions")
      .update({
        ...editData,
        is_edited: true,
      })
      .eq("id", id);

    if (error) {
      alert("Error updating requisition: " + error.message);
      return;
    }

    setRequisitions((prev) =>
      prev.map((req) =>
        req.id === id ? ({ ...req, ...editData, is_edited: true } as Requisition) : req
      )
    );

    setEditingId(null);
    setEditData({});
  }

  // Cancel editing
  function handleCancel() {
    setEditingId(null);
    setEditData({});
  }

  // Apply search and filters
  const filteredRequisitions = requisitions.filter((req) => {
    const matchesSearch =
      req.job_title?.toLowerCase().includes(searchText.toLowerCase()) ||
      req.requisition_code?.toLowerCase().includes(searchText.toLowerCase()) ||
      req.client_name?.toLowerCase().includes(searchText.toLowerCase());

    const matchesMonth =
      monthFilter === "All" ||
      new Date(req.created_at).toLocaleString("default", { month: "long" }) === monthFilter;

    const matchesPriority =
      priorityFilter === "All" || req.priority === priorityFilter;

    return matchesSearch && matchesMonth && matchesPriority;
  });

  if (loading) return <p>Loading requisitions...</p>;
  if (!orgType) return <p>No org type found. Please contact admin.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Requisitions</h1>

      <div className="flex items-center justify-between gap-4 mb-4">
        <Link
          href={
            orgType === "company"
              ? "/dashboard/ats/requisitions/company-new"
              : "/dashboard/ats/requisitions/consultancy-new"
          }
          className={`px-4 py-2 ${
            orgType === "company"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          } text-white rounded-lg shadow`}
        >
          + New Requisition
        </Link>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by title, code, or client"
          className="border rounded-lg p-2 w-72 focus:ring-2 focus:ring-blue-500"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        {/* Month Filter */}
        <select
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        >
          <option value="All">All Months</option>
          {Array.from({ length: 12 }).map((_, i) => {
            const monthName = new Date(0, i).toLocaleString("default", { month: "long" });
            return (
              <option key={i} value={monthName}>
                {monthName}
              </option>
            );
          })}
        </select>

        {/* Priority Filter */}
        <select
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="mt-6">
        {filteredRequisitions.length === 0 ? (
          <p className="text-center text-gray-500">No requisitions found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRequisitions.map((req) => (
              <div
                key={req.id}
                className="border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 bg-white p-5 relative"
              >
                {/* Edited Badge */}
                {req.is_edited && (
                  <span className="absolute top-3 right-3 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full shadow">
                    Edited
                  </span>
                )}

                {/* Header Section */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 whitespace-nowrap">
                      {req.job_title || "Untitled Role"}
                    </h2>
                    <p className="text-sm text-gray-500 whitespace-nowrap">
                      Req Code: <span className="font-medium">{req.requisition_code}</span>
                    </p>
                  </div>
                  {/* Client Name Badge centered */}
                  <div className="w-full flex justify-center mt-2">
                    <span className="inline-block px-3 py-1 text-m rounded-full font-bold bg-gray-100 text-gray-800">
                      {req.client_name || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Editable Form */}
                {editingId === req.id ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Job Title</label>
                      <input
                        type="text"
                        className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        value={String(editData.job_title ?? "")}
                        onChange={(e) =>
                          setEditData({ ...editData, job_title: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department</label>
                      <input
                        type="text"
                        className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        value={String(editData.department ?? "")}
                        onChange={(e) =>
                          setEditData({ ...editData, department: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        value={String(editData.location ?? "")}
                        onChange={(e) =>
                          setEditData({ ...editData, location: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Vacancies</label>
                      <input
                        type="number"
                        className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        value={Number(editData.vacancies ?? 0)}
                        onChange={(e) =>
                          setEditData({ ...editData, vacancies: Number(e.target.value) })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priority</label>
                      <select
                        className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        value={String(editData.priority ?? "")}
                        onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                      >
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                      <input
                        type="text"
                        className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        value={String(editData.salary ?? "")}
                        onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience</label>
                      <input
                        type="text"
                        className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        value={String(editData.experience ?? "")}
                        onChange={(e) =>
                          setEditData({ ...editData, experience: e.target.value })
                        }
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Roles</label>
                      <textarea
                        className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        value={String(editData.roles ?? "")}
                        onChange={(e) => setEditData({ ...editData, roles: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Department:</span> {req.department ?? "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span> {req.location ?? "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Vacancies:</span> {req.vacancies ?? "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Priority:</span> {req.priority ?? "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Salary:</span> {req.salary ?? "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Experience:</span> {req.experience ?? "N/A"}
                    </p>
                    <p className="col-span-2">
                      <span className="font-medium">Skills:</span>{" "}
                      {Array.isArray(req.skills) ? req.skills.join(", ") : req.skills || "N/A"}
                    </p>
                    <p className="col-span-2">
                      <span className="font-medium">Description:</span> {req.notes || "No description provided"}
                    </p>
                    <p className="col-span-2">
                      <span className="font-medium">Job Role:</span> {req.roles || "No job role provided"}
                    </p>
                    <p className="col-span-2">
                      <span className="font-medium">Responsibility:</span> {req.responsibilities || "No responsibilities provided"}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Created: {new Date(req.created_at).toLocaleString()}
                  </p>
                  {editingId === req.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(req.id)}
                        className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-1.5 bg-gray-400 text-white text-sm rounded-lg hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(req)}
                      className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
