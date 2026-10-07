import React from 'react';
import { ShieldCheck, Lock, Cpu, Clock, Terminal, GraduationCap, Heart } from 'lucide-react';

export const Footer: React.FC<{ onOpenArchitecture: () => void; onOpenPrivacy: () => void }> = ({
  onOpenArchitecture,
  onOpenPrivacy,
}) => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white/70 backdrop-blur-sm text-slate-600 text-xs py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span className="font-extrabold text-slate-900 text-sm tracking-tight">WHISPER LEDGER</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Privacy-first campus grievance platform. Students submit complaints anonymously while institutions are held accountable through automated escalation and cryptographic immutable ledgers.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 w-fit px-2.5 py-1 rounded-md border border-emerald-200">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero Student Identifiers Stored on Public Records</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Core Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer" onClick={onOpenPrivacy}>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Zero-Knowledge Anonymity</span>
              </li>
              <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer" onClick={onOpenArchitecture}>
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                <span>AI Problem Clustering</span>
              </li>
              <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer" onClick={onOpenArchitecture}>
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>7/14/21 Day Auto-Escalation</span>
              </li>
              <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer" onClick={onOpenArchitecture}>
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>SHA-256 Tamper-Proof Chain</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Campus Roles</h4>
            <ul className="space-y-2 text-xs">
              <li><strong className="text-slate-800">Students:</strong> Anonymous submission & "Me Too" voting</li>
              <li><strong className="text-slate-800">HOD Office:</strong> Department Level SLA (7 Days)</li>
              <li><strong className="text-slate-800">Dean Welfare:</strong> Institutional Level SLA (14 Days)</li>
              <li><strong className="text-slate-800">Grievance Committee:</strong> Anti-Ragging & Compliance (21 Days)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Technology Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200">React 19</span>
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200">Vite</span>
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200">Spring Boot 3</span>
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200">Java 17</span>
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200">MySQL</span>
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200">Gemini AI</span>
            </div>
            <button
              onClick={onOpenArchitecture}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 transition-colors"
            >
              View Full Spring Boot & MySQL Spec
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <p className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>© 2026 Whisper Ledger • Campus Student Privacy & Whistleblower Charter</span>
          </p>
          <p className="mt-2 sm:mt-0 font-medium">Designed for Students • Accountable for Institutions</p>
        </div>
      </div>
    </footer>
  );
};
