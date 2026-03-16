export interface User {
  id: string;
  email: string;
  username: string;
  nickname: string;
  avatar?: string;
  gender?: number;
  birthday?: string;
  bio?: string;
  address?: string;
  locale?: string;
  role: string;
  status: number;
  projectId: string;
  createdAt: string;
  extraData?: any;
}

export interface UserSettings {
  id: string;
  userId: string;
  qingmingReminderEnabled: boolean;
  deathdayReminderEnabled: boolean;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
}
