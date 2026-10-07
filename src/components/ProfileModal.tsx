import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLE_DISPLAY_NAMES } from '../types';
import {
  User as UserIcon,
  Shield,
  EyeOff,
  Building2,
  UserCheck,
  Code2,
  Check,
  X,
  LogOut,
  Lock,
  Mail,
  GraduationCap,
  Sparkles,
  KeyRound,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const { user, role } = useAuth();

  if (!isOpen || !user || !role) return null;

  const roleTitle = ROLE_DISPLAY_NAMES[role] || role;

  const getRoleBadgeStyle = () => {
    switch (role) {
      case 'STUDENT':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: EyeOff,
          accent: 'from-blue-600 to-indigo-600',
        };
      case 'HOD':
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-200',
          icon: Building2,
          accent: 'from-indigo-600 to-violet-600',
        };
      case 'DEAN':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-200',
          icon: UserCheck,
          accent: 'from-amber-600 to-orange-600',
        };
      case 'GRIEVANCE_COMMITTEE':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          icon: Shield,
          accent: 'from-rose-600 to-pink-600',
        };
      case 'ADMIN':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          icon: Code2,
          accent: 'from-purple-600 to-indigo-700',
        };
    }
  };

  const badgeStyle = getRoleBadgeStyle();
  const BadgeIcon = badgeStyle.icon;

  const getRolePermissions = () => {
    if (role === 'STUDENT') {
      return {
        can: [
          'Submit grievances with zero identity leakage',
          'Track status of authored complaints',
          'Endorse grievances with anonymous "Me Too"',
          'Engage in private masked chat with authorities',
          'View real-time status updates and resolutions',
        ],
        cannot: [
          'Change or override grievance statuses',
          'View institutional admin console',
          'Access identity of other student authors',
          'Manually trigger institution-wide escalation SLA',
        ],
      };
    }

    if (role === 'HOD') {
      return {
        can: [
          'View department-level complaints and triage queue',
          'Update grievance statuses (Under Review, In Progress, Resolved)',
          'Communicate officially with students under masked identity',
          'Handle Tier-1 7-day departmental SLA escalations',
          'View department grievance resolution metrics',
        ],
        cannot: [
          'Unmask student author identity (cryptographically stripped)',
          'Delete immutable blockchain ledger records',
          'Modify system-level server settings',
        ],
      };
    }

    if (role === 'DEAN') {
      return {
        can: [
          'View escalated complaints across all campus faculties',
          'Update grievance status with official executive remarks',
          'Handle Tier-2 14-day SLA welfare escalations',
          'Direct department heads to prioritize critical issues',
          'Access institutional analytics and category hotspots',
        ],
        cannot: [
          'Unmask whistleblower identities',
          'Bypass the cryptographic verification layer',
        ],
      };
    }

    if (role === 'GRIEVANCE_COMMITTEE') {
      return {
        can: [
          'Review critical anti-ragging, safety, and severe grievances',
          'Handle Tier-3 21-day statutory compliance escalations',
          'Conduct multi-member resolution hearings anonymously',
          'Issue formal institutional redressal directives',
          'Access compliance and dispute analytics',
        ],
        cannot: [
          'Unmask anonymous student whistleblowers',
          'Alter historical cryptographic blocks',
        ],
      };
    }

    return {
      can: [
        'Manage users and authorization roles',
        'Inspect immutable cryptographic ledger SHA-256 integrity',
        'Trigger automated SLA escalation engine simulation',
        'Execute Gemini AI grievance clustering & recurrence alerts',
        'Oversee full institutional resolution console and audit logs',
      ],
      cannot: [
        'De-anonymize salted student hashes without breaking SHA-256',
      ],
    };
  };

  const permissions = getRolePermissions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${badgeStyle.accent} text-white flex items-center justify-center shadow-md`}
            >
              <BadgeIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono font-bold uppercase">
                Whisper Ledger Profile
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {user.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Badge Section (Section 4) */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Assigned Authorization
            </span>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border} shadow-2xs`}
            >
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>Role: {roleTitle}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
            <div>
              <span className="text-slate-400 block text-[10px] font-medium">
                Email
              </span>
              <span className="font-semibold text-slate-800 break-all">
                {user.email}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-medium">
                Department
              </span>
              <span className="font-semibold text-slate-800">
                {user.department || 'Campus Wide'}
              </span>
            </div>
          </div>
        </div>

        {/* Role Permissions Matrix (Section 5) */}
        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Authorized Capabilities</span>
            </h4>
            <div className="space-y-1.5">
              {permissions.can.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <X className="w-4 h-4 text-rose-600" />
              <span>Restricted by Policy</span>
            </h4>
            <div className="space-y-1.5">
              {permissions.cannot.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-600 bg-rose-50/40 p-2 rounded-xl border border-rose-100"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cryptographic Session Guarantee */}
        <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#19D3F3]" />
            <div>
              <div className="font-bold text-[11px] text-white">
                JWT Session Authenticated
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                HMAC-SHA256 • Zero Identity Leakage
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
            ACTIVE
          </span>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
