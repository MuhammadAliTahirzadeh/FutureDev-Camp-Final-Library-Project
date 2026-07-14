import React, { useState } from 'react';
import { Users, UserPlus, Server, Database, AlertCircle, Trash2, Eye } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList,
} from 'recharts';
import { ActivityLog, SystemAlert } from '../types';
import { GlassCard } from './GlassCard';

interface AdminViewProps {
  activities: ActivityLog[];
  alerts: SystemAlert[];
  onDismissAlert: (alertId: string) => void;
  onClearLogs: () => void;
}

// Chart Mock Datasets
const SYSTEM_USAGE_DATA = [
  { day: 'Mon', usage: 120 },
  { day: 'Tue', usage: 210 },
  { day: 'Wed', usage: 180 },
  { day: 'Thu', usage: 340 },
  { day: 'Fri', usage: 410 },
  { day: 'Sat', usage: 490 },
  { day: 'Sun', usage: 512 },
];

const BORROWING_TRENDS_DATA = [
  { genre: 'Fiction', borrows: 45 },
  { genre: 'Sci-Fi', borrows: 88 },
  { genre: 'Non-Fic', borrows: 32 },
  { genre: 'History', borrows: 56 },
  { genre: 'Bio', borrows: 72 },
];

const RESOURCE_ALLOCATION_DATA = [
  { name: 'Physical Books', value: 55, color: '#3b82f6' }, // Blue
  { name: 'E-books', value: 30, color: '#10b981' }, // Green
  { name: 'Media', value: 15, color: '#a855f7' }, // Purple
];

export const AdminView: React.FC<AdminViewProps> = ({
  activities,
  alerts,
  onDismissAlert,
  onClearLogs,
}) => {
  const [selectedAlert, setSelectedAlert] = useState<SystemAlert | null>(null);

  return (
    <div id="admin-view-container" className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div id="admin-header">
        <h1 id="admin-title" className="text-4xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">
          Admin Overview
        </h1>
        <p id="admin-subtitle" className="text-gray-800 dark:text-slate-200 mt-1 font-medium">
          Library system utilization, database health reports, and overall analytics.
        </p>
      </div>

      {/* Top metrics bar (Screen 3 style) */}
      <div id="admin-metrics-row" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Users */}
        <GlassCard id="admin-metric-users" className="flex items-center gap-6 p-6 border-white/20">
          <div id="users-icon-bg" className="p-4 bg-blue-100 dark:bg-blue-950/40 rounded-2xl">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-800 dark:text-slate-200 font-extrabold uppercase tracking-wider">Active Users</p>
            <h3 className="text-3xl font-mono font-bold tracking-tight text-blue-600 dark:text-blue-400 mt-1">512</h3>
          </div>
        </GlassCard>

        {/* New Members This Month */}
        <GlassCard id="admin-metric-new-members" className="flex items-center gap-6 p-6 border-white/20">
          <div id="new-members-icon-bg" className="p-4 bg-green-100 dark:bg-green-950/40 rounded-2xl">
            <UserPlus className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-gray-800 dark:text-slate-200 font-extrabold uppercase tracking-wider">New Members This Month</p>
            <h3 className="text-3xl font-mono font-bold tracking-tight text-green-600 dark:text-green-400 mt-1">120</h3>
          </div>
        </GlassCard>
      </div>

      {/* Analytics Charts Section (Grid style exact mirror of Screen 3) */}
      <div id="admin-charts-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: System Usage (Last 7 Days) */}
        <GlassCard id="system-usage-chart-card" className="p-5 border-white/10 bg-white/5 dark:bg-black/15 flex flex-col justify-between h-[300px]">
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5 mb-1">
              <Server className="w-4 h-4 text-blue-500" /> System Usage (Last 7 Days)
            </h3>
            <span className="text-[10px] text-gray-800 dark:text-slate-200 font-extrabold uppercase tracking-wider">Active connections telemetry</span>
          </div>
          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SYSTEM_USAGE_DATA} margin={{ top: 20, right: 15, left: -20, bottom: 5 }}>
                <XAxis 
                  dataKey="day" 
                  stroke="currentColor" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  className="text-gray-500 dark:text-gray-400 font-bold"
                  tick={{ fill: 'currentColor', fontWeight: 'bold' }}
                />
                <YAxis 
                  stroke="currentColor" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  className="text-gray-500 dark:text-gray-400 font-mono font-bold"
                  tick={{ fill: 'currentColor', fontWeight: 'bold' }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                />
                <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 1.5, fill: '#3b82f6' }}>
                  <LabelList dataKey="usage" position="top" offset={10} fill="#3b82f6" className="font-mono font-extrabold text-[11px]" />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Chart 2: Borrowing Trends */}
        <GlassCard id="borrowing-trends-chart-card" className="p-5 border-white/10 bg-white/5 dark:bg-black/15 flex flex-col justify-between h-[300px]">
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5 mb-1">
              <Database className="w-4 h-4 text-green-500" /> Borrowing Trends
            </h3>
            <span className="text-[10px] text-gray-800 dark:text-slate-200 font-extrabold uppercase tracking-wider">Book genre requests analytics</span>
          </div>
          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BORROWING_TRENDS_DATA} margin={{ top: 20, right: 15, left: -20, bottom: 5 }}>
                <XAxis 
                  dataKey="genre" 
                  stroke="currentColor" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  className="text-gray-500 dark:text-gray-400 font-bold"
                  tick={{ fill: 'currentColor', fontWeight: 'bold' }}
                />
                <YAxis 
                  stroke="currentColor" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  className="text-gray-500 dark:text-gray-400 font-mono font-bold"
                  tick={{ fill: 'currentColor', fontWeight: 'bold' }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                />
                <Bar dataKey="borrows" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24}>
                  <LabelList dataKey="borrows" position="top" offset={8} fill="#10b981" className="font-mono font-extrabold text-[11px]" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Chart 3: Resource Allocation Table & Visual Grid */}
        <GlassCard id="resource-allocation-chart-card" className="p-5 border-white/10 bg-white/5 dark:bg-black/15 flex flex-col justify-between h-[300px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <Database className="w-4 h-4 text-purple-500" /> Resource Allocation
              </h3>
              <span className="text-[11px] font-mono font-extrabold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/40 px-2 py-0.5 rounded-full">
                20,000 Total Items
              </span>
            </div>
            <span className="text-[10px] text-gray-800 dark:text-slate-200 font-extrabold uppercase tracking-wider">Media stock & inventory breakdown</span>
          </div>

          <div className="mt-4 space-y-4 overflow-y-auto flex-1 pr-1 scrollbar-thin">
            {/* Table Header */}
            <div className="grid grid-cols-12 text-[10px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 pb-2 border-b border-gray-200 dark:border-slate-800">
              <span className="col-span-4">Asset Type</span>
              <span className="col-span-3 text-right">Stock Count</span>
              <span className="col-span-5 text-right">Allocation & Volume</span>
            </div>

            {/* Row 1: Physical Books */}
            <div className="grid grid-cols-12 items-center text-xs py-1">
              <div className="col-span-4 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="font-bold text-gray-800 dark:text-slate-200">Physical Books</span>
              </div>
              <span className="col-span-3 text-right font-mono font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                11,000
              </span>
              <div className="col-span-5 pl-4 flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px] font-extrabold">
                  <span className="text-gray-500">Target Weight</span>
                  <span className="text-blue-600 dark:text-blue-400">55%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '55%' }} />
                </div>
              </div>
            </div>

            {/* Row 2: E-Books */}
            <div className="grid grid-cols-12 items-center text-xs py-1">
              <div className="col-span-4 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="font-bold text-gray-800 dark:text-slate-200">E-books</span>
              </div>
              <span className="col-span-3 text-right font-mono font-extrabold text-green-600 dark:text-green-400 text-sm">
                6,000
              </span>
              <div className="col-span-5 pl-4 flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px] font-extrabold">
                  <span className="text-gray-500">Target Weight</span>
                  <span className="text-green-600 dark:text-green-400">30%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
            </div>

            {/* Row 3: Media */}
            <div className="grid grid-cols-12 items-center text-xs py-1">
              <div className="col-span-4 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="font-bold text-gray-800 dark:text-slate-200">Media</span>
              </div>
              <span className="col-span-3 text-right font-mono font-extrabold text-purple-600 dark:text-purple-400 text-sm">
                3,000
              </span>
              <div className="col-span-5 pl-4 flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px] font-extrabold">
                  <span className="text-gray-500">Target Weight</span>
                  <span className="text-purple-600 dark:text-purple-400">15%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Activity Log and System Alerts Double row (Screen 3 Bottom) */}
      <div id="admin-system-activity-row" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity Log Table */}
        <div id="activity-log-col" className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Recent Activity Log</h2>
            <button
              id="clear-logs-btn"
              onClick={onClearLogs}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Clear Logs
            </button>
          </div>
          <GlassCard id="activity-log-table-card" className="border-white/10 overflow-hidden bg-white/5 dark:bg-black/10">
            <div className="overflow-x-auto max-h-[300px] scrollbar-thin">
              <table id="activity-logs-table" className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-white/10 dark:bg-black/35 text-gray-850 dark:text-slate-200 font-extrabold uppercase tracking-wider border-b border-white/5">
                    <th className="p-4">Date</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-800 dark:text-slate-200 font-semibold">No log data available.</td>
                    </tr>
                  ) : (
                    activities.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono font-bold text-gray-800 dark:text-slate-200">{log.date}</td>
                        <td className="p-4 font-bold text-gray-800 dark:text-white">{log.user}</td>
                        <td className="p-4 text-blue-600 dark:text-blue-400 font-bold">{log.action}</td>
                        <td className="p-4 text-gray-800 dark:text-slate-200 font-medium truncate max-w-[150px]">{log.details}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* System Alerts */}
        <div id="system-alerts-col" className="lg:col-span-5 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">System Alerts</h2>
          <GlassCard id="system-alerts-card" className="p-6 border-white/20 h-[300px] flex flex-col justify-between">
            {alerts.length === 0 ? (
              <div className="text-center text-gray-800 dark:text-slate-200 py-16 flex flex-col items-center gap-2">
                <AlertCircle className="w-10 h-10 text-green-500" />
                <span className="font-extrabold">System Healthy</span>
                <span className="text-xs font-semibold">No active system alerts or error records found.</span>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto pr-1">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      alert.severity === 'high'
                        ? 'bg-red-500/10 border-red-500/30'
                        : alert.severity === 'warning'
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg mt-0.5 ${
                        alert.severity === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white">{alert.title}</h4>
                        <p className="text-[10px] text-gray-800 dark:text-slate-200 font-semibold mt-1">{alert.message}</p>
                      </div>
                    </div>

                    {/* Alert Action CTA */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="p-1.5 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => onDismissAlert(alert.id)}
                        className="p-1.5 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Individual Alert Dialog Detail view */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <GlassCard className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border-white/40 shadow-2xl">
            <h3 className="font-sans font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" /> System Log Details
            </h3>
            <div className="space-y-4 my-6 text-sm text-gray-900 dark:text-slate-100 font-semibold">
              <p><strong>Severity:</strong> <span className="uppercase text-red-500 font-extrabold">{selectedAlert.severity}</span></p>
              <p><strong>Title:</strong> {selectedAlert.title}</p>
              <p><strong>Message:</strong> {selectedAlert.message}</p>
              <p className="text-xs text-gray-800 dark:text-slate-200 font-semibold leading-relaxed">
                This report is fetched from automated GCP Cloud Run service monitoring tools logs and represents system limits or data events. Dismiss when resource allocation returns to stable conditions.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl transition-all hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
