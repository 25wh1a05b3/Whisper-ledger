import React from 'react';
import { ShieldCheck, Lock, EyeOff, KeyRound, CheckCircle, X } from 'lucide-react';

export const PrivacyShieldModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden">
        {/* Soft Decorative Ambient Blob */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-blue-100/60 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-36 h-36 bg-amber-100/60 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200/90 flex items-center justify-center text-blue-600 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Student Identity Protection Shield</h3>
              <p className="text-xs text-blue-600 font-semibold">Zero-Knowledge Anonymity Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative space-y-3.5 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <EyeOff className="w-4 h-4 text-emerald-600" />
              <span>1. Why can no faculty or administrator identify you?</span>
            </div>
            <p className="text-slate-600">
              When you submit a complaint, your real student user account is <strong className="text-slate-900">never linked or stored</strong> in the public complaints registry. Instead, a one-way mathematical salt is calculated (<code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-700 font-mono">SHA256(studentId + complaintId)</code>). Only a pseudonymous token like <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-emerald-700 font-mono">ANON-HOST-8941</code> is ever visible.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>2. How does 2-Way Anonymous Chat keep you safe?</span>
            </div>
            <p className="text-slate-600">
              The HOD, Dean, or Grievance Committee communicates through an encrypted channel where your name is masked as <strong className="text-slate-900">"Anonymous Student (Author)"</strong>. You can answer inquiries, provide clarifications, or submit photos without retaliation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <KeyRound className="w-4 h-4 text-purple-600" />
              <span>3. Cryptographic Tamper-Proof Chain</span>
            </div>
            <p className="text-slate-600">
              Every complaint is cryptographically sealed onto a SHA-256 block ledger. Administrators cannot secretly delete reports or suppress unfavorable issues without breaking the verification hash.
            </p>
          </div>

          <div className="flex items-center gap-2 text-emerald-700 font-semibold pt-1">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed compliance with Campus Whistleblower Protections</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm shadow-blue-500/25 transition-all"
          >
            I Understand My Identity is Protected
          </button>
        </div>
      </div>
    </div>
  );
};
