import {
  User,
  Complaint,
  ComplaintMessage,
  ComplaintStatusHistory,
  EscalationLog,
  DashboardStats,
  AnalyticsData,
  ComplaintStatus,
  ComplaintPriority,
} from '../types';

const TOKEN_KEY = 'whisper_ledger_jwt';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const errorMsg = data?.error || data?.message || (typeof data === 'string' ? data : 'API Request failed');
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(res.token);
    return res;
  },

  async register(data: { name: string; email: string; department: string; year: string; password: string; role?: string }) {
    const res = await request<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(res.token);
    return res;
  },

  async getCurrentUser() {
    return request<{ user: User }>('/api/auth/me');
  },

  // Complaints
  async getComplaints(params: {
    category?: string;
    department?: string;
    status?: string;
    priority?: string;
    search?: string;
    myComplaintsOnly?: boolean;
  } = {}) {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.department) query.set('department', params.department);
    if (params.status) query.set('status', params.status);
    if (params.priority) query.set('priority', params.priority);
    if (params.search) query.set('search', params.search);
    if (params.myComplaintsOnly) query.set('myComplaintsOnly', 'true');

    return request<{ complaints: Complaint[]; total: number }>(`/api/complaints?${query.toString()}`);
  },

  async getComplaint(id: string) {
    return request<{
      complaint: Complaint;
      hasSupported: boolean;
      timeline: ComplaintStatusHistory[];
      escalations: EscalationLog[];
    }>(`/api/complaints/${id}`);
  },

  async submitComplaint(data: {
    title: string;
    description: string;
    category: string;
    department?: string;
    year?: string;
    priority?: ComplaintPriority;
  }) {
    return request<{ message: string; complaint: Complaint }>('/api/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async toggleSupport(id: string) {
    return request<{ message: string; supported: boolean; supportCount: number }>(
      `/api/complaints/${id}/support`,
      { method: 'POST' }
    );
  },

  async updateComplaintStatus(
    id: string,
    data: { status?: ComplaintStatus; priority?: ComplaintPriority; remarks?: string }
  ) {
    return request<{ message: string; complaint: Complaint }>(`/api/complaints/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Chat
  async getChatMessages(complaintId: string) {
    return request<{ messages: ComplaintMessage[]; anonymousId: string }>(`/api/chat/${complaintId}`);
  },

  async sendChatMessage(complaintId: string, message: string) {
    return request<{ message: string; chatMessage: ComplaintMessage }>('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({ complaintId, message }),
    });
  },

  // AI & Drafting Assistance
  async analyzeDraft(title: string, description: string) {
    return request<{
      suggestion: {
        category: string;
        severity: ComplaintPriority;
        summary: string;
        advice: string;
      };
      privacyWarnings: string[];
      similarComplaints: Array<{
        id: string;
        title: string;
        category: string;
        supportCount: number;
        anonymousId: string;
      }>;
    }>('/api/complaints/ai-analyze-draft', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  },

  async clusterComplaints() {
    return request<{ message: string; clusterCount: number; alerts: any[] }>('/api/ai/cluster-complaints', {
      method: 'POST',
    });
  },

  async triggerEscalationCheck(simulateTimeFastForwardDays: number = 0) {
    return request<{
      message: string;
      escalatedCount: number;
      escalatedItems: Array<{ complaintId: string; escalatedTo: string; reason: string }>;
    }>('/api/complaints/escalation-check', {
      method: 'POST',
      body: JSON.stringify({ simulateTimeFastForwardDays }),
    });
  },

  // Dashboard & Analytics
  async getAdminDashboard() {
    return request<DashboardStats>('/api/admin/dashboard');
  },

  async getAnalytics() {
    return request<AnalyticsData>('/api/analytics');
  },

  // Cryptographic Ledger Verification
  async verifyComplaintHash(id: string) {
    return request<{
      complaintId: string;
      anonymousId: string;
      storedHash: string;
      recalculatedHash: string;
      isTamperProof: boolean;
      merkleStatus: string;
    }>(`/api/complaints/${id}/verify-hash`, {
      method: 'POST',
    });
  },
};
