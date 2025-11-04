
import apiClient from './client';

export const workerApi = {
  verifyLocationCode: (jobId: string, securityCode: string, workerPhone: string) => 
    apiClient.post(`/api/worker/${jobId}/verify-location-code`, { securityCode, workerPhone }),
  startTravel: (token: string) => apiClient.post('/api/worker/start-travel', {}, { headers: { Authorization: `Bearer ${token}` } }),
  updateLocation: (token: string, latitude: number, longitude: number) => apiClient.post('/api/worker/update-location', { latitude, longitude }, { headers: { Authorization: `Bearer ${token}` } }),
};
