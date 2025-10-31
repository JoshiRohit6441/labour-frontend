import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

export interface ApiResponse<T = any> {
  contractor: any;
  message?: string;
  data?: T;
  user?: T;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiError {
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        const data: any = response?.data;
        if (data?.success && data?.message) {
          toast.success(data.message);
        } else if (data?.message && (response.status >= 200 && response.status < 300)) {
          // Backward compatibility for existing APIs returning { message }
          toast.success(data.message);
        }
        return response;
      },
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            this.handleLogout();
            return Promise.reject(refreshError);
          }
        }

        const errData: any = error.response?.data;
        const msg = (errData && (errData.message || errData.error)) || 'An unexpected error occurred.';
        toast.error(msg);
        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post<ApiResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.tokens!;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        return accessToken;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Public methods
  async get<T = any>(url: string, config = {}) {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config = {}) {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config = {}) {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config = {}) {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config = {}) {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
