import apiClient from './client';

// User Jobs
export interface CreateJobRequest {
  title: string;
  description: string;
  jobType: 'IMMEDIATE' | 'SCHEDULED' | 'BIDDING';
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  scheduledDate?: string; // ISO string (YYYY-MM-DD)
  scheduledTime?: string; // HH:mm
  estimatedDuration?: number; // hours
  numberOfWorkers: number;
  requiredSkills: string[];
  budget?: number;
}

export interface JobSummary {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

export interface JobDetails extends JobSummary {
  description: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  quotes?: any[];
}

export const userJobsApi = {
  list: (page = 1, limit = 10) =>
    apiClient.get<{ items: JobSummary[]; total: number }>(`/api/user/jobs?page=${page}&limit=${limit}`),

  create: (data: CreateJobRequest) =>
    apiClient.post<JobDetails>('/api/user/jobs', data),

  details: (jobId: string) =>
    apiClient.get<JobDetails>(`/api/user/jobs/${jobId}`),

  update: (jobId: string, data: Partial<CreateJobRequest>) =>
    apiClient.put<JobDetails>(`/api/user/jobs/${jobId}`, data),

  cancel: (jobId: string) =>
    apiClient.delete(`/api/user/jobs/${jobId}`),

  acceptQuote: (jobId: string, quoteId: string) =>
    apiClient.post(`/api/user/jobs/${jobId}/quotes/${quoteId}/accept`),

  submitReview: (jobId: string, payload: { rating: number; comment?: string }) =>
    apiClient.post(`/api/user/jobs/${jobId}/reviews`, payload),
  active: () => apiClient.get<{ job: any }>(`/api/user/jobs/active`),
};

// Payments
export interface CreateOrderResponse { orderId: string; amount: number; currency: string; key: string }

export const userPaymentsApi = {
  createOrder: (amount: number, currency = 'INR', jobId?: string) =>
    apiClient.post<CreateOrderResponse>('/api/user/payments/create-order', { amount, currency, jobId }),

  verify: (payload: any) =>
    apiClient.post('/api/user/payments/verify', payload),

  history: (page = 1, limit = 10) =>
    apiClient.get<{ items: any[]; total: number }>(`/api/user/payments/history?page=${page}&limit=${limit}`),
};

// Notifications
export const userNotificationsApi = {
  list: (page = 1, limit = 10) =>
    apiClient.get<{ items: any[]; total: number }>(`/api/user/notifications?page=${page}&limit=${limit}`),
  unreadCount: () => apiClient.get<{ count: number }>(`/api/user/notifications/unread-count`),
  markAsRead: (notificationId: string) => apiClient.put(`/api/user/notifications/${notificationId}/read`),
  markAllRead: () => apiClient.put(`/api/user/notifications/mark-all-read`),
  remove: (notificationId: string) => apiClient.delete(`/api/user/notifications/${notificationId}`),
  getPreferences: () => apiClient.get(`/api/user/notifications/preferences`),
  updatePreferences: (payload: any) => apiClient.put(`/api/user/notifications/preferences`, payload),
};

// Profile
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const userProfileApi = {
  get: () => apiClient.get<UserProfile>('/api/user/profile'),
  update: (data: Partial<UserProfile>) => apiClient.put<UserProfile>('/api/user/profile', data),
  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiClient.put('/api/user/change-password', payload),
  deleteAccount: () => apiClient.delete('/api/user/account'),
};


