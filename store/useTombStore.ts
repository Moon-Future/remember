import { create } from 'zustand';
import type { Tomb, TombMarker } from '@/types';
import { tombApi } from '@/services';

interface TombStore {
  tombs: Tomb[];
  markers: TombMarker[];
  selectedTomb: Tomb | null;
  loading: boolean;

  fetchTombs: (params?: { keyword?: string }) => Promise<void>;
  fetchMapMarkers: () => Promise<void>;
  fetchTombDetail: (id: string) => Promise<Tomb | null>;
  createTomb: (data: any) => Promise<Tomb>;
  updateTomb: (id: string, data: any) => Promise<Tomb>;
  deleteTomb: (id: string) => Promise<void>;
  selectTomb: (tomb: Tomb | null) => void;
  clear: () => void;
}

export const useTombStore = create<TombStore>((set, get) => ({
  tombs: [],
  markers: [],
  selectedTomb: null,
  loading: false,

  fetchTombs: async (params) => {
    set({ loading: true });
    try {
      const tombs = await tombApi.list(params);
      set({ tombs });
    } finally {
      set({ loading: false });
    }
  },

  fetchMapMarkers: async () => {
    try {
      const markers = await tombApi.mapMarkers();
      set({ markers });
      return markers;
    } catch (e) {
      return [];
    }
  },

  fetchTombDetail: async (id) => {
    try {
      const tomb = await tombApi.detail(id);
      set({ selectedTomb: tomb });
      return tomb;
    } catch (e) {
      return null;
    }
  },

  createTomb: async (data) => {
    const tomb = await tombApi.create(data);
    set((state) => ({ tombs: [tomb, ...state.tombs] }));
    return tomb;
  },

  updateTomb: async (id, data) => {
    const tomb = await tombApi.update(id, data);
    set((state) => ({
      tombs: state.tombs.map((t) => (t.id === id ? tomb : t)),
      selectedTomb: state.selectedTomb?.id === id ? tomb : state.selectedTomb,
    }));
    return tomb;
  },

  deleteTomb: async (id) => {
    await tombApi.remove(id);
    set((state) => ({
      tombs: state.tombs.filter((t) => t.id !== id),
      selectedTomb: state.selectedTomb?.id === id ? null : state.selectedTomb,
    }));
  },

  selectTomb: (tomb) => {
    set({ selectedTomb: tomb });
  },

  clear: () => {
    set({ tombs: [], markers: [], selectedTomb: null });
  },
}));
