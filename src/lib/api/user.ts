import apiClient from './client';

export const userDashboardApi = {
  getStats: () => apiClient.get('/api/user/dashboard/stats'),
  getRecentJobs: () => apiClient.get('/api/user/dashboard/recent-jobs'),
};

export const userProfileApi = {
  getProfile: () => apiClient.get('/api/user/profile'),
  updateProfile: (profileData: any) => apiClient.put('/api/user/profile', profileData),
  changePassword: (passwordData: any) => apiClient.put('/api/user/change-password', passwordData),
  deleteAccount: () => apiClient.delete('/api/user/account'),
  logout: () => apiClient.post('/api/user/logout'),
};

export const userJobsApi = {
  getJobs: () => apiClient.get('/api/user/jobs'),
  getJobDetails: (jobId: string) => apiClient.get(`/api/user/jobs/${jobId}`),
  createJob: (jobData: any) => apiClient.post('/api/user/jobs', jobData),
  updateJob: (jobId: string, jobData: any) => apiClient.put(`/api/user/jobs/${jobId}`, jobData),
  cancelJob: (jobId: string) => apiClient.post(`/api/user/jobs/${jobId}/cancel`),
  acceptQuote: (jobId: string, quoteId: string) => apiClient.post(`/api/user/jobs/${jobId}/quotes/${quoteId}/accept`),
  submitReview: (jobId: string, reviewData: any) => apiClient.post(`/api/user/jobs/${jobId}/reviews`, reviewData),
  getJobAnalytics: () => apiClient.get('/api/user/jobs/analytics'),
  getActiveJob: () => apiClient.get('/api/user/jobs/active'),
};

export const userPaymentsApi = {
  createOrder: (orderData: any) => apiClient.post('/api/user/payments/create-order', orderData),
  verifyPayment: (paymentData: any) => apiClient.post('/api/user/payments/verify', paymentData),
  getPaymentHistory: () => apiClient.get('/api/user/payments/history'),
  getPaymentDetails: (paymentId: string) => apiClient.get(`/api/user/payments/${paymentId}`),
  initiateRefund: (paymentId: string) => apiClient.post(`/api/user/payments/${paymentId}/refund`),
  getPaymentAnalytics: () => apiClient.get('/api/user/payments/analytics'),
  getPaymentMethods: () => apiClient.get('/api/user/payments/methods'),
  addPaymentMethod: (methodData: any) => apiClient.post('/api/user/payments/methods', methodData),
  removePaymentMethod: (methodId: string) => apiClient.delete(`/api/user/payments/methods/${methodId}`),
};

export const userNotificationsApi = {
  getNotifications: () => apiClient.get('/api/user/notifications'),
  getUnreadCount: () => apiClient.get('/api/user/notifications/unread-count'),
  markAsRead: (notificationId: string) => apiClient.put(`/api/user/notifications/${notificationId}/read`),
  markAllAsRead: () => apiClient.put('/api/user/notifications/mark-all-read'),
  deleteNotification: (notificationId: string) => apiClient.delete(`/api/user/notifications/${notificationId}`),
  getNotificationPreferences: () => apiClient.get('/api/user/notifications/preferences'),
  updateNotificationPreferences: (preferences: any) => apiClient.put('/api/user/notifications/preferences', preferences),
  getNotificationAnalytics: () => apiClient.get('/api/user/notifications/analytics'),
};

export const userWorkerApi = {
  verifyLocationCode: (jobId: string, securityCode: string, workerPhone: string) =>
    apiClient.post(`/api/user/worker/${jobId}/verify-location-code`, { securityCode, workerPhone }),
  startTravel: (token: string) => apiClient.post('/api/user/worker/start-travel', {}, { headers: { Authorization: `Bearer ${token}` } }),
  updateLocation: (token: string, latitude: number, longitude: number) => apiClient.post('/api/user/worker/update-location', { latitude, longitude }, { headers: { Authorization: `Bearer ${token}` } }),
};
