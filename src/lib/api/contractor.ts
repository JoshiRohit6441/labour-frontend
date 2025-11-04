import apiClient from './client';
import { Pagination } from './common';

export interface ContractorProfile {
  id: string;
  businessName?: string;
  businessType?: string,
  gstNumber?: string;
  serviceAreas?: string[];
  businessLatitude?: number | null;
  businessLongitude?: number | null;
  coverageRadius?: number | null;

}

export const contractorProfileApi = {
  create: (data: Partial<ContractorProfile>) => apiClient.post<ContractorProfile>('/api/contractor/profile', data),
  get: () => apiClient.get<ContractorProfile>('/api/contractor/profile'),
  update: (data: Partial<ContractorProfile>) => apiClient.put<ContractorProfile>('/api/contractor/profile', data),
};

export interface WorkerListResponse {
  workers: Worker[];
  pagination: Pagination;
}

export interface Worker {
  id: string;
  contractorId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  profileImage?: string | null;
  skills: string[];
  experience?: number;
  hourlyRate?: number;
  dailyRate?: number;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  totalJobs: number;
  completedJobs: number;
  createdAt: string;
  updatedAt: string;
}

export const contractorWorkersApi = {
  add: (data: Partial<Worker>) => apiClient.post<Worker>('/api/contractor/workers', data),
  list: (page = 1, limit = 10) => apiClient.get<WorkerListResponse>(`/api/contractor/workers?page=${page}&limit=${limit}`),
  update: (workerId: string, data: Partial<Worker>) => apiClient.put<Worker>(`/api/contractor/workers/${workerId}`, data),
  remove: (workerId: string) => apiClient.delete(`/api/contractor/workers/${workerId}`),
  setAvailability: (workerId: string, payload: { available: boolean }) => apiClient.post(`/api/contractor/workers/${workerId}/availability`, payload),
};

export const contractorJobsApi = {
  list: (page = 1, limit = 10) => apiClient.get<{ items: any[]; total: number }>(`/api/contractor/jobs?page=${page}&limit=${limit}`),
  details: (jobId: string) => apiClient.get<{ job: any }>(`/api/contractor/jobs/${jobId}`),
  nearby: async (page = 1, limit = 10) => {
    // Fetch contractor profile to get location and radius
    const profile = await contractorProfileApi.get();
    const lat = (profile as any)?.contractor?.businessLatitude ?? 0;
    const lng = (profile as any)?.contractor?.businessLongitude ?? 0;
    const radius = (profile as any)?.contractor?.coverageRadius ?? 20;
    return apiClient.get<{ jobs: any[]; pagination: any }>(
      `/api/contractor/nearby-jobs?page=${page}&limit=${limit}&latitude=${lat}&longitude=${lng}&radius=${radius}`
    );
  },
  claimJob: (jobId: string, workerIds: string[]) => apiClient.post(`/api/contractor/jobs/${jobId}/claim`, { workerIds }),
  initiateChat: (jobId: string) => apiClient.post(`/api/contractor/jobs/${jobId}/chat/initiate`),
  submitAdvancedQuote: (jobId: string, formData: FormData) => apiClient.post(`/api/contractor/jobs/${jobId}/quotes`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  requestAdvance: (jobId: string, quoteId: string, amount: number) => apiClient.post(`/api/contractor/jobs/${jobId}/quotes/${quoteId}/request-advance`, { amount }),
  updateQuote: (jobId: string, quoteId: string, payload: any) => apiClient.put(`/api/contractor/jobs/${jobId}/quotes/${quoteId}`, payload),
  cancelQuote: (jobId: string, quoteId: string) => apiClient.delete(`/api/contractor/jobs/${jobId}/quotes/${quoteId}`),
  scheduleMeeting: (jobId: string, data: any) => apiClient.post(`/api/contractor/meetings`, { ...data, jobId }),
  start: (jobId: string) => apiClient.post(`/api/contractor/jobs/${jobId}/start`),
  complete: (jobId: string) => apiClient.post(`/api/contractor/jobs/${jobId}/complete`),
  assignWorkers: (jobId: string, workerIds: string[]) => apiClient.post(`/api/contractor/jobs/${jobId}/assign-workers`, { workerIds }),
  active: () => apiClient.get<{ job: any }>(`/api/contractor/jobs/active`),
};

export const contractorPaymentsApi = {
  history: (page = 1, limit = 10) => apiClient.get<{ items: any[]; total: number }>(`/api/contractor/payments/history?page=${page}&limit=${limit}`),
  earnings: () => apiClient.get<{ total: number; pending: number; withdrawn: number }>(`/api/contractor/payments/earnings`),
};

export const contractorRateCardsApi = {
  create: (payload: any) => apiClient.post('/api/contractor/rate-cards', payload),
  list: () => apiClient.get<{ items: any[] }>(`/api/contractor/rate-cards`),
  update: (rateCardId: string, payload: any) => apiClient.put(`/api/contractor/rate-cards/${rateCardId}`, payload),
  remove: (rateCardId: string) => apiClient.delete(`/api/contractor/rate-cards/${rateCardId}`),
};

export const contractorNotificationsApi = {
  list: (page = 1, limit = 10) => apiClient.get<{ items: any[]; total: number }>(`/api/contractor/notifications?page=${page}&limit=${limit}`),
  unreadCount: () => apiClient.get<{ count: number }>(`/api/contractor/notifications/unread-count`),
  markAsRead: (notificationId: string) => apiClient.put(`/api/contractor/notifications/${notificationId}/read`),
  markAllRead: () => apiClient.put(`/api/contractor/notifications/mark-all-read`),
  remove: (notificationId: string) => apiClient.delete(`/api/contractor/notifications/${notificationId}`),
  getPreferences: () => apiClient.get(`/api/contractor/notifications/preferences`),
  updatePreferences: (payload: any) => apiClient.put(`/api/contractor/notifications/preferences`, payload),
};

export const contractorLocationApi = {
  startTravel: (jobId: string) => apiClient.post(`/api/contractor/jobs/${jobId}/start-travel`),
  endTravel: (jobId: string) => apiClient.post(`/api/contractor/jobs/${jobId}/end-travel`),
  update: (jobId: string, latitude: number, longitude: number) => apiClient.post(`/api/contractor/jobs/${jobId}/update-location`, { latitude, longitude }),
  getTravelStatus: (jobId: string) => apiClient.get(`/api/contractor/jobs/${jobId}/travel-status`),
  share: (jobId: string, workerPhone: string) => apiClient.post(`/api/contractor/jobs/${jobId}/share-location`, { workerPhone }),
};
