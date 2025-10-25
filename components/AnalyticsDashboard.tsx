
import React, { useMemo } from 'react';
import type { PatientData } from '../types';
import { CallStatus, PatientType } from '../types';
import { getCallStatus } from '../utils/dateUtils';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsDashboardProps {
  allPatientsData: PatientData[];
}

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const AlertClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2 2" />
    <path d="M5 3 2 6" />
    <path d="m22 6-3-3" />
  </svg>
);
const PhoneForwardedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 2 22 6 18 10"/>
        <line x1="14" y1="6" x2="22" y2="6"/>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
);

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-slate-100 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const DataTable: React.FC<{ title: string; data: { name: string; count: number }[], headers: [string, string] }> = ({ title, data, headers }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
    <div className="overflow-y-auto max-h-80">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 sticky top-0">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{headers[0]}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{headers[1]}</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data.map(({ name, count }) => (
            <tr key={name} className="hover:bg-slate-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ allPatientsData }) => {
  const analytics = useMemo(() => {
    if (!allPatientsData || allPatientsData.length === 0) {
      return {
        totalPatients: 0,
        callsCompleted: 0,
        callsOverdue: 0,
        callsToday: 0,
        callsUpcoming: 0,
        patientsPerDoctor: [],
        callsPerAgent: []
      };
    }

    let callsCompleted = 0;
    let callsOverdue = 0;
    let callsToday = 0;
    let callsUpcoming = 0;
    const patientsPerDoctor: Record<string, number> = {};
    const callsPerAgent: Record<string, number> = {};
    
    allPatientsData.forEach(p => {
      // Doctor stats
      if (p.doctorName) {
        patientsPerDoctor[p.doctorName] = (patientsPerDoctor[p.doctorName] || 0) + 1;
      }

      // Agent stats
      if (p.agentName && p.callOutcome) {
          callsPerAgent[p.agentName] = (callsPerAgent[p.agentName] || 0) + 1;
      }

      // Call status stats
      const visitType: PatientType = (p.patientType === 'OPD' || p.patientType === 'IPD') ? p.patientType : p.department as PatientType;
      const status = getCallStatus(p.lastVisitDate, visitType, p.callOutcome);
      if (status === CallStatus.Completed) callsCompleted++;
      if (status === CallStatus.Overdue) callsOverdue++;
      if (status === CallStatus.NeedActionToday) callsToday++;
      if (status === CallStatus.Upcoming) callsUpcoming++;
    });

    const sortAndFormat = (data: Record<string, number>) => Object.entries(data)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    return {
      totalPatients: allPatientsData.length,
      callsCompleted,
      callsOverdue,
      callsToday,
      callsUpcoming,
      patientsPerDoctor: sortAndFormat(patientsPerDoctor),
      callsPerAgent: sortAndFormat(callsPerAgent),
    };

  }, [allPatientsData]);
  
  const pieData = useMemo(() => [
      { name: 'Completed', value: analytics.callsCompleted },
      { name: 'Overdue', value: analytics.callsOverdue },
      { name: 'Today', value: analytics.callsToday },
      { name: 'Upcoming', value: analytics.callsUpcoming },
  ].filter(item => item.value > 0), [analytics]);

  const COLORS: { [key: string]: string } = {
      'Completed': '#10B981',
      'Overdue': '#EF4444',
      'Today': '#F59E0B',
      'Upcoming': '#3B82F6',
  };
  
  if (allPatientsData.length === 0) {
    return (
       <div className="bg-white shadow-md rounded-lg p-8 text-center text-slate-500">
          <h2 className="text-xl font-semibold">No Data for Analytics</h2>
          <p className="mt-2">Upload a CSV file or add patient records to see dashboard analytics.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Patients" value={analytics.totalPatients} icon={<UsersIcon className="h-6 w-6 text-blue-600"/>} />
        <StatCard title="Calls Completed" value={analytics.callsCompleted} icon={<CheckCircleIcon className="h-6 w-6 text-green-600"/>} />
        <StatCard title="Calls Overdue" value={analytics.callsOverdue} icon={<AlertClockIcon className="h-6 w-6 text-red-600"/>} />
        <StatCard title="Calls to Make Today" value={analytics.callsToday} icon={<PhoneForwardedIcon className="h-6 w-6 text-yellow-600"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Call Status Overview</h3>
            <div className="w-full h-80">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            // FIX: The explicit type for the label prop was incompatible with recharts' PieLabelRenderProps.
                            // The library's type for properties like `cx` is `string | number`, but the original code only
                            // specified `number`. This is corrected by allowing `string | number` and then adding a type guard
                            // to ensure the values are numbers before performing calculations.
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx?: number | string; cy?: number | string; midAngle?: number; innerRadius?: number; outerRadius?: number; percent?: number; }) => {
                                if (percent === undefined || typeof cx !== 'number' || typeof cy !== 'number' || midAngle === undefined || innerRadius === undefined || outerRadius === undefined) {
                                    return null;
                                }

                                if (percent === 0) return null;
                                
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                return (
                                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="bold">
                                    {`${(percent * 100).toFixed(0)}%`}
                                </text>
                                );
                            }}
                            outerRadius={110}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {pieData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} calls`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
        <DataTable title="Patients per Doctor" data={analytics.patientsPerDoctor} headers={['Doctor Name', 'Total Patients']} />
        <DataTable title="Calls per Agent" data={analytics.callsPerAgent} headers={['Agent Name', 'Calls Handled']} />
      </div>
    </div>
  );
};
