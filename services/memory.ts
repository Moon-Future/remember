import { api } from './api';
import type {
  Memory,
  CreateMemoryRequest,
  UpdateMemoryRequest,
} from '@/types';

export const memoryApi = {
  create(data: CreateMemoryRequest) {
    return api.post<Memory>('/api/family-trace/memories/create', data);
  },

  list(params?: { familyMemberId?: string; type?: string }) {
    return api.post<Memory[]>('/api/family-trace/memories/list', params || {});
  },

  detail(id: string) {
    return api.post<Memory>('/api/family-trace/memories/detail', { id });
  },

  update(data: UpdateMemoryRequest) {
    return api.post<Memory>('/api/family-trace/memories/update', data);
  },

  remove(id: string) {
    return api.post<void>('/api/family-trace/memories/remove', { id });
  },
};
