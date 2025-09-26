"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabaseClient";
// 1. Import Recharts Components
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// 1. INTERFACE: Reuse the Candidate structure
interface Candidate {
  id: number;
  job_code: string;
  position: string; // Job Title
  status: string;
  created_at: string;
  hired_date?: string | null;
  requisitions?: {
    client_name: string;
  };
}

// 2. Mock Data Processor (The Core Logic)
const useAnalytics = (candidates: Candidate[]) => {
  const analyticsData = useMemo(() => {
    if (candidates.length === 0) {
      return {
        totalActiveCandidates: 0,
        statusBreakdown: {},
        averageTimeToHire: "N/A",
        offerAcceptanceRate: "N/A",
        topOpenRequisitions: [],
      };
    }

    // --- A. Status Breakdown ---
    const statusBreakdown = candidates.reduce<Record<string, number>>(
      (acc, candidate) => {
        acc[candidate.status] = (acc[candidate.status] || 0) + 1;
        return acc;
      },
      {}
    );

    const activeStatuses = ["Applied", "Shortlisted", "Offered"];
    const totalActiveCandidates = candidates.filter((c) =>
      activeStatuses.includes(c.status)
    ).length;

    // --- B. Time-to-Hire (TTH) and Offer Rate ---
    const hiredCandidates = candidates.filter((c) => c.status === "Hired" && c.hired_date);
    const offeredCandidates = candidates.filter((c) => c.status === "Offered" || c.status === "Hired");

    let totalTTHDays = 0;
    hiredCandidates.forEach((c) => {
      const appliedDate = new Date(c.created_at);
      const hiredDate = new Date(c.hired_date!);
      const diffTime = Math.abs(hiredDate.getTime() - appliedDate.getTime());
      totalTTHDays += Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    });

    const averageTimeToHire =
      hiredCandidates.length > 0
        ? `${Math.round(totalTTHDays / hiredCandidates.length)} days`
        : "N/A";

    const offerAcceptanceRate =
      offeredCandidates.length > 0
        ? `${Math.round(
            (hiredCandidates.length / offeredCandidates.length) * 100
          )}%`
        : "N/A";

    // --- C. Top Open Requisitions ---
    const topRequisitionsMap = candidates
      .filter((c) => c.status === "Applied" || c.status === "Shortlisted")
      .reduce<Record<string, { job_code: string, position: string, count: number }>>(
        (acc, c) => {
          const key = c.job_code;
          if (!acc[key]) {
            acc[key] = {
              job_code: key,
              position: c.position,
              count: 0,
            };
          }
          acc[key].count++;
          return acc;
        },
        {}
      );

    const topOpenRequisitions = Object.values(topRequisitionsMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Get top 5

    return {
      totalActiveCandidates,
      statusBreakdown,
      averageTimeToHire,
      offerAcceptanceRate,
      topOpenRequisitions,
    };
  }, [candidates]);

  return analyticsData;
};

// 3. Main Component
export default function AnalyticsPage() {
  const supabase = createClient();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchAllCandidates = async () => {
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

        const { data: candidatesData, error } = await supabase
          .from("candidates")
          .select(`id, job_code, position, status, created_at, hired_date, requisitions:job_code (client_name)`)
          .eq("company_id", companyId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCandidates(
          (candidatesData || []).map((c: any) => ({
            ...c,
            requisitions: Array.isArray(c.requisitions) ? c.requisitions[0] : c.requisitions,
          }))
        );
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCandidates();
  }, [supabase]);

  // --- Analytics Calculation ---
  const {
    totalActiveCandidates,
    statusBreakdown,
    averageTimeToHire,
    offerAcceptanceRate,
    topOpenRequisitions,
  } = useAnalytics(candidates);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-20">
        Generating recruiting insights...
      </p>
    );
    
  if (candidates.length === 0)
    return (
      <div className="text-center py-10 text-gray-500">
        <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
        <p className="text-lg">No candidate data found to generate analytics.</p>
      </div>
    );

  // 4. RENDERING: Dashboard Layout
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Recruiting Analytics Dashboard 📈
        </h1>

        {/* --- KPI Cards Row --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <KPICard 
            title="Active Pipeline" 
            value={totalActiveCandidates} 
            description="Applied, Shortlisted, & Offered"
          />
          <KPICard 
            title="Avg. Time to Hire" 
            value={averageTimeToHire} 
            description="From Application to Hired"
          />
          <KPICard 
            title="Offer Acceptance Rate" 
            value={offerAcceptanceRate} 
            description="Hired / (Offered + Hired)"
          />
        </div>

        {/* --- Main Charts Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Status Breakdown Chart (Left Column) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Candidate Status Breakdown
            </h2>
            <p className="text-sm text-gray-500 mb-6">
                Visualizing where all candidates sit in the pipeline.
            </p>
            {/* Chart Implementation using Recharts */}
            <StatusDonutChart data={statusBreakdown} />
            
          </div>
          
          {/* Top Requisitions Table (Right Column) */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Top 5 Open Requisitions
            </h2>
            <p className="text-sm text-gray-500 mb-6">
                Highest number of candidates in Applied/Shortlisted stages.
            </p>
            <RequisitionsTable data={topOpenRequisitions} />
          </div>
        </div>
      </div>
    </div>
  );
}


// --- Helper Components for Clean Rendering ---

// KPI Card Component
const KPICard = ({ title, value, description }: { title: string, value: string | number, description: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-blue-500">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="mt-1 text-4xl font-extrabold text-gray-900">{value}</p>
    <p className="mt-2 text-xs text-gray-400">{description}</p>
  </div>
);

// New Recharts Donut Chart Component (replaces the mock)
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0000'];

const StatusDonutChart = ({ data }: { data: Record<string, number> }) => {
    // Transform the object data into the array format Recharts expects
    const chartData = Object.entries(data)
        .map(([status, count]) => ({
            name: status,
            value: count,
        }))
        .filter(item => item.value > 0); // Filter out zero values

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        labelLine={false}
                    >
                        {/* Map through data to assign a color to each slice */}
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    {/* Position Legend at the bottom */}
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 10 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// Requisitions Table Component
const RequisitionsTable = ({ data }: { data: { job_code: string, position: string, count: number }[] }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Job Code
          </th>
          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Position
          </th>
          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Active Cands.
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item) => (
          <tr key={item.job_code}>
            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{item.job_code}</td>
            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{item.position}</td>
            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
          </tr>
        ))}
        {data.length === 0 && (
            <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No open requisitions with active candidates.
                </td>
            </tr>
        )}
      </tbody>
    </table>
  </div>
);