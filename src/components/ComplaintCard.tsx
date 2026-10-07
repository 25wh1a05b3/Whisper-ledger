import React, { useState } from 'react';
import { Complaint } from '../types';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { ThumbsUp, MessageSquare, ShieldCheck, Flame, ArrowRight, Building, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ComplaintCardProps {
  complaint: Complaint;
  onSelect: (id: string) => void;
  onSupportToggle?: (id: string) => Promise<void>;
  hasSupported?: boolean;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onSelect,
  onSupportToggle,
  hasSupported = false,
}) => {
  const [supported, setSupported] = useState<boolean>(hasSupported);
  const [supportCount, setSupportCount] = useState<number>(complaint.supportCount);
  const [isSupporting, setIsSupporting] = useState<boolean>(false);

  const handleSupport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSupporting) return;
    setIsSupporting(true);

    try {
      if (onSupportToggle) {
        await onSupportToggle(complaint.id);
      }
      const newSupported = !supported;
      setSupported(newSupported);
      setSupportCount((prev) => (newSupported ? prev + 1 : Math.max(1, prev - 1)));

      if (newSupported) {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6'],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSupporting(false);
    }
  };

  const isTrending = supportCount >= 20;

  return (
    <div
      onClick={() => onSelect(complaint.id)}
      className="group relative bg-white/95 hover:bg-white border border-slate-200/90 hover:border-blue-300 rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.08)] transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-blue-700 bg-blue-50/90 border border-blue-200/80 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {complaint.anonymousId}
            </span>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {complaint.category}
            </span>
            <PriorityBadge priority={complaint.priority} />
          </div>
          <StatusBadge status={complaint.status} size="sm" />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug">
          {complaint.title}
        </h3>

        {/* Description snippet */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {complaint.description}
        </p>
      </div>

      {/* Meta & Footer */}
      <div>
        <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3 mb-3.5">
          <div className="flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[120px] font-medium">{complaint.department}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
          </div>
          {isTrending && (
            <div className="flex items-center gap-1 text-amber-800 font-bold bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
              Trending ({supportCount})
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Me-Too Support Button */}
          <button
            type="button"
            onClick={handleSupport}
            disabled={isSupporting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              supported
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-200'
                : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/90'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${supported ? 'fill-white' : ''}`} />
            <span>{supported ? 'Endorsed' : 'Me Too'}</span>
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-mono font-bold ${
                supported ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-800'
              }`}
            >
              {supportCount}
            </span>
          </button>

          {/* Chat & Details CTA */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-600 group-hover:text-blue-700 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <MessageSquare className="w-3.5 h-3.5" />
              Anonymous Chat
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
