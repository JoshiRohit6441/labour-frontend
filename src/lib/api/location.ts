
import apiClient from './client';

export const locationApi = {
  startTravel: (jobId: string) => apiClient.post(`/api/contractor/location/${jobId}/start-travel`),
  endTravel: (jobId: string) => apiClient.post(`/api/contractor/location/${jobId}/end-travel`),
  update: (jobId: string, latitude: number, longitude: number) => apiClient.post(`/api/contractor/location/${jobId}/update-location`, { latitude, longitude }),
  getTravelStatus: (jobId: string) => apiClient.get(`/api/contractor/location/${jobId}/travel-status`),
  share: (jobId: string, workerPhone: string) => apiClient.post(`/api/contractor/jobs/${jobId}/share-location`, { workerPhone }),
};
