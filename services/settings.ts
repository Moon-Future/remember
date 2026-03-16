import { api } from './api';
import type { UserSettings } from '@/types';

export const settingsApi = {
  get() {
    return api.post<UserSettings>('/api/family-trace/settings/get', {});
  },

  update(data: Partial<UserSettings>) {
    return api.post<UserSettings>('/api/family-trace/settings/update', data);
  },
};
