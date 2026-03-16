import { useCallback } from 'react';
import { useAuthStore } from '@/store';
import { authApi } from '@/services';
import { storage } from '@/utils';
import { STORAGE_KEYS } from '@/constants';
import type { LoginParams, RegisterParams, SendCodeParams } from '@/types';

export function useAuth() {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore();

  const sendCode = useCallback(async (params: SendCodeParams) => {
    await authApi.sendCode(params);
  }, []);

  const getSalt = useCallback(async (email: string) => {
    return await authApi.getSalt(email);
  }, []);

  const doLogin = useCallback(async (params: LoginParams) => {
    const result = await authApi.login(params);
    const { token: newToken, user: newUser } = result;

    await storage.set(STORAGE_KEYS.TOKEN, newToken);
    await storage.set(STORAGE_KEYS.USER_INFO, JSON.stringify(newUser));

    login(newToken, newUser);
    return result;
  }, [login]);

  const doRegister = useCallback(async (params: RegisterParams) => {
    await authApi.register(params);
  }, []);

  const doLogout = useCallback(() => {
    logout();
  }, [logout]);

  const refreshUserInfo = useCallback(async () => {
    try {
      const userInfo = await authApi.getUserInfo();
      updateUser(userInfo);
      await storage.set(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
    } catch (e) {
      console.error('Failed to refresh user info', e);
    }
  }, [updateUser]);

  return {
    user,
    token,
    isAuthenticated,
    sendCode,
    getSalt,
    login: doLogin,
    register: doRegister,
    logout: doLogout,
    refreshUserInfo,
  };
}
