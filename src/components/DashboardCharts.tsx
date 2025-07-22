'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const jobData = [
  { day: 'Mon', jobs: 4 },
  { day: 'Tue', jobs: 3 },
  { day: 'Wed', jobs: 5 },
  { day: 'Thu', jobs: 2 },
  { day: 'Fri', jobs: 6 },
];

const candidateData = [
  { name: 'Applied', value: 12 },
  { name: 'Screening', value: 8 },
  { name: 'Interviewed', value: 5 },
  { name: 'Offered', value: 3 },
  { name: 'Hired', value: 2 },
  { name: 'Rejected', value: 6 },
];

const employeeData = [
  { name: 'Active', value: 18 },
  { name: 'Inactive', value: 4 },
  { name: 'Serving Notice', value: 2 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF5', '#F56476'];

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      {/* Bar Chart */}
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

      {/* Candidate Pie Chart */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">Candidates by Status</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={candidateData} dataKey="value" nameKey="name" outerRadius={70}>
              {candidateData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Employee Pie Chart */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">Employees by Status</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={employeeData} dataKey="value" nameKey="name" outerRadius={70}>
              {employeeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
