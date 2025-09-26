"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabaseClient";

// 1. INTERFACE: Define the shape of a candidate object
interface Candidate {
  id: number;
  company_id: string;
  job_code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  position: string; // Used as Job Title
  total_experience: string;
  current_ctc: number;
  expected_ctc: number;
  notice_period: string;
  status: string;
  resume_url?: string | null;
  interviewed_date?: string | null;
  hired_date?: string | null; // Used for planned joining date
  requisitions?: {
    client_name: string;
  };
}

// Helper interface for grouped data
interface GroupedCandidates {
  [key: string]: Candidate[];
}

export default function CandidatePipelinePage() {
  const supabase = createClient();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. DATA FETCHING: Query for all relevant pipeline statuses
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const { data: profileData } = await supabase
          .from("profiles")
          .select("company_id")
          .eq("id", session.user.id)
          .single();

        if (!profileData) throw new Error("Profile not found");

        const companyId = profileData.company_id;

        // Fetch candidates for ALL statuses relevant to the pipeline: Applied, Offered, Hired, etc.
        const { data: candidatesData, error } = await supabase
          .from("candidates")
          .select(`
            *,
            requisitions:job_code (client_name)
          `)
          .eq("company_id", companyId)
          // ONLY statuses relevant for a hiring/applied/joined pipeline
          .or("status.eq.Applied,status.eq.Shortlisted,status.eq.Offered,status.eq.Hired,status.eq.Rejected,status.eq.Hold")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setCandidates(candidatesData || []);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [supabase]);

  // --- CORE UTILITY FUNCTIONS (Update, Date, Delete) ---

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

  const updateCandidateDate = async (
    id: number,
    status: string,
    date: string
  ) => {
    // We will use 'hired_date' for the expected joining date in this context
    const updateField = status === "Hired" || status === "Offered" ? "hired_date" : "interviewed_date";
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

  // 3. GROUPING LOGIC
  const groupCandidates = (cands: Candidate[]): GroupedCandidates => {
    return cands.reduce<GroupedCandidates>((acc, candidate) => {
      const groupKey = `${candidate.job_code} | ${candidate.position}`;
      
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(candidate);
      return acc;
    }, {});
  };

  // --- FILTERING CANDIDATES (useMemo for performance) ---

  // Applied & Shortlisted Candidates
  const groupedAppliedAndShortlistedCandidates = useMemo(() => {
    const relevantCands = candidates.filter(c => c.status === "Applied" || c.status === "Shortlisted");
    return groupCandidates(relevantCands);
  }, [candidates]);

  // Hired Candidates (Joining Pipeline)
  const groupedHiredCandidates = useMemo(() => {
    const hiredCands = candidates.filter(c => c.status === "Offered" || c.status === "Hired");
    // Sort by planned joining date (hired_date)
    hiredCands.sort((a, b) => {
        if (!a.hired_date) return 1;
        if (!b.hired_date) return -1;
        return new Date(a.hired_date).getTime() - new Date(b.hired_date).getTime();
    });
    return groupCandidates(hiredCands);
  }, [candidates]);


  if (loading)
    return (
      <p className="text-center text-gray-500 mt-20">
        Loading candidate pipelines...
      </p>
    );

  // 4. RENDERING: JSX for the complete pipeline dashboard

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Candidate Pipeline Dashboard 🚀
        </h1>

        <div className="space-y-12">
          
          {/* =================================================== */}
          ## Hired Candidates (Joining Pipeline) 🎉
          {/* =================================================== */}
          
          <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-6 border-b-2 border-blue-500 pb-2">
              Hired Candidates (Joining Pipeline) 🎉
            </h2>
            
            {Object.keys(groupedHiredCandidates).length === 0 ? (
              <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
                No candidates are currently in the Offered/Hired pipeline.
              </div>
            ) : (
              <div className="space-y-8">
                {/* Iterate through each Job Group */}
                {Object.entries(groupedHiredCandidates).map(([groupKey, cands]) => {
                  const [jobCode, jobTitle] = groupKey.split(' | ');
                  const statusColor = "bg-blue-600";
                  
                  return (
                    <div key={groupKey} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                      
                      {/* Job Group Header */}
                      <div className="mb-4 pb-2 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800">
                          {jobTitle}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Job Code: <span className="font-semibold">{jobCode}</span> | Total Hired: <span className="font-semibold">{cands.length}</span>
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* List all candidates within this group */}
                        {cands.map((c) => (
                          <div key={c.id} className="border-b border-dashed pb-3 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-lg text-gray-700">
                                  {c.name}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  **Client:** {c.requisitions?.client_name || "N/A"}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${statusColor}`}
                              >
                                {c.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 mt-2 text-sm text-gray-600">
                                <span>**CTC (Current):** ₹{c.current_ctc?.toLocaleString('en-IN') || "N/A"}</span>
                                <span>**Joining Date:** <span className="font-bold text-blue-800">{c.hired_date || "Not Set"}</span></span>
                            </div>
                            
                            {/* Actions */}
                            <div className="mt-3 flex gap-3 items-center">
                                <label className="text-sm text-gray-700">
                                    Update Status:
                                </label>
                                <select
                                    value={c.status}
                                    onChange={(e) => setCandidateStatus(c.id, e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    {[
                                        "Offered", 
                                        "Hired", // Use Hired for Joined/Joining
                                        "Rejected",
                                        "Hold",
                                    ].map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                
                                <label className="text-sm text-gray-700 ml-4">
                                    Set Joining Date:
                                </label>
                                <input
                                    type="date"
                                    value={c.hired_date || ""}
                                    onChange={(e) =>
                                        updateCandidateDate(
                                            c.id,
                                            "Hired", // Use "Hired" status to target the 'hired_date' field
                                            e.target.value
                                        )
                                    }
                                    className="border border-gray-300 p-1 rounded-md text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
                                />

                                <button
                                    onClick={() => handleDeleteCandidate(c.id)}
                                    className="ml-auto px-3 py-1 bg-red-500 text-white text-xs rounded-md shadow hover:bg-red-600 transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <hr className="border-gray-300" />

          {/* =================================================== */}
          ## New Applications & Shortlist (Status: Applied/Shortlisted) 📥
          {/* =================================================== */}

          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-6 border-b-2 border-green-500 pb-2">
              New Applications & Shortlist 📥
            </h2>
            
            {Object.keys(groupedAppliedAndShortlistedCandidates).length === 0 ? (
              <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
                No new candidates with 'Applied' or 'Shortlisted' status.
              </div>
            ) : (
              <div className="space-y-8">
                {/* Iterate through each Job Group (Applied/Shortlisted) */}
                {Object.entries(groupedAppliedAndShortlistedCandidates).map(([groupKey, cands]) => {
                  const [jobCode, jobTitle] = groupKey.split(' | ');
                  
                  return (
                    <div key={groupKey} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                      
                      {/* Job Group Header */}
                      <div className="mb-4 pb-2 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800">
                          {jobTitle}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Job Code: <span className="font-semibold">{jobCode}</span> | Total Candidates: <span className="font-semibold">{cands.length}</span>
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* List all candidates within this group */}
                        {cands.map((c) => (
                          <div key={c.id} className="border-b border-dashed pb-3 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-lg text-gray-700">
                                  {c.name}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  **Client:** {c.requisitions?.client_name || "N/A"}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${c.status === "Applied" ? "bg-green-600" : "bg-yellow-600"}`}
                              >
                                {c.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 mt-2 text-sm text-gray-600">
                                <span>**Experience:** {c.total_experience}</span>
                                <span>**CTC (Exp.):** ₹{c.expected_ctc.toLocaleString('en-IN')}</span>
                            </div>
                            
                            {/* Actions */}
                            <div className="mt-3 flex gap-3 items-center">
                                <label className="text-sm text-gray-700">
                                    Next Status:
                                </label>
                                <select
                                    value={c.status}
                                    onChange={(e) => setCandidateStatus(c.id, e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    {[
                                        "Applied", 
                                        "Shortlisted",
                                        "Offered",
                                        "Rejected",
                                        "Hold",
                                    ].map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                
                                {c.resume_url && (
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
                                        className="text-sm text-blue-600 hover:text-blue-800 underline font-medium ml-4"
                                    >
                                        View Resume
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteCandidate(c.id)}
                                    className="ml-auto px-3 py-1 bg-red-500 text-white text-xs rounded-md shadow hover:bg-red-600 transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>


          {/* Empty State */}
          {candidates.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p className="text-lg">No candidates found for this company.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}