export type MemoryType = 'qingming' | 'deathday' | 'other';

export interface Memory {
  id: string;
  userId: string;
  familyMemberId: string;
  type: MemoryType;
  title: string;
  content: string;
  photoUrls: string[];
  memoryDate: string;
  createdAt: string;
  updatedAt: string;
  memberName?: string;
  memberPhoto?: string;
  familyMember?: {
    id: string;
    name: string;
    relation: string;
    photoUrl: string;
  };
}

export interface CreateMemoryRequest {
  familyMemberId: string;
  type: MemoryType;
  title: string;
  content?: string;
  photoUrls?: string[];
  memoryDate: string;
}

export interface UpdateMemoryRequest extends Partial<CreateMemoryRequest> {
  id: string;
}

export const MEMORY_TYPE_OPTIONS: { value: MemoryType; label: string }[] = [
  { value: 'qingming', label: '清明祭拜' },
  { value: 'deathday', label: '忌日' },
  { value: 'other', label: '其他' },
];

export function getMemoryTypeLabel(type: MemoryType): string {
  const option = MEMORY_TYPE_OPTIONS.find((o) => o.value === type);
  return option?.label || type;
}
