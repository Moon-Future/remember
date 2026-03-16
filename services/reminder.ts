import { api } from './api';
import type {
  Reminder,
  CreateReminderRequest,
  UpdateReminderRequest,
  ToggleReminderRequest,
} from '@/types';

export const reminderApi = {
  create(data: CreateReminderRequest) {
    return api.post<Reminder>('/api/family-trace/reminders/create', data);
  },

  list() {
    return api.post<Reminder[]>('/api/family-trace/reminders/list', {});
  },

  upcoming() {
    return api.post<Reminder[]>('/api/family-trace/reminders/upcoming', {});
  },

  update(data: UpdateReminderRequest) {
    return api.post<Reminder>('/api/family-trace/reminders/update', data);
  },

  toggle(data: ToggleReminderRequest) {
    return api.post<Reminder>('/api/family-trace/reminders/toggle', data);
  },

  remove(id: string) {
    return api.post<void>('/api/family-trace/reminders/remove', { id });
  },
};
