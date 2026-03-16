import { api } from './api';
import type {
  Tomb,
  TombMarker,
  CreateTombRequest,
  UpdateTombRequest,
} from '@/types';

export const tombApi = {
  create(data: CreateTombRequest) {
    return api.post<Tomb>('/api/family-trace/tombs/create', data);
  },

  list(params?: { keyword?: string }) {
    return api.post<Tomb[]>('/api/family-trace/tombs/list', params || {});
  },

  mapMarkers() {
    return api.post<TombMarker[]>('/api/family-trace/tombs/map', {});
  },

  detail(id: string) {
    return api.post<Tomb>('/api/family-trace/tombs/detail', { id });
  },

  update(data: UpdateTombRequest) {
    return api.post<Tomb>('/api/family-trace/tombs/update', data);
  },

  remove(id: string) {
    return api.post<void>('/api/family-trace/tombs/remove', { id });
  },
};
