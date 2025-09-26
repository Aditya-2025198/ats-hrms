"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

interface Candidate {
  id: number;
  company_id: string;
  job_code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  total_experience: string;
  current_ctc: number;
  expected_ctc: number;
  notice_period: string;
  status: string;
  resume_url?: string | null;
  interviewed_date?: string | null;
  hired_date?: string | null;
  requisitions?: {
    client_name: string; // Added client_name from requisitions table
  };
}

export default function InterviewPage() {
  const supabase = createClient();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviewCandidates = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        // Get company_id of logged-in user
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("company_id")
          .eq("id", session.user.id)
          .single();

        if (profileError || !profileData)
          throw profileData || new Error("Profile not found");

        const companyId = profileData.company_id;

        // Fetch candidates with requisition data (client_name)
        const { data: candidatesData, error } = await supabase
          .from("candidates")
          .select(`
            *,
            requisitions:job_code (client_name)
          `)
          .eq("company_id", companyId)
          .or("status.eq.Interviewed,status.eq.Shortlisted")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setCandidates(candidatesData || []);
      } catch (err) {
        console.error("Error fetching interview candidates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviewCandidates();
  }, [supabase]);

  // Update candidate status
  const setCandidateStatus = async (id: number, status: string) => {
    try {
      await supabase.from("candidates").update({ status }).eq("id", id);
      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // Update interview or hired date
  const updateCandidateDate = async (
    id: number,
    status: string,
    date: string
  ) => {
    const updateField = status === "Interviewed" ? "interviewed_date" : "hired_date";
    try {
      await supabase.from("candidates").update({ [updateField]: date }).eq("id", id);
      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, [updateField]: date } : c))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update date");
    }
  };

  // Delete candidate
  const handleDeleteCandidate = async (id: number) => {
    if (!confirm("Are you sure you want to delete this candidate?")) return;
    try {
      const { error } = await supabase.from("candidates").delete().eq("id", id);
      if (error) throw error;
      setCandidates((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete candidate: " + err.message);
    }
  };

  // --- Sorting and Filtering Logic ---
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize today's date to compare correctly

  const upcomingCandidates = candidates
    .filter(
      (c) =>
        c.status === "Interviewed" &&
        c.interviewed_date &&
        new Date(c.interviewed_date) >= today
    )
    .sort(
      (a, b) =>
        new Date(a.interviewed_date!).getTime() -
        new Date(b.interviewed_date!).getTime()
    );

  const pastCandidates = candidates
    .filter(
      (c) =>
        c.status === "Interviewed" &&
        c.interviewed_date &&
        new Date(c.interviewed_date) < today
    )
    .sort(
      (a, b) =>
        new Date(b.interviewed_date!).getTime() -
        new Date(a.interviewed_date!).getTime()
    );

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-20">
        Loading interview candidates...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          Scheduled Interviews
        </h1>

        <div className="space-y-8">
          {/* Upcoming Interviews */}
          {upcomingCandidates.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
                Upcoming Interviews
              </h2>
              <div className="space-y-6">
                {upcomingCandidates.map((c) => {
                  const statusColor = "bg-yellow-600";
                  return (
                    <div
                      key={c.id}
                      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {c.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {c.position}{" "}
                            <span className="font-semibold text-gray-600 ml-2">
                              ({c.job_code})
                            </span>
                          </p>
                          {/* Display Client Name */}
                          <p className="text-sm text-gray-600">
                            <strong>Client:</strong>{" "}
                            {c.requisitions?.client_name || "N/A"}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-1 text-xs font-semibold rounded-full text-white ${statusColor}`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 text-sm text-gray-700">
                        <p>
                          <strong>Email:</strong> {c.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {c.phone}
                        </p>
                        <p>
                          <strong>Total Experience:</strong> {c.total_experience}
                        </p>
                        <p>
                          <strong>Interview Date:</strong>{" "}
                          {c.interviewed_date || "Not Scheduled"}
                        </p>
                      </div>

                      {/* Resume Link */}
                      {c.resume_url && (
                        <div className="mt-4">
                          <strong>Resume:</strong>{" "}
                          <button
                            onClick={async () => {
                              const fullUrl = c.resume_url!;
                              const filePath = fullUrl.split("/resumes/")[1];
                              const { data, error } = await supabase.storage
                                .from("resumes")
                                .createSignedUrl(filePath, 60);
                              if (error) {
                                console.error("Error creating signed URL:", error);
                                alert("Failed to get resume: " + error.message);
                                return;
                              }
                              window.open(data.signedUrl, "_blank");
                            }}
                            className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 font-medium"
                          >
                            View Resume
                          </button>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-700">
                            Update Status:
                          </label>
                          <select
                            value={c.status}
                            onChange={(e) =>
                              setCandidateStatus(c.id, e.target.value)
                            }
                            className={`ml-2 px-3 py-1 rounded-md text-white ${statusColor} focus:ring-2 focus:ring-opacity-50 focus:ring-offset-2`}
                          >
                            {[
                              "Shortlisted",
                              "Interviewed",
                              "Offered",
                              "Rejected",
                              "Hold",
                            ].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-700">
                            Interview Date:
                          </label>
                          <input
                            type="date"
                            value={c.interviewed_date || ""}
                            onChange={(e) =>
                              updateCandidateDate(
                                c.id,
                                "Interviewed",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
                          />
                        </div>

                        <div className="flex gap-2 mt-4 sm:mt-0">
                          <button
                            onClick={() => handleDeleteCandidate(c.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past Interviews */}
          {pastCandidates.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
                Past Interviews
              </h2>
              <div className="space-y-6">
                {pastCandidates.map((c) => {
                  const statusColor = "bg-orange-600";
                  return (
                    <div
                      key={c.id}
                      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {c.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {c.position}{" "}
                            <span className="font-semibold text-gray-600 ml-2">
                              ({c.job_code})
                            </span>
                          </p>
                          {/* Display Client Name */}
                          <p className="text-sm text-gray-600">
                            <strong>Client:</strong>{" "}
                            {c.requisitions?.client_name || "N/A"}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-1 text-xs font-semibold rounded-full text-white ${statusColor}`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 text-sm text-gray-700">
                        <p>
                          <strong>Email:</strong> {c.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {c.phone}
                        </p>
                        <p>
                          <strong>Total Experience:</strong> {c.total_experience}
                        </p>
                        <p>
                          <strong>Interview Date:</strong>{" "}
                          {c.interviewed_date || "Not Scheduled"}
                        </p>
                      </div>

                      {/* Resume Link */}
                      {c.resume_url && (
                        <div className="mt-4">
                          <strong>Resume:</strong>{" "}
                          <button
                            onClick={async () => {
                              const fullUrl = c.resume_url!;
                              const filePath = fullUrl.split("/resumes/")[1];
                              const { data, error } = await supabase.storage
                                .from("resumes")
                                .createSignedUrl(filePath, 60);
                              if (error) {
                                console.error("Error creating signed URL:", error);
                                alert("Failed to get resume: " + error.message);
                                return;
                              }
                              window.open(data.signedUrl, "_blank");
                            }}
                            className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 font-medium"
                          >
                            View Resume
                          </button>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-700">
                            Update Status:
                          </label>
                          <select
                            value={c.status}
                            onChange={(e) =>
                              setCandidateStatus(c.id, e.target.value)
                            }
                            className={`ml-2 px-3 py-1 rounded-md text-white ${statusColor} focus:ring-2 focus:ring-opacity-50 focus:ring-offset-2`}
                          >
                            {[
                              "Shortlisted",
                              "Interviewed",
                              "Offered",
                              "Rejected",
                              "Hold",
                            ].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-700">
                            Interview Date:
                          </label>
                          <input
                            type="date"
                            value={c.interviewed_date || ""}
                            onChange={(e) =>
                              updateCandidateDate(
                                c.id,
                                "Interviewed",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
                          />
                        </div>

                        <div className="flex gap-2 mt-4 sm:mt-0">
                          <button
                            onClick={() => handleDeleteCandidate(c.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {upcomingCandidates.length === 0 && pastCandidates.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p className="text-lg">No candidates found for interviews.</p>
              <p className="text-sm">
                Candidates with an 'Interviewed' status will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
