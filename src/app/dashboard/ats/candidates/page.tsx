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
}

export default function CandidatesPage() {
  const supabase = createClient();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCandidateId, setEditingCandidateId] = useState<number | null>(null);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJobCode, setFilterJobCode] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [formData, setFormData] = useState<any>({
    job_code: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    position: "",
    total_experience: "",
    current_ctc: "",
    expected_ctc: "",
    notice_period: "",
    status: "Applied",
    interviewed_date: "",
    hired_date: "",
    resumeFile: null,
  });

  // Fetch jobs and candidates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("company_id")
          .eq("id", session.user.id)
          .single();
        if (profileError || !profileData) throw profileError || new Error("Profile not found");

        const companyId = profileData.company_id;

        const { data: jobsData } = await supabase
          .from("jobs")
          .select("*")
          .eq("company_id", companyId)
          .order("created_at", { ascending: false });
        setJobs(jobsData || []);

        const { data: candidatesData } = await supabase
          .from("candidates")
          .select("*")
          .eq("company_id", companyId)
          .order("created_at", { ascending: false });
        setCandidates(candidatesData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [supabase]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, resumeFile: e.target.files[0] });
    }
  };

  // Add new candidate
  const handleAddCandidate = async () => {
    if (!formData.job_code) return alert("Job code is required!");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", session.user.id)
        .single();
      if (profileError || !profileData) throw profileError || new Error("Profile not found");

      const companyId = profileData.company_id;

      let resumeUrl = null;
      if (formData.resumeFile) {
        const file = formData.resumeFile;
        const fileExt = file.name.split(".").pop();
        const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("resumes").upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from("resumes").getPublicUrl(fileName);
        resumeUrl = publicData.publicUrl;
      }

      const { data, error } = await supabase
        .from("candidates")
        .insert([{
          job_code: formData.job_code,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          position: formData.position,
          total_experience: formData.total_experience,
          current_ctc: Number(formData.current_ctc),
          expected_ctc: Number(formData.expected_ctc),
          notice_period: formData.notice_period,
          status: formData.status,
          interviewed_date: formData.interviewed_date || null,
          hired_date: formData.hired_date || null,
          company_id: companyId,
          resume_url: resumeUrl,
        }])
        .select()
        .single();
      if (error) throw error;

      setCandidates(prev => [data, ...prev]);
      setFormData({
        job_code: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        position: "",
        total_experience: "",
        current_ctc: "",
        expected_ctc: "",
        notice_period: "",
        status: "Applied",
        interviewed_date: "",
        hired_date: "",
        resumeFile: null,
      });
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      alert("Failed to add candidate: " + err.message);
    }
  };

  // Edit candidate
  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidateId(candidate.id);
    setFormData({
      job_code: candidate.job_code,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      address: candidate.address,
      position: candidate.position,
      total_experience: candidate.total_experience,
      current_ctc: candidate.current_ctc,
      expected_ctc: candidate.expected_ctc,
      notice_period: candidate.notice_period,
      status: candidate.status,
      interviewed_date: candidate.interviewed_date || "",
      hired_date: candidate.hired_date || "",
      resumeFile: null,
    });
  };

  const handleSaveCandidate = async () => {
    if (editingCandidateId === null) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      let resumeUrl: string | null = null;
      if (formData.resumeFile) {
        const file = formData.resumeFile;
        const fileExt = file.name.split(".").pop();
        const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("resumes").upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from("resumes").getPublicUrl(fileName);
        resumeUrl = publicData.publicUrl;
      }

      const updatedData = {
        job_code: formData.job_code,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        position: formData.position,
        total_experience: formData.total_experience,
        current_ctc: Number(formData.current_ctc),
        expected_ctc: Number(formData.expected_ctc),
        notice_period: formData.notice_period,
        status: formData.status,
        interviewed_date: formData.interviewed_date || null,
        hired_date: formData.hired_date || null,
        resume_url: resumeUrl || null,
      };

      const { error } = await supabase.from("candidates").update(updatedData).eq("id", editingCandidateId);
      if (error) throw error;

      setCandidates(prev =>
        prev.map(c => c.id === editingCandidateId ? { ...c, ...updatedData } : c)
      );

      setEditingCandidateId(null);
      setFormData({
        job_code: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        position: "",
        total_experience: "",
        current_ctc: "",
        expected_ctc: "",
        notice_period: "",
        status: "Applied",
        interviewed_date: "",
        hired_date: "",
        resumeFile: null,
      });
    } catch (err: any) {
      console.error(err);
      alert("Failed to update candidate: " + err.message);
    }
  };

  const handleDeleteCandidate = async (id: number) => {
    if (!confirm("Are you sure you want to delete this candidate?")) return;
    try {
      const { error } = await supabase.from("candidates").delete().eq("id", id);
      if (error) throw error;
      setCandidates(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete candidate: " + err.message);
    }
  };

  const setCandidateStatus = async (id: number, status: string) => {
    try {
      await supabase.from("candidates").update({ status }).eq("id", id);
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const updateCandidateDate = async (id: number, status: string, date: string) => {
    const updateField = status === "Interviewed" ? "interviewed_date" : "hired_date";
    try {
      await supabase.from("candidates").update({ [updateField]: date }).eq("id", id);
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, [updateField]: date } : c));
    } catch (err) {
      console.error(err);
      alert("Failed to update date");
    }
  };

  // Filtering Logic
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = searchTerm === "" ||
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJobCode = filterJobCode === "" || candidate.job_code === filterJobCode;
    const matchesStatus = filterStatus === "" || candidate.status === filterStatus;

    return matchesSearch && matchesJobCode && matchesStatus;
  });

  // Export to Excel (CSV)
  const handleExportToExcel = () => {
    if (filteredCandidates.length === 0) {
      alert("No candidates to export.");
      return;
    }

    const headers = [
      "Job Code",
      "Name",
      "Email",
      "Phone",
      "Address",
      "Position",
      "Total Experience",
      "Current CTC",
      "Expected CTC",
      "Notice Period",
      "Status",
      "Interviewed Date",
      "Hired Date",
    ];
    
    // Add quotation marks to handle commas within fields
    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...filteredCandidates.map(c => 
        [
          `"${c.job_code}"`,
          `"${c.name}"`,
          `"${c.email}"`,
          `"${c.phone}"`,
          `"${c.address}"`,
          `"${c.position}"`,
          `"${c.total_experience}"`,
          `"${c.current_ctc}"`,
          `"${c.expected_ctc}"`,
          `"${c.notice_period}"`,
          `"${c.status}"`,
          `"${c.interviewed_date || ""}"`,
          `"${c.hired_date || ""}"`,
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'candidates.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p className="text-center text-gray-500 mt-20">Loading candidates...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Candidates Dashboard</h1>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {showForm ? "Close Form" : "Add New Candidate"}
          </button>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
            <select
              value={filterJobCode}
              onChange={(e) => setFilterJobCode(e.target.value)}
              className="w-full sm:w-auto p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="">All Job Codes</option>
              {jobs.map(job => <option key={job.id} value={job.job_code}>{job.job_code}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="">All Statuses</option>
              {["Applied", "Shortlisted", "Interviewed", "Offered", "Hired", "Rejected", "Hold"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={handleExportToExcel}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Candidate</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <select name="job_code" value={formData.job_code} onChange={handleInputChange} className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200">
                <option value="">Select Job Code</option>
                {jobs.map(job => <option key={job.id} value={job.job_code}>{job.job_code} - {job.job_title}</option>)}
              </select>
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Candidate Name" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" />
              <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" />
              <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" />
              <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" />
              <input name="position" value={formData.position} onChange={handleInputChange} placeholder="Position Applied For" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" />
              <input name="total_experience" value={formData.total_experience} onChange={handleInputChange} placeholder="Total Experience" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" />
              <input name="current_ctc" value={formData.current_ctc} onChange={handleInputChange} placeholder="Current CTC" type="number" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" />
              <input name="expected_ctc" value={formData.expected_ctc} onChange={handleInputChange} placeholder="Expected CTC" type="number" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" />
              <input name="notice_period" value={formData.notice_period} onChange={handleInputChange} placeholder="Notice Period" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" />

              <div className="flex items-center gap-4">
                <label htmlFor="resumeUpload" className="px-6 py-3 border border-dashed border-gray-400 text-gray-600 rounded-md cursor-pointer hover:bg-gray-50 transition duration-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  Upload Resume
                </label>
                <input type="file" accept=".pdf,.doc,.docx" id="resumeUpload" onChange={handleFileChange} className="hidden" />
                {formData.resumeFile && <span className="text-sm text-gray-700 font-medium truncate max-w-[150px]">{formData.resumeFile.name}</span>}
              </div>

              <select name="status" value={formData.status} onChange={handleInputChange} className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200">
                {["Applied", "Shortlisted", "Interviewed", "Offered", "Hired", "Rejected", "Hold"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button onClick={handleAddCandidate} className="mt-8 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out">Submit</button>
          </div>
        )}

        <div className="space-y-6">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-lg">No candidates found matching your criteria.</p>
              <p className="text-sm">Try adjusting your search or filter settings.</p>
            </div>
          ) : (
            filteredCandidates.map(c => {
              const isEditing = editingCandidateId === c.id;

              let statusColor = "bg-gray-500";
              if (c.status === "Applied") statusColor = "bg-blue-600";
              else if (c.status === "Shortlisted") statusColor = "bg-yellow-600";
              else if (c.status === "Interviewed") statusColor = "bg-orange-600";
              else if (c.status === "Offered") statusColor = "bg-purple-600";
              else if (c.status === "Hired") statusColor = "bg-green-600";
              else if (c.status === "Rejected") statusColor = "bg-red-600";
              else if (c.status === "Hold") statusColor = "bg-gray-600";

              return (
                <div key={c.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {!isEditing ? (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{c.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{c.position} <span className="font-semibold text-gray-600 ml-2">({c.job_code})</span></p>
                        </div>
                        <span className={`px-4 py-1 text-xs font-semibold rounded-full text-white ${statusColor}`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 text-sm text-gray-700">
                        <p><strong>Email:</strong> {c.email}</p>
                        <p><strong>Phone:</strong> {c.phone}</p>
                        <p><strong>Total Experience:</strong> {c.total_experience}</p>
                        <p><strong>Current CTC:</strong> {c.current_ctc || "N/A"}</p>
                        <p><strong>Expected CTC:</strong> {c.expected_ctc || "N/A"}</p>
                        <p><strong>Notice Period:</strong> {c.notice_period || "N/A"}</p>
                      </div>
                      {c.resume_url ? (
                        <div className="mt-4">
                          <strong>Resume:</strong>{" "}
                          <button
                            onClick={async () => {
                              const fullUrl = c.resume_url!;
                              const filePath = fullUrl.split("/resumes/")[1];
                              if (!filePath) {
                                alert("Invalid resume URL format.");
                                return;
                              }
                              const { data, error } = await supabase.storage.from("resumes").createSignedUrl(filePath, 60);
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
                      ) : (
                        <p className="mt-4 text-gray-500"><strong>Resume:</strong> Not Uploaded</p>
                      )}
                      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-700">Update Status:</label>
                          <select
                            value={c.status}
                            onChange={e => setCandidateStatus(c.id, e.target.value)}
                            className={`ml-2 px-3 py-1 rounded-md text-white ${statusColor} focus:ring-2 focus:ring-opacity-50 focus:ring-offset-2`}
                          >
                            {["Applied", "Shortlisted", "Interviewed", "Offered", "Hired", "Rejected", "Hold"].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        {(c.status === "Interviewed" || c.status === "Hired") && (
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700">
                              {c.status === "Interviewed" ? "Interview Date:" : "Hire Date:"}
                            </label>
                            <input
                              type="date"
                              value={c.status === "Interviewed" ? c.interviewed_date || "" : c.hired_date || ""}
                              onChange={e => updateCandidateDate(c.id, c.status, e.target.value)}
                              className="border border-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                          </div>
                        )}
                        <div className="flex gap-2 mt-4 sm:mt-0">
                          <button onClick={() => handleEditCandidate(c)} className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300">Edit</button>
                          <button onClick={() => handleDeleteCandidate(c.id)} className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition duration-300">Delete</button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="font-bold text-lg mb-4">Edit Candidate</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select name="job_code" value={formData.job_code} onChange={handleInputChange} className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200">
                          <option value="">Select Job Code</option>
                          {jobs.map(job => <option key={job.id} value={job.job_code}>{job.job_code} - {job.job_title}</option>)}
                        </select>
                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Candidate Name" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200" />
                        <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200" />
                        <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200" />
                        <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" />
                        <input name="position" value={formData.position} onChange={handleInputChange} placeholder="Position Applied For" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200" />
                        <input name="total_experience" value={formData.total_experience} onChange={handleInputChange} placeholder="Total Experience" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200" />
                        <input name="current_ctc" value={formData.current_ctc} onChange={handleInputChange} placeholder="Current CTC" type="number" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200" />
                        <input name="expected_ctc" value={formData.expected_ctc} onChange={handleInputChange} placeholder="Expected CTC" type="number" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200" />
                        <input name="notice_period" value={formData.notice_period} onChange={handleInputChange} placeholder="Notice Period" className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200" />

                        <div className="flex items-center gap-4">
                          <label htmlFor="editResume" className="px-6 py-3 border border-dashed border-gray-400 text-gray-600 rounded-md cursor-pointer hover:bg-gray-50 transition duration-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            Upload New Resume
                          </label>
                          <input type="file" accept=".pdf,.doc,.docx" id="editResume" onChange={handleFileChange} className="hidden" />
                          {formData.resumeFile && <span className="text-sm text-gray-700 font-medium truncate max-w-[150px]">{formData.resumeFile.name}</span>}
                        </div>

                        <select name="status" value={formData.status} onChange={handleInputChange} className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200">
                          {["Applied", "Shortlisted", "Interviewed", "Offered", "Hired", "Rejected", "Hold"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div className="mt-6 flex gap-2">
                        <button onClick={handleSaveCandidate} className="px-6 py-3 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition duration-300">Save</button>
                        <button onClick={() => setEditingCandidateId(null)} className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400 transition duration-300">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}