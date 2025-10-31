import apiClient from './client';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'USER' | 'CONTRACTOR';
}

export interface LoginData {
  phone: string;
  password: string;
}

export interface VerifyOtpData {
  phone: string;
  otp: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'USER' | 'CONTRACTOR';
  status: string;
  isVerified: boolean;
  contractorProfile?: any;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authApi = {
  register: (data: RegisterData) =>
    apiClient.post<AuthResponse>('/api/user/auth/register', data),

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<User>('/api/user/auth/login', data);
    const authResponse: AuthResponse = {
      message: response.message || 'Login successful',
      user: response.user || response.data as unknown as User,
      tokens: response.tokens,
    };
    
    if (authResponse.tokens) {
      localStorage.setItem('accessToken', authResponse.tokens.accessToken);
      localStorage.setItem('refreshToken', authResponse.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
    }
    return authResponse;
  },

  verifyOtp: (data: VerifyOtpData) =>
    apiClient.post('/api/user/auth/verify-otp', data),

  resendOtp: (phone: string) =>
    apiClient.post('/api/user/auth/resend-otp', { phone }),

  logout: async () => {
    try {
      await apiClient.post('/api/user/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },
};
