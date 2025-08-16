"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";

const DashboardCharts = dynamic(() => import("@/components/DashboardCharts"), { ssr: false });

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);
  const [weeklyJobs, setWeeklyJobs] = useState([]);
  const [kpis, setKpis] = useState({
    totalCandidates: 0,
    totalJobs: 0,
    hired: 0,
    activeJobs: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const companyId = user.user_metadata.company_id;

      // Fetch candidates
      const { data: candidates } = await supabase
        .from("candidates")
        .select("status, created_at")
        .eq("company_id", companyId);

      // Fetch jobs
      const { data: jobs } = await supabase
        .from("jobs")
        .select("status, created_at")
        .eq("company_id", companyId);

      // Aggregate counts
      const candidateCounts = candidates?.reduce((acc: any, c: any) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      }, {}) || {};

      const jobCounts = jobs?.reduce((acc: any, j: any) => {
        acc[j.status] = (acc[j.status] || 0) + 1;
        return acc;
      }, {}) || {};

      setKpis({
        totalCandidates: candidates?.length || 0,
        totalJobs: jobs?.length || 0,
        hired: candidateCounts["Hired"] || 0,
        activeJobs: jobCounts["Open"] || 0
      });

      // Weekly jobs for bar chart
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      const counts = days.map((day) => ({ day, jobs: 0 }));

      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 4); // Friday
      endOfWeek.setHours(23, 59, 59, 999);

      jobs?.forEach((job) => {
        const jobDate = new Date(job.created_at);
        if (jobDate >= startOfWeek && jobDate <= endOfWeek) {
          const dayIndex = jobDate.getDay() - 1; // Monday=0
          if (dayIndex >= 0 && dayIndex < 5) {
            counts[dayIndex].jobs += 1;
          }
        }
      });

      setWeeklyJobs(counts);

      // Send candidate + job counts to chart
      setChartData({
        candidates: candidateCounts,
        jobs: jobCounts
      });

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading dashboard data...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to the ATS & HRMS Dashboard</h1>
      <p className="text-gray-600 mb-6">Here’s an overview of your HR operations.</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center shadow">
          <h3 className="text-sm text-gray-500">Total Candidates</h3>
          <p className="text-2xl font-bold">{kpis.totalCandidates}</p>
        </Card>
        <Card className="p-4 text-center shadow">
          <h3 className="text-sm text-gray-500">Total Jobs</h3>
          <p className="text-2xl font-bold">{kpis.totalJobs}</p>
        </Card>
        <Card className="p-4 text-center shadow">
          <h3 className="text-sm text-gray-500">Hired Candidates</h3>
          <p className="text-2xl font-bold">{kpis.hired}</p>
        </Card>
        <Card className="p-4 text-center shadow">
          <h3 className="text-sm text-gray-500">Active Jobs</h3>
          <p className="text-2xl font-bold">{kpis.activeJobs}</p>
        </Card>
      </div>

      {/* Charts */}
      <DashboardCharts data={chartData} weeklyJobs={weeklyJobs} />
    </div>
  );
}
