"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CF5", "#F56476"];

export default function DashboardCharts({ data }: { data: any }) {
  const [jobData, setJobData] = useState<any[]>([]);
  const [candidateData, setCandidateData] = useState<any[]>([]);
  const [employeeData, setEmployeeData] = useState<any[]>([]);

  useEffect(() => {
    if (!data) return;

    // Jobs Bar Chart - simulate jobs per day (or use created_at)
    const weeklyJobs = [
      { day: "Mon", jobs: Math.floor(Math.random() * 6) },
      { day: "Tue", jobs: Math.floor(Math.random() * 6) },
      { day: "Wed", jobs: Math.floor(Math.random() * 6) },
      { day: "Thu", jobs: Math.floor(Math.random() * 6) },
      { day: "Fri", jobs: Math.floor(Math.random() * 6) },
    ];
    setJobData(weeklyJobs);

    // Candidate Pie Chart
    const candidateStatuses = Object.entries(data.candidates || {}).map(([status, count]) => ({
      name: status,
      value: count,
    }));
    setCandidateData(candidateStatuses);

    // Employee Pie Chart
    const employeeStatuses = Object.entries(data.employees || {}).map(([status, count]) => ({
      name: status,
      value: count,
    }));
    setEmployeeData(employeeStatuses);
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      {/* Jobs Bar Chart */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">Active Jobs (This Week)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={jobData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="jobs" fill="#4F46E5" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Candidates Pie Chart */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">Candidates by Status</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={candidateData} dataKey="value" nameKey="name" outerRadius={70}>
              {candidateData.map((entry, index) => (
                <Cell key={`cell-candidate-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Employees Pie Chart */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">Employees by Status</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={employeeData} dataKey="value" nameKey="name" outerRadius={70}>
              {employeeData.map((entry, index) => (
                <Cell key={`cell-employee-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
