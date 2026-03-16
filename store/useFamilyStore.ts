import { create } from 'zustand';
import type { FamilyMember } from '@/types';
import { familyApi } from '@/services';

interface FamilyStore {
  members: FamilyMember[];
  selectedMember: FamilyMember | null;
  loading: boolean;

  fetchMembers: (params?: { keyword?: string; onlyDeceased?: boolean }) => Promise<void>;
  fetchMemberDetail: (id: string) => Promise<FamilyMember | null>;
  createMember: (data: any) => Promise<FamilyMember>;
  updateMember: (id: string, data: any) => Promise<FamilyMember>;
  deleteMember: (id: string) => Promise<void>;
  selectMember: (member: FamilyMember | null) => void;
  clear: () => void;
}

export const useFamilyStore = create<FamilyStore>((set, get) => ({
  members: [],
  selectedMember: null,
  loading: false,

  fetchMembers: async (params) => {
    set({ loading: true });
    try {
      const members = await familyApi.list(params);
      set({ members });
      return members;
    } finally {
      set({ loading: false });
    }
  },

  fetchMemberDetail: async (id) => {
    try {
      const member = await familyApi.detail(id);
      set({ selectedMember: member });
      return member;
    } catch (e) {
      return null;
    }
  },

  createMember: async (data) => {
    const member = await familyApi.create(data);
    set((state) => ({ members: [member, ...state.members] }));
    return member;
  },

  updateMember: async (id, data) => {
    const member = await familyApi.update(id, data);
    set((state) => ({
      members: state.members.map((m) => (m.id === id ? member : m)),
      selectedMember: state.selectedMember?.id === id ? member : state.selectedMember,
    }));
    return member;
  },

  deleteMember: async (id) => {
    await familyApi.remove(id);
    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
      selectedMember: state.selectedMember?.id === id ? null : state.selectedMember,
    }));
  },

  selectMember: (member) => {
    set({ selectedMember: member });
  },

  clear: () => {
    set({ members: [], selectedMember: null });
  },
}));
