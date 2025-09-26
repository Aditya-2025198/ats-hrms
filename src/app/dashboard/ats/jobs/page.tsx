"use client";

import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { createClient } from "@/lib/supabaseClient";
import {
  MapPin,
  DollarSign,
  Users,
  Briefcase,
  ChevronDown,
  X,
} from "lucide-react";

export default function JobsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [formData, setFormData] = useState({
    job_title: "",
    department: "",
    location: "",
    salary: "",
    vacancies: 0,
    skills: "",
    roles: "",
    responsibilities: "",
    status: "Open",
  });

  const [search, setSearch] = useState(""); // Search input
  const [statusFilter, setStatusFilter] = useState("All"); // Status filter

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const userId = session.user.id;
        const { data: profile } = await supabase
          .from("profiles")
          .select("company_id")
          .eq("id", userId)
          .single();
        const companyId = profile?.company_id;
        if (!companyId) return;

        const { data: jobsData } = await supabase
          .from("jobs")
          .select("*")
          .eq("company_id", companyId)
          .order("created_at", { ascending: false });

        setJobs(jobsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [supabase]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleEdit = (job: any) => {
    setEditingJob(job.id);
    setFormData({
      job_title: job.job_title || "",
      department: job.department || "",
      location: job.location || "",
      salary: job.salary || "",
      vacancies: job.vacancies || 0,
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "",
      roles: job.roles || "",
      responsibilities: job.responsibilities || "",
      status: job.status || "Open",
    });
  };

  const handleCancelEdit = () => setEditingJob(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
      };

      const { error } = await supabase
        .from("jobs")
        .update(updatedData)
        .eq("id", editingJob);

      if (error) {
        alert("Error updating job: " + error.message);
        return;
      }

      setJobs((prev) =>
        prev.map((job) =>
          job.id === editingJob ? { ...job, ...updatedData } : job
        )
      );

      alert("Job updated successfully!");
      setEditingJob(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) {
        alert("Error deleting job: " + error.message);
        return;
      }
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading jobs...</p>;

  // Filtered jobs based on search & status
  const filteredJobs = jobs.filter((job) => {
    const matchesTitle = job.job_title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesTitle && matchesStatus;
  });

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Jobs</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by job title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-3 w-full md:w-1/2 text-base"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg p-3 w-full md:w-1/4 text-base"
        >
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
          <option value="Hold">Hold</option>
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <p className="text-gray-500 text-lg">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const isExpanded = expandedIds.includes(job.id);
            const isEditing = editingJob === job.id;

            return (
              <div
                key={job.id}
                className="bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 text-lg"
              >
                {!isEditing ? (
                  <>
                    {/* Job Title and Status */}
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {job.job_title}
                      </h2>
                      <select
                        value={job.status || "Open"}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            const res = await fetch("/api/jobs/update-status", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ job_id: job.id, status: newStatus }),
                            });
                            const result = await res.json();
                            if (result.success) {
                              setJobs((prev) =>
                                prev.map((j) =>
                                  j.id === job.id ? { ...j, status: newStatus } : j
                                )
                              );
                            } else {
                              alert("Failed to update status: " + result.error);
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className={`px-4 py-2 rounded-full text-base font-medium ${
                          job.status === "Open"
                            ? "bg-green-100 text-green-800"
                            : job.status === "Closed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Hold">Hold</option>
                      </select>
                    </div>

                    {/* Job content… same as before */}
                    <p className="text-gray-800 text-base mb-2">
                      <strong>Job Code:</strong> {job.job_code} |{" "}
                      <strong>Requisition:</strong> {job.requisition_code}
                    </p>
                    <p className="text-gray-800 text-base flex items-center gap-2 mb-1">
                      <Briefcase size={18} /> {job.department || "N/A"}
                    </p>
                    <p className="text-gray-800 text-base flex items-center gap-2 mb-1">
                      <MapPin size={18} /> {job.location || "N/A"}
                    </p>
                    <p className="text-gray-800 text-base flex items-center gap-2 mb-1">
                      <DollarSign size={18} /> {job.salary || "N/A"}
                    </p>
                    <p className="text-gray-800 text-base flex items-center gap-2 mb-2">
                      <Users size={18} /> Vacancies: {job.vacancies || 0}
                    </p>

                    {/* Skills */}
                    <div className="mb-3 text-base">
                      <p className="text-gray-700 font-medium mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-3 text-base">
                        {Array.isArray(job.skills) && job.skills.length > 0 ? (
                          job.skills.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </div>
                    </div>

                    {/* Roles & Responsibilities */}
                    <div className="mb-3">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleExpand(job.id)}
                      >
                        <span className="text-gray-600 text-base font-medium">
                          Roles & Responsibilities
                        </span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </div>
                      {isExpanded && (
                        <div className="mt-2 text-gray-600 text-base space-y-2">
                          <p>
                            <strong>Roles:</strong> {job.roles || "N/A"}
                          </p>
                          <p>
                            <strong>Responsibilities:</strong> {job.responsibilities || "N/A"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Edit/Delete */}
                    <div className="mt-4 flex justify-between items-center text-base">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleEdit(job)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(job.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                ) : (
                  // Edit Form (same as before)
                  <div>
                    <div className="flex justify-between mb-4">
                      <h2 className="text-2xl font-semibold text-gray-800">Edit Job</h2>
                      <button onClick={handleCancelEdit}>
                        <X size={24} className="text-gray-600 hover:text-gray-800" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <input
                        name="job_title"
                        value={formData.job_title}
                        onChange={handleChange}
                        placeholder="Job Title"
                        className="w-full border rounded-lg p-3 text-base"
                      />
                      <input
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Department"
                        className="w-full border rounded-lg p-3 text-base"
                      />
                      <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Location"
                        className="w-full border rounded-lg p-3 text-base"
                      />
                      <input
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        placeholder="Salary"
                        className="w-full border rounded-lg p-3 text-base"
                      />
                      <input
                        type="number"
                        name="vacancies"
                        value={formData.vacancies}
                        onChange={handleChange}
                        placeholder="Vacancies"
                        className="w-full border rounded-lg p-3 text-base"
                      />
                      <input
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="Skills (comma separated)"
                        className="w-full border rounded-lg p-3 text-base"
                      />
                      <textarea
                        name="roles"
                        value={formData.roles}
                        onChange={handleChange}
                        placeholder="Roles"
                        className="w-full border rounded-lg p-3 text-base"
                      />
                      <textarea
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={handleChange}
                        placeholder="Responsibilities"
                        className="w-full border rounded-lg p-3 text-base"
                      />
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 text-base"
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Hold">Hold</option>
                      </select>
                    </div>
                    <div className="flex justify-end mt-4 gap-3">
                      <button
                        className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-base"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
