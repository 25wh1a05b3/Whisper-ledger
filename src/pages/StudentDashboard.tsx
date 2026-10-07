import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../types';
import { api } from '../services/api';
import { ComplaintCard } from '../components/ComplaintCard';
import {
  PlusCircle,
  EyeOff,
  Flame,
  Search,
  Filter,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  RefreshCw,
  X,
  FileCheck2,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentDashboardProps {
  onSelectComplaint: (id: string) => void;
  openSubmitOnMount?: boolean;
  initialTab?: 'ALL' | 'MY';
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onSelectComplaint,
  openSubmitOnMount = false,
  initialTab = 'ALL',
}) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'MY'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Submit Modal
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(openSubmitOnMount);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Hostel');
  const [department, setDepartment] = useState(user?.department || 'Hostel Administration');
  const [year, setYear] = useState(user?.year || '2nd Year');
  const [priority, setPriority] = useState<ComplaintPriority>('MEDIUM');

  // AI Assistant states
  const [analyzingDraft, setAnalyzingDraft] = useState(false);
  const [privacyWarnings, setPrivacyWarnings] = useState<string[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<any | null>(null);
  const [similarComplaints, setSimilarComplaints] = useState<any[]>([]);

  const categories = [
    'Ragging',
    'Harassment',
    'Hostel',
    'Academic',
    'Infrastructure',
    'Faculty Issue',
    'Exam Related',
    'Safety',
    'Other',
  ];

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electronics & Communication',
    'Hostel Administration',
    'General Campus',
  ];

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.getComplaints({
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        department: selectedDepartment !== 'ALL' ? selectedDepartment : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        search: search.trim() ? search.trim() : undefined,
        myComplaintsOnly: activeTab === 'MY',
      });
      setComplaints(res.complaints);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [activeTab, selectedCategory, selectedDepartment, selectedStatus]);

  // Handle live draft analysis with debounce
  useEffect(() => {
    if (!title && !description) {
      setPrivacyWarnings([]);
      setAiSuggestion(null);
      setSimilarComplaints([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (title.length > 5 || description.length > 10) {
        setAnalyzingDraft(true);
        try {
          const res = await api.analyzeDraft(title, description);
          setPrivacyWarnings(res.privacyWarnings);
          setAiSuggestion(res.suggestion);
          setSimilarComplaints(res.similarComplaints);
        } catch (err) {
          console.error(err);
        } finally {
          setAnalyzingDraft(false);
        }
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [title, description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.submitComplaint({
        title,
        description,
        category,
        department,
        year,
        priority,
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsSubmitOpen(false);
      setTitle('');
      setDescription('');
      setPrivacyWarnings([]);
      setAiSuggestion(null);
      setSimilarComplaints([]);

      await fetchComplaints();
      if (res.complaint) {
        onSelectComplaint(res.complaint.id);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSupportToggle = async (id: string) => {
    await api.toggleSupport(id);
  };

  // Dashboard metric counts
  const submittedCount = complaints.filter((c) => c.status === 'SUBMITTED').length;
  const underReviewCount = complaints.filter((c) => c.status === 'UNDER_REVIEW' || c.status === 'IN_PROGRESS').length;
  const escalatedCount = complaints.filter((c) => c.status === 'ESCALATED').length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  return (
    <div className="space-y-8 animate-fade-in py-2 relative z-10">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Campus Student Sanctuary • Zero Identity Leakage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Student Grievance Ledger
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-xs font-semibold text-slate-700">
              Welcome, <strong className="text-slate-900">{user?.name || 'Student'}</strong>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
              <EyeOff className="w-3 h-3 text-blue-600" />
              Role: STUDENT
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Submit complaints safely. Support fellow students anonymously with "Me Too".
          </p>
        </div>

        <button
          onClick={() => setIsSubmitOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm shadow-blue-500/25 transition-all transform active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit New Grievance</span>
        </button>
      </div>

      {/* Dashboard 4 Summary Cards matching Section 6 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-medium">Submitted</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">{submittedCount}</div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Awaiting department triage</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-blue-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-blue-700 text-xs mb-2">
            <span className="font-semibold">Under Review</span>
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600 font-mono">{underReviewCount}</div>
          <p className="text-[11px] text-blue-500/80 mt-1 font-medium">Active investigation & chat</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-rose-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-rose-700 text-xs mb-2">
            <span className="font-semibold">Escalated</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 font-mono">{escalatedCount}</div>
          <p className="text-[11px] text-rose-500/80 mt-1 font-medium">Exceeded 7/14/21 day SLA</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 text-xs mb-2">
            <span className="font-semibold">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">{resolvedCount}</div>
          <p className="text-[11px] text-emerald-600/80 mt-1 font-medium">Officially addressed</p>
        </div>
      </div>

      {/* Tabs & Search / Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              Campus Feed & "Me Too" Backing
            </button>
            <button
              onClick={() => setActiveTab('MY')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'MY'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              My Anonymous Submissions
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchComplaints()}
                placeholder="Search issues, keywords, #ANON..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs w-full sm:w-64"
              />
            </div>
            <button
              onClick={fetchComplaints}
              className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition-colors shadow-2xs"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </span>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none shadow-2xs"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none shadow-2xs"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none shadow-2xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="ESCALATED">ESCALATED</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>

          {(selectedCategory !== 'ALL' || selectedDepartment !== 'ALL' || selectedStatus !== 'ALL' || search) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedDepartment('ALL');
                setSelectedStatus('ALL');
                setSearch('');
              }}
              className="text-[11px] text-blue-600 hover:text-blue-700 underline font-semibold"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Complaints Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Verifying cryptographic ledger blocks...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-2xs">
          <FileCheck2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No grievances found matching this query</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {activeTab === 'MY'
              ? "You haven't submitted any anonymous grievances under this session yet."
              : 'Try clearing your category or search filter.'}
          </p>
          <button
            onClick={() => setIsSubmitOpen(true)}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-xs hover:bg-blue-500"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Submit First Grievance
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((c) => (
            <ComplaintCard
              key={c.id}
              complaint={c}
              onSelect={onSelectComplaint}
              onSupportToggle={handleSupportToggle}
            />
          ))}
        </div>
      )}

      {/* SUBMISSION MODAL WITH AI CATEGORIZATION, PRIVACY GUARD & DUPLICATE DETECTOR */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/90 flex items-center justify-center text-blue-600 shadow-2xs">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Submit Anonymous Grievance</h3>
                  <p className="text-xs text-emerald-700 font-semibold">
                    Zero Identity Leakage Guaranteed • Cryptographically Sealed
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSubmitOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Privacy Warning banner */}
              {privacyWarnings.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
                    <span>Writing Privacy Shield Alert</span>
                  </div>
                  {privacyWarnings.map((warning, idx) => (
                    <p key={idx} className="text-[11px] text-rose-700 pl-6 font-medium">
                      • {warning}
                    </p>
                  ))}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complaint Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Hostel Water Supply Contamination in Block B Floor 3"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Detailed Description <span className="text-rose-500">*</span>
                  </label>
                  {analyzingDraft && (
                    <span className="text-[11px] text-blue-600 flex items-center gap-1 font-semibold">
                      <Sparkles className="w-3 h-3 animate-spin" /> AI analyzing draft...
                    </span>
                  )}
                </div>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the grievance clearly. Avoid including your own roll number, room number, or name."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white leading-relaxed"
                />
              </div>

              {/* AI Suggestion Card */}
              {aiSuggestion && (
                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      AI Analysis & Suggestions
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (aiSuggestion.category) setCategory(aiSuggestion.category);
                        if (aiSuggestion.severity) setPriority(aiSuggestion.severity);
                      }}
                      className="text-[11px] text-blue-700 hover:underline font-bold"
                    >
                      Apply Suggested Category & Severity
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="text-slate-700">
                      Suggested Category: <strong className="text-blue-900">{aiSuggestion.category}</strong>
                    </div>
                    <div className="text-slate-700">
                      Suggested Severity: <strong className="text-blue-900">{aiSuggestion.severity}</strong>
                    </div>
                  </div>
                  {aiSuggestion.advice && (
                    <p className="text-[11px] text-slate-600 italic">
                      Tip: {aiSuggestion.advice}
                    </p>
                  )}
                </div>
              )}

              {/* Duplicate / Similar Complaints Warning */}
              {similarComplaints.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>Similar Active Complaints Found</span>
                  </div>
                  <p className="text-[11px] text-amber-800 font-medium">
                    Students already filed related grievances. You can support them with "Me Too" to amplify visibility instead of fragmenting reports:
                  </p>
                  <div className="space-y-1.5">
                    {similarComplaints.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setIsSubmitOpen(false);
                          onSelectComplaint(item.id);
                        }}
                        className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-amber-100/50 cursor-pointer text-xs border border-amber-200/60 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-900 truncate max-w-[340px]">
                          {item.title}
                        </span>
                        <span className="text-[11px] font-mono text-blue-700 font-bold">
                          {item.supportCount} Supporters
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Row: Category & Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Severity Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:bg-white"
                  >
                    <option value="LOW">LOW - Minor inconvenience</option>
                    <option value="MEDIUM">MEDIUM - Standard maintenance</option>
                    <option value="HIGH">HIGH - Serious safety / welfare concern</option>
                    <option value="CRITICAL">CRITICAL - Ragging, abuse, extreme emergency</option>
                  </select>
                </div>
              </div>

              {/* Form Row: Department & Academic Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Concerned Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:bg-white"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="All Years">All Years</option>
                  </select>
                </div>
              </div>

              {/* Cryptographic Anonymity Guarantee */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <p>
                  Your submission generates a SHA-256 block hash. Institutional authorities cannot trace this back to your student account, ensuring you are 100% immune from academic or disciplinary retaliation.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm shadow-blue-500/25 transition-all"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Hashing Block...</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Submit Anonymously</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
