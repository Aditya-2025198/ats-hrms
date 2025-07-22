import dynamic from 'next/dynamic';

const DashboardCharts = dynamic(() => import('@/components/DashboardCharts'), { ssr: false });

export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to the ATS & HRMS Dashboard</h1>
      <p className="text-gray-600">Please choose an option from the sidebar to begin managing your HR operations.</p>
      <DashboardCharts />
    </div>
  );
}
