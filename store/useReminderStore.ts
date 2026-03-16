import { create } from 'zustand';
import type { Reminder, UserSettings } from '@/types';
import { reminderApi, settingsApi } from '@/services';

interface ReminderStore {
  reminders: Reminder[];
  settings: UserSettings | null;
  loading: boolean;

  fetchReminders: () => Promise<void>;
  fetchUpcomingReminders: () => Promise<Reminder[]>;
  createReminder: (data: any) => Promise<Reminder>;
  updateReminder: (id: string, data: any) => Promise<Reminder>;
  toggleReminder: (id: string, enabled: boolean) => Promise<Reminder>;
  deleteReminder: (id: string) => Promise<void>;

  fetchSettings: () => Promise<void>;
  updateSettings: (data: Partial<UserSettings>) => Promise<UserSettings>;

  clear: () => void;
}

export const useReminderStore = create<ReminderStore>((set, get) => ({
  reminders: [],
  settings: null,
  loading: false,

  fetchReminders: async () => {
    set({ loading: true });
    try {
      const reminders = await reminderApi.list();
      set({ reminders });
    } finally {
      set({ loading: false });
    }
  },

  fetchUpcomingReminders: async () => {
    try {
      const reminders = await reminderApi.upcoming();
      return reminders;
    } catch (e) {
      return [];
    }
  },

  createReminder: async (data) => {
    const reminder = await reminderApi.create(data);
    set((state) => ({ reminders: [reminder, ...state.reminders] }));
    return reminder;
  },

  updateReminder: async (id, data) => {
    const reminder = await reminderApi.update({ id, ...data });
    set((state) => ({
      reminders: state.reminders.map((r) => (r.id === id ? reminder : r)),
    }));
    return reminder;
  },

  toggleReminder: async (id, enabled) => {
    const reminder = await reminderApi.toggle({ id, enabled });
    set((state) => ({
      reminders: state.reminders.map((r) => (r.id === id ? reminder : r)),
    }));
    return reminder;
  },

  deleteReminder: async (id) => {
    await reminderApi.remove(id);
    set((state) => ({
      reminders: state.reminders.filter((r) => r.id !== id),
    }));
  },

  fetchSettings: async () => {
    try {
      const settings = await settingsApi.get();
      set({ settings });
    } catch (e) {
      console.error('Failed to fetch settings', e);
    }
  },

  updateSettings: async (data) => {
    const settings = await settingsApi.update(data);
    set({ settings });
    return settings;
  },

  clear: () => {
    set({ reminders: [], settings: null });
  },
}));
