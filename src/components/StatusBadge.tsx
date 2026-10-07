import React from 'react';
import { ComplaintStatus, ComplaintPriority } from '../types';
import { AlertCircle, CheckCircle2, Clock, Flame, ShieldAlert, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[11px] font-semibold px-2.5 py-0.5 gap-1 rounded-full',
    md: 'text-xs font-semibold px-3 py-1 gap-1.5 rounded-full',
    lg: 'text-sm font-semibold px-3.5 py-1.5 gap-2 rounded-full',
  }[size];

  switch (status) {
    case 'SUBMITTED':
      return (
        <span className={`inline-flex items-center bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>SUBMITTED</span>
        </span>
      );
    case 'UNDER_REVIEW':
      return (
        <span className={`inline-flex items-center bg-sky-50 text-sky-800 border border-sky-200/90 shadow-2xs ${sizeClasses}`}>
          <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
          <span>UNDER REVIEW</span>
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className={`inline-flex items-center bg-amber-50 text-amber-800 border border-amber-200/90 shadow-2xs ${sizeClasses}`}>
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>IN PROGRESS</span>
        </span>
      );
    case 'ESCALATED':
      return (
        <span className={`inline-flex items-center bg-rose-50 text-rose-700 border border-rose-200/90 shadow-2xs ${sizeClasses}`}>
          <Flame className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
          <span>ESCALATED</span>
        </span>
      );
    case 'RESOLVED':
      return (
        <span className={`inline-flex items-center bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>RESOLVED</span>
        </span>
      );
    case 'CLOSED':
      return (
        <span className={`inline-flex items-center bg-zinc-100 text-zinc-600 border border-zinc-200/90 shadow-2xs ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
          <span>CLOSED</span>
        </span>
      );
    default:
      return null;
  }
};

export const PriorityBadge: React.FC<{ priority: ComplaintPriority }> = ({ priority }) => {
  switch (priority) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200/80">
          <ShieldAlert className="w-3 h-3 text-rose-600" />
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200/80">
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80">
          MEDIUM
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
          LOW
        </span>
      );
  }
};
