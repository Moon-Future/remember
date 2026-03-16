import { api } from './api';
import type { User } from '@/types';

export interface LoginRequest {
  email: string;
  password: string;
  projectId?: string;
}

export interface RegisterRequest {
  email: string;
  emailCode: string;
  password: string;
  salt: string;
  projectId?: string;
}

export interface SendCodeRequest {
  email: string;
  isReset?: boolean;
  isBind?: boolean;
  isProd?: boolean;
}

export interface AuthResponse {
  token: string;
  userInfo: User;
  code?: string;
}

export interface GetSaltRequest {
  email: string;
  projectId?: string;
}

export interface GetSaltResponse {
  salt: string;
}

export const authApi = {
  sendEmailCode(data: SendCodeRequest) {
    return api.post<{ code: string }>('/api/container/login/sendEmailCode', data);
  },

  getUserSalt(data: GetSaltRequest) {
    return api.post<GetSaltResponse>('/api/container/login/getUserSalt', data);
  },

  register(data: RegisterRequest) {
    return api.post<AuthResponse>('/api/container/login/register', data);
  },

  login(data: LoginRequest) {
    return api.post<AuthResponse>('/api/container/login/login', data);
  },

  getUserInfo() {
    return api.post<{ userInfo: User }>('/api/container/user/getUserInfo');
  },

  updateUserInfo(data: Partial<User>) {
    return api.post<void>('/api/container/user/updateUserInfo', data);
  },
};
