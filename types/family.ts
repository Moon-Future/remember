export type RelationType =
  | 'father'
  | 'mother'
  | 'grandfather'
  | 'grandmother'
  | 'maternal_grandfather'
  | 'maternal_grandmother'
  | 'brother'
  | 'sister'
  | 'uncle'
  | 'aunt'
  | 'other';

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relation: RelationType;
  birthYear?: number;
  deathYear?: number;
  deathDate?: string;
  photoUrl: string;
  bio: string;
  tombId?: string;
  isDeceased: boolean;
  createdAt: string;
  updatedAt: string;
  tomb?: Tomb;
  memories?: Memory[];
}

export interface CreateFamilyMemberRequest {
  name: string;
  relation: RelationType;
  birthYear?: number;
  deathYear?: number;
  deathDate?: string;
  photoUrl?: string;
  bio?: string;
  tombId?: string;
  isDeceased?: boolean;
  autoCreateReminder?: boolean;
}

export interface UpdateFamilyMemberRequest extends Partial<CreateFamilyMemberRequest> {
  id: string;
}

export const RELATION_OPTIONS: { value: RelationType; label: string }[] = [
  { value: 'father', label: '父亲' },
  { value: 'mother', label: '母亲' },
  { value: 'grandfather', label: '爷爷' },
  { value: 'grandmother', label: '奶奶' },
  { value: 'maternal_grandfather', label: '姥爷' },
  { value: 'maternal_grandmother', label: '姥姥' },
  { value: 'brother', label: '兄弟' },
  { value: 'sister', label: '姐妹' },
  { value: 'uncle', label: '叔叔/舅舅' },
  { value: 'aunt', label: '阿姨/姑姑' },
  { value: 'other', label: '其他' },
];

export function getRelationLabel(relation: RelationType): string {
  const option = RELATION_OPTIONS.find((o) => o.value === relation);
  return option?.label || relation;
}
