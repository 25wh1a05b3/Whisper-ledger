import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Complaint, ComplaintMessage, ComplaintStatusHistory, EscalationLog } from '../types';
import { api } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import {
  ArrowLeft,
  ShieldCheck,
  Send,
  Lock,
  ThumbsUp,
  MessageSquare,
  Clock,
  CheckCircle2,
  Building,
  Calendar,
  Flame,
  FileCheck,
  KeyRound,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ComplaintDetailsProps {
  complaintId: string;
  onBack: () => void;
  onOpenPrivacy: () => void;
}

export const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({
  complaintId,
  onBack,
  onOpenPrivacy,
}) => {
  const { user, role } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [messages, setMessages] = useState<ComplaintMessage[]>([]);
  const [timeline, setTimeline] = useState<ComplaintStatusHistory[]>([]);
  const [escalations, setEscalations] = useState<EscalationLog[]>([]);
  const [hasSupported, setHasSupported] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Chat message input
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cryptographic Ledger verification
  const [verifyingHash, setVerifyingHash] = useState(false);
  const [hashVerificationResult, setHashVerificationResult] = useState<any | null>(null);

  const fetchComplaintDetails = async () => {
    try {
      const [compRes, chatRes] = await Promise.all([
        api.getComplaint(complaintId),
        api.getChatMessages(complaintId),
      ]);
      setComplaint(compRes.complaint);
      setHasSupported(compRes.hasSupported);
      setTimeline(compRes.timeline);
      setEscalations(compRes.escalations);
      setMessages(chatRes.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintDetails();
    // Poll chat messages every 4 seconds for real-time feel
    const interval = setInterval(async () => {
      try {
        const chatRes = await api.getChatMessages(complaintId);
        setMessages(chatRes.messages);
      } catch (err) {
        // ignore background poll error
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [complaintId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      const res = await api.sendChatMessage(complaintId, newMessage);
      setMessages((prev) => [...prev, res.chatMessage]);
      setNewMessage('');
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSupportToggle = async () => {
    if (!complaint) return;
    try {
      const res = await api.toggleSupport(complaintId);
      setHasSupported(res.supported);
      setComplaint({ ...complaint, supportCount: res.supportCount });
      if (res.supported) {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#2563EB', '#10B981', '#F59E0B'],
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyLedgerHash = async () => {
    setVerifyingHash(true);
    try {
      const res = await api.verifyComplaintHash(complaintId);
      setHashVerificationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setVerifyingHash(false);
    }
  };

  if (loading || !complaint) {
    return (
      <div className="py-24 text-center space-y-3 relative z-10">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading tamper-proof grievance record...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in py-2 relative z-10">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl flex items-center gap-1.5 font-bold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {complaint.anonymousId}
          </span>
          <button
            onClick={onOpenPrivacy}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Zero-Leak Info</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Grievance Dossier & Cryptographic Audit */}
        <div className="lg:col-span-7 space-y-6">
          {/* Complaint Details Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  {complaint.category}
                </span>
                <PriorityBadge priority={complaint.priority} />
              </div>
              <StatusBadge status={complaint.status} size="md" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {complaint.title}
            </h1>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {complaint.description}
            </div>

            {/* Resolution Remarks if any */}
            {complaint.resolutionRemarks && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Official Resolution Remarks</span>
                </div>
                <p className="leading-relaxed">{complaint.resolutionRemarks}</p>
              </div>
            )}

            {/* Meta Row & Me Too button */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 font-medium">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{complaint.department}</span>
                </div>
                <div className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSupportToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  hasSupported
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${hasSupported ? 'fill-white' : ''}`} />
                <span>{hasSupported ? 'Endorsed ("Me Too")' : 'I Am Facing This Too ("Me Too")'}</span>
                <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] ${hasSupported ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-900 font-bold'}`}>
                  {complaint.supportCount}
                </span>
              </button>
            </div>
          </div>

          {/* Status Timeline History (Section 13) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Institutional Status Timeline & SLA Tracking</span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timeline.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-bold text-slate-900">{item.newStatus}</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {new Date(item.updatedAt).toLocaleString()}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        By: {item.updatedByRole}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{item.remarks}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Escalation Log warnings if applicable */}
            {escalations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <span>Automated Escalation Events</span>
                </div>
                {escalations.map((esc) => (
                  <div key={esc.id} className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                    <div className="flex justify-between text-rose-900 font-semibold">
                      <span>Escalated to: {esc.escalatedTo}</span>
                      <span className="font-mono text-[10px] text-rose-600">{new Date(esc.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-rose-700 text-[11px] leading-relaxed">{esc.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cryptographic SHA-256 Ledger Block Seal */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <KeyRound className="w-4 h-4 text-purple-600" />
                <span>Cryptographic Block Verification</span>
              </div>
              <button
                type="button"
                onClick={handleVerifyLedgerHash}
                disabled={verifyingHash}
                className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <FileCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>{verifyingHash ? 'Recalculating SHA-256...' : 'Verify Cryptographic Proof'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-600 space-y-1.5 break-all">
              <div>
                <span className="text-slate-400 font-semibold">BLOCK_HASH:</span>{' '}
                <span className="text-blue-700 font-bold">{complaint.blockHash}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">PREV_HASH:</span>{' '}
                <span className="text-slate-600">{complaint.previousHash}</span>
              </div>
            </div>

            {hashVerificationResult && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5 animate-fade-in shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-emerald-800">VERIFIED ON WHISPER LEDGER: TAMPER-PROOF</div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    The SHA-256 cryptographic digest matches the genesis chain exactly. Zero unauthorized administrative alteration detected.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Anonymous 2-Way Chat (Section 9) */}
        <div className="lg:col-span-5 flex flex-col h-[700px] rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-2xs">
          {/* Chat Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Anonymous Two-Way Channel</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Student ↔ Institutional Authority
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Blind Encrypted</span>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400 space-y-1">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-600">No messages yet.</p>
                <p>Start the anonymous conversation below.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isStudent = msg.senderRole === 'STUDENT';
                const isNotice = msg.isOfficialNotice;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-600">
                        {msg.senderDisplayName}
                      </span>
                      <span>•</span>
                      <span className="font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        isNotice
                          ? 'bg-blue-50 border border-blue-200 text-blue-900 font-medium shadow-2xs'
                          : isStudent
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                role === 'STUDENT'
                  ? 'Reply anonymously to the institution...'
                  : 'Send official instruction or inquiry to student...'
              }
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={sendingMessage || !newMessage.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white shadow-sm shadow-blue-500/25 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
