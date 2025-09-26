"use client";

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

export default function DashboardPage() {
  // Dummy data (replace later with DB/API)
  const departmentData = [
    { name: "Products", value: 70 },
    { name: "Engineering", value: 30 },
  ];

  const sourceData = [
    { name: "LinkedIn", value: 40 },
    { name: "Referral", value: 25 },
    { name: "Website", value: 20 },
    { name: "Other", value: 15 },
  ];

  const funnelData = [
    { stage: "Applied", value: 180 },
    { stage: "Interview", value: 167 },
    { stage: "Shortlisted", value: 18 },
    { stage: "Offer", value: 12 },
    { stage: "Hired", value: 5 },
  ];

  const COLORS = ["#3B82F6", "#1E40AF", "#6366F1", "#0EA5E9"];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 text-sm">Open Position</p>
            <p className="text-2xl font-bold">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 text-sm">Total Applicants</p>
            <p className="text-2xl font-bold">180</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 text-sm">Interview Scheduled</p>
            <p className="text-2xl font-bold">167</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 text-sm">Shortlisted Applicants</p>
            <p className="text-2xl font-bold">18</p>
          </CardContent>
        </Card>
      </div>

      {/* Second Row KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 text-sm">Selection Ratio</p>
            <p className="text-2xl font-bold">6.23%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 text-sm">Pending Interviews</p>
            <p className="text-2xl font-bold">111</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 text-sm">Success Ratio</p>
            <p className="text-2xl font-bold">0%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 text-sm">Pending Feedback</p>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Open Position By Department */}
        <Card>
          <CardHeader>
            <CardTitle>Open Position By Department</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
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
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Offer Acceptance Ratio */}
        <Card>
          <CardHeader>
            <CardTitle>Offer Acceptance Ratio</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-4xl font-bold text-red-500">11%</p>
            <p className="text-gray-500">Offer Acceptance Ratio</p>
            <div className="flex justify-between w-full mt-4 text-sm text-gray-600">
              <span>12 Accepted</span>
              <span>123 Provided</span>
            </div>
          </CardContent>
        </Card>

        {/* Time To Hire */}
        <Card>
          <CardHeader>
            <CardTitle>Time To Hire</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32">
                <circle
                  className="text-gray-200"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="50"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-blue-600"
                  strokeWidth="10"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="50"
                  cx="64"
                  cy="64"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={(1 - 0.7) * 2 * Math.PI * 50}
                />
              </svg>
              <span className="absolute text-xl font-bold text-blue-600">
                37 Days
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Application Received By Source */}
        <Card>
          <CardHeader>
            <CardTitle>Application Received By Source</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recruitment Funnel Chart */}
        <Card>
  <CardHeader>
    <CardTitle>Recruitment Funnel Chart</CardTitle>
  </CardHeader>
  <CardContent className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={funnelData} 
        layout="vertical"
        margin={{ top: 20, right: 20, left: 10, bottom: 20 }} // 👈 added margin
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis 
          dataKey="stage" 
          type="category" 
          width={100} // 👈 optional extra space for labels
        />
        <Tooltip />
        <Bar dataKey="value" fill="#1E40AF" />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

      </div>
    </div>
  );
}


