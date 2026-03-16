import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, AuthState } from '@/types';
import { api } from '@/services';
import { storage } from '@/utils';
import { STORAGE_KEYS } from '@/constants';

interface AuthStore extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        api.setToken(token);
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        api.clearToken();
        storage.remove(STORAGE_KEYS.TOKEN);
        storage.remove(STORAGE_KEYS.USER_INFO);
        set({ token: null, user: null, isAuthenticated: false });
      },

      updateUser: (user: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...user };
          set({ user: updatedUser });
        }
      },
    }),
    {
      name: 'family-trace-auth',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.setToken(state.token);
        }
      },
    }
  )
);
