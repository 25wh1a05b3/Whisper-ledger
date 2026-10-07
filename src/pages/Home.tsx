import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  EyeOff,
  Flame,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle,
  FileText,
  Lock,
  MessageSquare,
  Building,
  Activity,
  Code2,
  BookOpen,
  GraduationCap,
  Users,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (tab: string) => void;
  onOpenSubmit: () => void;
  onOpenPrivacy: () => void;
  onSelectComplaint: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  onNavigate,
  onOpenSubmit,
  onOpenPrivacy,
}) => {
  const { switchDemoRole } = useAuth();

  return (
    <div className="space-y-14 py-4 animate-fade-in relative z-10">
      {/* Hero Section: Fresh, Energetic, Inviting Academic Atmosphere */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sky-50/50 to-amber-50/40 border border-slate-200/90 p-8 sm:p-12 shadow-sm">
        {/* Soft Organic Background Washes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-gradient-to-bl from-blue-200/30 via-indigo-100/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-gradient-to-tr from-amber-100/40 via-yellow-100/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-2xs">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Campus Whistleblower & Anonymous Grievance Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
            Anonymous for Students.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              Accountable for Institutions.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
            Speak up safely without fear of retribution. Whisper Ledger uses zero-knowledge cryptography so students can report campus issues, build solidarity with <strong className="text-slate-800">"Me Too" support</strong>, and trigger automatic administrative escalation when complaints are ignored.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <button
              onClick={onOpenSubmit}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all transform active:scale-95"
            >
              <EyeOff className="w-4 h-4" />
              <span>Submit Anonymous Grievance</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>Campus Feed & "Me Too"</span>
            </button>

            <button
              onClick={onOpenPrivacy}
              className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl text-blue-700 hover:text-blue-800 text-xs font-semibold underline underline-offset-4"
            >
              <Lock className="w-3.5 h-3.5" />
              How Anonymity Works
            </button>
          </div>
        </div>

        {/* Live Ledger Ticker Stats */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">100%</div>
            <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Zero Student Identity Leak
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono">284+</div>
            <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              "Me Too" Endorsements
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">7 / 14 / 21</div>
            <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Days SLA Escalation Tiers
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">SHA-256</div>
            <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Lock className="w-3.5 h-3.5 text-purple-600" />
              Tamper-Proof Block Ledger
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Pillars of Whisper Ledger */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered to Overcome Campus Inaction
          </h2>
          <p className="text-sm text-slate-600">
            Traditional grievance boxes collect dust because students fear retaliation and authorities ignore single reports. Whisper Ledger changes the power dynamics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Zero-Leak Student Cryptography</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Student identities are mathematically scrubbed. Only a salted one-way hash verifies legitimate enrollment. Faculty and HODs only see pseudonyms like <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">ANON-HOST-8941</code>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Anonymous "Me Too" Consensus</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multiple students facing the same issue (hostel water contamination, lab failures) can endorse with one click. Community consensus elevates complaint priority automatically.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">3. AI Recurring Issue Clustering</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered by Gemini AI, similar complaints across wings and departments are clustered to generate automated alerts like <em className="text-slate-800">"25 Complaints about Hostel WiFi Detected"</em>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">4. Multi-Tier Auto Escalation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dormant grievances cannot be silenced. Pending &gt; 7 days escalates to HOD; &gt; 14 days escalates to the Dean; &gt; 21 days escalates to the Grievance Redressal Committee.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">5. Blind Two-Way Messaging</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authorities can ask clarifying questions, request photo evidence, and post official notices directly in a private chat thread without ever piercing the student's veil of anonymity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">6. Cryptographic Tamper-Proof Chain</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every complaint is cryptographically bound into a block linked to previous hashes. Prevents university authorities from quietly deleting or altering embarrassing complaints.
            </p>
          </div>
        </div>
      </section>

      {/* Role Demonstration Switchboard for Judges */}
      <section className="p-8 rounded-3xl bg-white/90 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 uppercase font-bold tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              Hackathon Evaluation Console
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Test Whisper Ledger Across All Campus Roles
            </h3>
            <p className="text-xs text-slate-500">
              Switch roles with one click to experience the complete workflow: submission, AI detection, two-way chat, escalation, and resolution.
            </p>
          </div>
          <button
            onClick={() => onNavigate('architecture')}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <Code2 className="w-4 h-4 text-amber-600" />
            View Spring Boot Backend Code
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div
            onClick={async () => {
              await switchDemoRole('STUDENT');
              onNavigate('dashboard');
            }}
            className="p-4 rounded-2xl bg-slate-50/80 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 cursor-pointer transition-all hover:scale-[1.01] group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-700">Role 1: Student</span>
              <EyeOff className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-slate-800 font-semibold">Anonymous Submitter</p>
            <p className="text-[11px] text-slate-500 mt-1">Submit, verify draft privacy, and endorse campus complaints with Me Too.</p>
          </div>

          <div
            onClick={async () => {
              await switchDemoRole('HOD');
              onNavigate('admin');
            }}
            className="p-4 rounded-2xl bg-slate-50/80 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all hover:scale-[1.01] group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-700">Role 2: HOD CSE</span>
              <Building className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-xs text-slate-800 font-semibold">Tier-1 Department Head</p>
            <p className="text-[11px] text-slate-500 mt-1">Review lab & academic issues, update progress, and reply anonymously to students.</p>
          </div>

          <div
            onClick={async () => {
              await switchDemoRole('DEAN');
              onNavigate('admin');
            }}
            className="p-4 rounded-2xl bg-slate-50/80 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 cursor-pointer transition-all hover:scale-[1.01] group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-800">Role 3: Dean</span>
              <Layers className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xs text-slate-800 font-semibold">Tier-2 Institutional Oversight</p>
            <p className="text-[11px] text-slate-500 mt-1">Oversees hostel, safety, and escalated complaints that breached 14-day SLA.</p>
          </div>

          <div
            onClick={async () => {
              await switchDemoRole('GRIEVANCE_COMMITTEE');
              onNavigate('admin');
            }}
            className="p-4 rounded-2xl bg-slate-50/80 hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 cursor-pointer transition-all hover:scale-[1.01] group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-700">Role 4: Committee</span>
              <ShieldCheck className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-xs text-slate-800 font-semibold">Tier-3 Anti-Ragging</p>
            <p className="text-[11px] text-slate-500 mt-1">Handles critical ragging, harassment, and cases escalated beyond 21 days.</p>
          </div>

          <div
            onClick={async () => {
              await switchDemoRole('ADMIN');
              onNavigate('admin');
            }}
            className="p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/60 border border-slate-200 hover:border-purple-300 cursor-pointer transition-all hover:scale-[1.01] group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-700">Role 5: Admin</span>
              <Code2 className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs text-slate-800 font-semibold">System Administrator</p>
            <p className="text-[11px] text-slate-500 mt-1">Ledger cryptographic audit, automated escalation engine, and system settings.</p>
          </div>
        </div>
      </section>

      {/* SLA Timeline Infographic */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-blue-50/60 via-indigo-50/30 to-white border border-slate-200/90 space-y-6">
        <div className="max-w-xl">
          <div className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
            Automated Escalation Architecture
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            Complaints Never Expire in University Bureaucracy
          </h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            If an authority does not act, Whisper Ledger automatically transfers authority upward and alerts higher governance bodies with audit logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 border-t-4 border-t-blue-500">
            <div className="text-xs font-mono text-blue-700 font-bold">STAGE 1: 0 to 7 DAYS</div>
            <h4 className="text-base font-bold text-slate-900">Department Resolution (HOD)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assigned directly to the concerned department head (CSE, Hostel, ECE). HOD begins fact-checking via anonymous chat.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 border-t-4 border-t-amber-500">
            <div className="text-xs font-mono text-amber-700 font-bold">STAGE 2: &gt; 14 DAYS PENDING</div>
            <h4 className="text-base font-bold text-slate-900">Institutional Escalation (Dean)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Department SLA breached. System transfers oversight to Dean of Student Welfare. HOD is flagged for delayed action.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 border-t-4 border-t-rose-500">
            <div className="text-xs font-mono text-rose-700 font-bold">STAGE 3: &gt; 21 DAYS PENDING</div>
            <h4 className="text-base font-bold text-slate-900">Anti-Ragging / Executive Committee</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mandatory intervention by Campus Grievance Redressal Committee. Public escalation audit logged in immutable ledger.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
