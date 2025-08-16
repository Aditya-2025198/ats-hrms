"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function DashboardCharts({ data, weeklyJobs }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Candidates & Jobs Status Chart */}
      <div className="bg-white shadow p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Candidates & Jobs Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { name: "Candidates", ...data.candidates },
            { name: "Jobs", ...data.jobs }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {Object.keys(data.candidates || {}).map((status, idx) => (
              <Bar key={status} dataKey={status} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"][idx % 4]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Jobs Chart */}
      <div className="bg-white shadow p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Jobs Posted This Week</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyJobs}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="jobs" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
