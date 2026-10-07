export type UserRole = 'STUDENT' | 'HOD' | 'DEAN' | 'GRIEVANCE_COMMITTEE' | 'ADMIN';

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  STUDENT: 'STUDENT',
  HOD: 'HOD',
  DEAN: 'DEAN',
  GRIEVANCE_COMMITTEE: 'GRIEVANCE COMMITTEE',
  ADMIN: 'SYSTEM ADMINISTRATOR',
};

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  role: UserRole;
}

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'IN_PROGRESS'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  year: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  createdAt: string;
  updatedAt: string;
  anonymousId: string;
  supportCount: number;
  blockHash: string;
  previousHash: string;
  resolutionRemarks?: string;
  isAuthor?: boolean;
}

export interface ComplaintMessage {
  id: string;
  complaintId: string;
  senderRole: UserRole;
  senderDisplayName: string;
  message: string;
  createdAt: string;
  isOfficialNotice?: boolean;
}

export interface ComplaintStatusHistory {
  id: string;
  complaintId: string;
  oldStatus: string;
  newStatus: string;
  updatedAt: string;
  remarks: string;
  updatedByRole: string;
}

export interface EscalationLog {
  id: string;
  complaintId: string;
  currentLevel: string;
  escalatedTo: string;
  timestamp: string;
  reason: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  clusterCategory: string;
  complaintCount: number;
  complaintIds: string[];
}

export interface DashboardStats {
  totalComplaints: number;
  openComplaints: number;
  inProgressComplaints: number;
  escalatedComplaints: number;
  resolvedComplaints: number;
  resolutionRate: number;
  departmentCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  activeAlerts: SystemAlert[];
  recentEscalations: EscalationLog[];
}

export interface HeatmapItem {
  department: string;
  category: string;
  count: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface AnalyticsData {
  heatmap: HeatmapItem[];
  monthlyTrends: Array<{
    month: string;
    submitted: number;
    resolved: number;
    escalated: number;
  }>;
  totalEndorsements: number;
  ledgerVerification: {
    isChainIntact: boolean;
    totalBlocks: number;
    latestBlockHash: string;
    blocks: Array<{
      blockNumber: number;
      id: string;
      anonymousId: string;
      blockHash: string;
      previousHash: string;
      isValid: boolean;
    }>;
  };
}
