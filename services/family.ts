import { api } from './api';
import type {
  FamilyMember,
  CreateFamilyMemberRequest,
  UpdateFamilyMemberRequest,
} from '@/types';

export const familyApi = {
  create(data: CreateFamilyMemberRequest) {
    return api.post<FamilyMember>('/api/family-trace/family/create', data);
  },

  list(params?: { keyword?: string; onlyDeceased?: boolean }) {
    return api.post<FamilyMember[]>('/api/family-trace/family/list', params || {});
  },

  detail(id: string) {
    return api.post<FamilyMember>('/api/family-trace/family/detail', { id });
  },

  update(data: UpdateFamilyMemberRequest) {
    return api.post<FamilyMember>('/api/family-trace/family/update', data);
  },

  remove(id: string) {
    return api.post<void>('/api/family-trace/family/remove', { id });
  },
};
