"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface Candidate {
  id: number;
  company_id: string;
  job_code: string;
  name: string;
  status: string;
  interviewed_date?: string | null;
  hired_date?: string | null;
  created_at: string;
}

interface Job {
  id: number;
  company_id: string;
  department: string;
  status: string;
  openings: number;
}

interface Requisition {
  id: number;
  company_id: string;
  client_name: string;
}

export default function DashboardPage() {
  const supabase = createClient();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        // Get company_id
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("company_id")
          .eq("id", session.user.id)
          .single();
        if (profileError || !profileData) throw new Error("Profile not found");
        const companyId = profileData.company_id;

        // Fetch candidates
        const { data: candidatesData, error: candidatesError } = await supabase
          .from("candidates")
          .select("*")
          .eq("company_id", companyId);
        if (candidatesError) throw candidatesError;

        // Fetch jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from("jobs")
          .select("*")
          .eq("company_id", companyId);
        if (jobsError) throw jobsError;

        // Fetch requisitions
        const { data: requisitionsData, error: requisitionsError } =
          await supabase
            .from("requisitions")
            .select("*")
            .eq("company_id", companyId);
        if (requisitionsError) throw requisitionsError;

        setCandidates(candidatesData || []);
        setJobs(jobsData || []);
        setRequisitions(requisitionsData || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-20">
        Loading dashboard data...
      </p>
    );

  // --- KPI Calculations ---
  const totalApplicants = candidates.length;
  const openPositions = jobs.filter((j) => j.status === "Open").length;
  const shortlistedApplicants = candidates.filter(
    (c) => c.status === "Shortlisted"
  ).length;
  const interviewScheduled = candidates.filter(
    (c) =>
      c.interviewed_date &&
      new Date(c.interviewed_date) > new Date()
  ).length;

  const hired = candidates.filter((c) => c.status === "Hired").length;
  const offered = candidates.filter(
    (c) => c.status === "Offered" || c.status === "Hired"
  ).length;
  const interviewed = candidates.filter((c) => c.interviewed_date).length;

  const selectionRatio =
    totalApplicants > 0 ? ((hired / totalApplicants) * 100).toFixed(2) + "%" : "0%";
  const successRatio =
    interviewed > 0 ? ((hired / interviewed) * 100).toFixed(2) + "%" : "0%";

  const pendingInterviews = candidates.filter(
    (c) =>
      c.interviewed_date &&
      new Date(c.interviewed_date) > new Date()
  ).length;
  const pendingFeedback = candidates.filter(
    (c) =>
      c.interviewed_date &&
      new Date(c.interviewed_date) < new Date() &&
      c.status !== "Hired"
  ).length;

  const offerAcceptanceRatio =
    offered > 0 ? ((hired / offered) * 100).toFixed(2) + "%" : "0%";

  // Average Time to Hire
  const hiredCandidates = candidates.filter(
    (c) => c.status === "Hired" && c.hired_date
  );
  const totalTTHDays = hiredCandidates.reduce((acc, c) => {
    const applied = new Date(c.created_at).getTime();
    const hiredDate = new Date(c.hired_date!).getTime();
    return acc + Math.ceil(Math.abs(hiredDate - applied) / (1000 * 60 * 60 * 24));
  }, 0);
  const avgTimeToHire =
    hiredCandidates.length > 0
      ? Math.round(totalTTHDays / hiredCandidates.length) + " days"
      : "N/A";

  // Charts Data
  const COLORS = ["#3B82F6", "#1E40AF", "#6366F1", "#0EA5E9", "#F59E0B"];

  const departmentChartData = jobs.reduce<Record<string, number>>((acc, j) => {
    if (j.status === "Open") {
      acc[j.department] = (acc[j.department] || 0) + 1;
    }
    return acc;
  }, {});
  const departmentData = Object.entries(departmentChartData).map(
    ([name, value]) => ({ name, value })
  );

  const requisitionsData = requisitions.reduce<Record<string, number>>(
    (acc, r) => {
      acc[r.client_name] = (acc[r.client_name] || 0) + 1;
      return acc;
    },
    {}
  );
  const requisitionChartData = Object.entries(requisitionsData).map(
    ([name, value]) => ({ name, value })
  );

  const funnelStages = ["Applied", "Interviewed", "Shortlisted", "Offered", "Hired"];
  const funnelData = funnelStages.map((stage) => ({
    stage,
    value: candidates.filter((c) => c.status === stage).length,
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Open Position" value={openPositions} />
        <KpiCard title="Total Applicants" value={totalApplicants} />
        <KpiCard title="Interview Scheduled" value={interviewScheduled} />
        <KpiCard title="Shortlisted Applicants" value={shortlistedApplicants} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Selection Ratio" value={selectionRatio} />
        <KpiCard title="Pending Interviews" value={pendingInterviews} />
        <KpiCard title="Success Ratio" value={successRatio} />
        <KpiCard title="Pending Feedback" value={pendingFeedback} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartCard title="Open Positions by Department">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {departmentData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Requisitions by Client">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={requisitionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1E40AF" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Recruitment Funnel">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

// --- Helper Components ---
const KpiCard = ({ title, value }: { title: string; value: string | number }) => (
  <Card>
    <CardContent className="p-4 text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="h-64">{children}</CardContent>
  </Card>
);
