import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Complaint, DashboardStats, ComplaintStatus, ComplaintPriority, ROLE_DISPLAY_NAMES } from '../types';
import { api } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import {
  Layers,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Building,
  Sparkles,
  ArrowRight,
  MessageSquare,
  ShieldAlert,
  FastForward,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  Building2,
  UserCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  onSelectComplaint: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectComplaint }) => {
  const { role, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Escalation simulator state
  const [simulatingEscalation, setSimulatingEscalation] = useState(false);
  const [escalationNotice, setEscalationNotice] = useState<string | null>(null);

  // AI Clustering trigger state
  const [clustering, setClustering] = useState(false);

  // Status Change Dialog
  const [selectedForStatus, setSelectedForStatus] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('UNDER_REVIEW');
  const [newPriority, setNewPriority] = useState<ComplaintPriority>('MEDIUM');
  const [remarks, setRemarks] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashStats, compList] = await Promise.all([
        api.getAdminDashboard(),
        api.getComplaints(),
      ]);
      setStats(dashStats);
      setComplaints(compList.complaints);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRunEscalationEngine = async (fastForwardDays: number = 7) => {
    setSimulatingEscalation(true);
    setEscalationNotice(null);
    try {
      const res = await api.triggerEscalationCheck(fastForwardDays);
      setEscalationNotice(res.message);
      await fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Escalation trigger failed');
    } finally {
      setSimulatingEscalation(false);
    }
  };

  const handleRunAiClustering = async () => {
    setClustering(true);
    try {
      const res = await api.clusterComplaints();
      alert(`AI Clustering analysis completed! Generated ${res.clusterCount} active recurrence alerts.`);
      await fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Clustering failed');
    } finally {
      setClustering(false);
    }
  };

  const handleSaveStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForStatus) return;

    setUpdatingStatus(true);
    try {
      await api.updateComplaintStatus(selectedForStatus.id, {
        status: newStatus,
        priority: newPriority,
        remarks: remarks.trim() || undefined,
      });

      setSelectedForStatus(null);
      setRemarks('');
      await fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Filter complaints
  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (deptFilter !== 'ALL' && !c.department.toLowerCase().includes(deptFilter.toLowerCase())) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.anonymousId.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in py-2 relative z-10">
      {/* Institutional Header with Active Role Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-700 font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Institutional Governance & Resolution Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {role === 'HOD' && 'Department Oversight (HOD Desk)'}
            {role === 'DEAN' && 'Dean of Student Welfare (Tier-2 SLA)'}
            {role === 'GRIEVANCE_COMMITTEE' && 'Campus Grievance Redressal Committee'}
            {role === 'ADMIN' && 'System Administrator & Cryptographic Audit'}
            {role === 'STUDENT' && 'Authority Preview Mode'}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs font-semibold text-slate-700">
              Welcome, <strong className="text-slate-900">{user?.name}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              Role: {role ? ROLE_DISPLAY_NAMES[role] || role : 'INSTITUTION'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Student identities remain 100% masked to preserve whistleblower safety.
          </p>
        </div>

        {/* Quick Action Tools for Evaluators */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRunAiClustering}
            disabled={clustering}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-all shadow-2xs"
            title="Cluster recurring grievances using Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{clustering ? 'Analyzing...' : 'Run AI Clustering'}</span>
          </button>

          <button
            onClick={() => handleRunEscalationEngine(7)}
            disabled={simulatingEscalation}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all shadow-2xs"
            title="Simulate 7 days passed to test automatic institutional SLA escalation"
          >
            <FastForward className="w-3.5 h-3.5 text-rose-600" />
            <span>{simulatingEscalation ? 'Escalating...' : 'Fast-Forward Time (+7 Days)'}</span>
          </button>
        </div>
      </div>

      {/* Escalation Notification Banner */}
      {escalationNotice && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Flame className="w-4 h-4 text-rose-600" />
            <span>{escalationNotice}</span>
          </div>
          <button onClick={() => setEscalationNotice(null)} className="text-rose-500 hover:text-rose-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Row Section 12 */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Total Grievances</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{stats.totalComplaints}</div>
            <span className="text-[10px] text-slate-400 font-medium">100% on ledger</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-blue-200/90 shadow-2xs">
            <span className="text-xs text-blue-700 font-medium">Open / Under Review</span>
            <div className="text-2xl font-extrabold text-blue-600 font-mono mt-1">{stats.openComplaints}</div>
            <span className="text-[10px] text-slate-400 font-medium">Triage stage</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-2xs">
            <span className="text-xs text-amber-700 font-medium">In Progress</span>
            <div className="text-2xl font-extrabold text-amber-600 font-mono mt-1">{stats.inProgressComplaints}</div>
            <span className="text-[10px] text-slate-400 font-medium">Action scheduled</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-rose-200/90 shadow-2xs">
            <span className="text-xs text-rose-700 font-medium">Escalated (SLA Breached)</span>
            <div className="text-2xl font-extrabold text-rose-600 font-mono mt-1">{stats.escalatedComplaints}</div>
            <span className="text-[10px] text-rose-500 font-medium">Tier-2 / Tier-3</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-xs text-emerald-700 font-medium">Resolution Rate</span>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">{stats.resolutionRate}%</div>
            <span className="text-[10px] text-slate-400 font-medium">{stats.resolvedComplaints} resolved</span>
          </div>
        </div>
      )}

      {/* AI System Alerts Panel (Section 10) */}
      {stats && stats.activeAlerts && stats.activeAlerts.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/70 border border-amber-200/90 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">
                AI Detected Systemic Clusters & Alerts
              </h3>
            </div>
            <span className="text-xs text-amber-700 font-medium">Gemini Semantic Clustering</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{alert.title}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>Category: <strong>{alert.clusterCategory}</strong></span>
                  <span className="font-mono text-blue-700 font-bold">{alert.complaintCount} Student Endorsements</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complaints Table & Filters */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Campus Grievance Queue</h3>
            <p className="text-xs text-slate-500">
              Manage statuses, post resolution remarks, and communicate with anonymous authors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search queue..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white w-52"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="ESCALATED">ESCALATED</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/90">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">Anonymous ID</th>
                <th className="py-3 px-4">Title & Category</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Me Too</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-blue-700 font-bold whitespace-nowrap">
                    {item.anonymousId}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-slate-900 truncate">{item.title}</div>
                    <div className="text-[11px] text-slate-500">{item.category}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{item.department}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-amber-700 font-bold">
                    +{item.supportCount}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedForStatus(item);
                          setNewStatus(item.status);
                          setNewPriority(item.priority);
                          setRemarks(item.resolutionRemarks || '');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold"
                      >
                        Update Status
                      </button>
                      <button
                        onClick={() => onSelectComplaint(item.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        title="Open Anonymous Chat"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedForStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Update Grievance Status</h3>
                <p className="text-xs text-blue-700 font-mono mt-0.5 font-semibold">
                  Target: {selectedForStatus.anonymousId}
                </p>
              </div>
              <button
                onClick={() => setSelectedForStatus(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatusUpdate} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Complaint Title</label>
                <div className="p-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200">
                  {selectedForStatus.title}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="ESCALATED">ESCALATED</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assigned Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as ComplaintPriority)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Official Administrative Remarks / Resolution Notes
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="State the actions taken, inspection date, or corrective measures..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedForStatus(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm shadow-blue-500/25"
                >
                  {updatingStatus ? 'Updating Ledger...' : 'Commit Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
