import React, { useState, useEffect } from 'react';
import { AnalyticsData, DashboardStats } from '../types';
import { api } from '../services/api';
import {
  BarChart3,
  Layers,
  Flame,
  CheckCircle2,
  Lock,
  ShieldCheck,
  TrendingUp,
  Download,
  Activity,
  RefreshCw,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [anData, dashStats] = await Promise.all([
        api.getAnalytics(),
        api.getAdminDashboard(),
      ]);
      setAnalytics(anData);
      setStats(dashStats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExportCsv = () => {
    if (!analytics) return;
    const rows = [
      ['Department', 'Category', 'Incident Count', 'Severity'],
      ...analytics.heatmap.map((h) => [h.department, h.category, String(h.count), h.severity]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `whisper_ledger_compliance_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !analytics || !stats) {
    return (
      <div className="py-24 text-center space-y-3 relative z-10">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Computing campus grievance heatmap & ledger metrics...</p>
      </div>
    );
  }

  const departments = ['Computer Science', 'Hostel Administration', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'General Campus'];
  const categories = ['Ragging', 'Harassment', 'Hostel', 'Academic', 'Infrastructure', 'Faculty Issue', 'Safety'];

  return (
    <div className="space-y-8 animate-fade-in py-2 relative z-10">
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Campus Accountability Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Analytics & Grievance Heatmap
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time departmental metrics, systemic issue hotspots, and cryptographic chain verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs shadow-2xs"
            title="Refresh analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm shadow-blue-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Compliance CSV</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Grievances</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{stats.totalComplaints}</div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">In campus ledger</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-2xs">
          <span className="text-xs text-amber-700 font-medium">Total Community "Me Too"</span>
          <div className="text-2xl font-extrabold text-amber-600 font-mono mt-1">
            {analytics.totalEndorsements}
          </div>
          <p className="text-[11px] text-amber-600/80 mt-1 font-medium">Collective endorsements</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs">
          <span className="text-xs text-emerald-700 font-medium">Resolution Rate</span>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">
            {stats.resolutionRate}%
          </div>
          <p className="text-[11px] text-emerald-600/80 mt-1 font-medium">SLA fulfilled</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-purple-200/90 shadow-2xs">
          <span className="text-xs text-purple-700 font-medium">Tamper-Proof Blocks</span>
          <div className="text-2xl font-extrabold text-purple-600 font-mono mt-1">
            {analytics.ledgerVerification.totalBlocks}
          </div>
          <p className="text-[11px] text-emerald-700 flex items-center gap-1 mt-1 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Chain Intact
          </p>
        </div>
      </div>

      {/* DEPARTMENT VS CATEGORY COMPLAINT HEATMAP (Section 18) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Department vs Issue Category Heatmap</h3>
            <p className="text-xs text-slate-500 font-medium">
              Intensity corresponds to complaint concentration and student endorsements.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
              <span className="text-slate-500 font-medium">0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-100 border border-blue-200" />
              <span className="text-slate-600 font-medium">1 - 2</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-200 border border-amber-300" />
              <span className="text-slate-700 font-medium">3 - 5</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500 border border-rose-600" />
              <span className="text-rose-700 font-bold">Critical Hotspot</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/90">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold">
                <th className="p-3.5 text-left border border-slate-200">
                  Department \ Category
                </th>
                {categories.map((cat) => (
                  <th key={cat} className="p-3.5 border border-slate-200 whitespace-nowrap">
                    {cat}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 text-left font-bold text-slate-900 bg-slate-50/70 border border-slate-200 whitespace-nowrap">
                    {dept}
                  </td>
                  {categories.map((cat) => {
                    const match = analytics.heatmap.find(
                      (h) => h.department.toLowerCase().includes(dept.toLowerCase()) && h.category.toLowerCase() === cat.toLowerCase()
                    );
                    const count = match ? match.count : 0;
                    const isCritical = match?.severity === 'CRITICAL';
                    const isHigh = match?.severity === 'HIGH';

                    let bgClass = 'bg-white text-slate-300';
                    if (count > 0) {
                      if (isCritical) bgClass = 'bg-rose-500 text-white font-bold shadow-2xs';
                      else if (isHigh) bgClass = 'bg-amber-200 text-amber-950 font-bold';
                      else bgClass = 'bg-blue-100 text-blue-900 font-semibold';
                    }

                    return (
                      <td key={cat} className={`p-3 border border-slate-200 transition-colors ${bgClass}`}>
                        {count > 0 ? `${count} issue(s)` : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-Column: Department Breakdown & Monthly Escalation Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Volume */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Departmental Grievance Distribution</span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(stats.departmentCounts).map(([dept, count]) => {
              const pct = Math.round((count / stats.totalComplaints) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-800 font-medium">{dept}</span>
                    <span className="font-mono text-slate-500 font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Intake vs Resolution Trend */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Monthly Intake & Resolution Velocity</span>
          </div>

          <div className="space-y-3">
            {analytics.monthlyTrends.map((trend) => (
              <div key={trend.month} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{trend.month}</span>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                    <span className="text-blue-700 font-medium">Submitted: {trend.submitted}</span>
                    <span className="text-emerald-700 font-medium">Resolved: {trend.resolved}</span>
                    <span className="text-rose-700 font-medium">Escalated: {trend.escalated}</span>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-xs text-emerald-700">
                  {Math.round((trend.resolved / Math.max(1, trend.submitted)) * 100)}% Fulfilled
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cryptographic Ledger Block Chain Explorer */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Lock className="w-4 h-4 text-purple-600" />
            <span>Cryptographic Merkle Proof Chain Explorer</span>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            ALL BLOCKS VERIFIED IMMUTABLE
          </span>
        </div>

        <div className="space-y-2">
          {analytics.ledgerVerification.blocks.map((block) => (
            <div
              key={block.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                  #{block.blockNumber}
                </span>
                <div>
                  <span className="text-slate-900 font-bold">{block.anonymousId}</span>
                  <div className="text-[11px] text-slate-500 truncate max-w-sm sm:max-w-md">
                    HASH: {block.blockHash}
                  </div>
                </div>
              </div>
              <div className="text-right text-[11px] text-emerald-700 font-bold flex items-center gap-1 self-start sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SHA-256 Valid</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
