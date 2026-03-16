export interface Tomb {
  id: string;
  userId: string;
  familyMemberId?: string;
  name: string;
  longitude: number;
  latitude: number;
  address: string;
  photoUrls: string[];
  notes: string;
  amapPoiId: string;
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

export interface TombMarker {
  id: string;
  name: string;
  memberName?: string;
  memberPhoto?: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface CreateTombRequest {
  name: string;
  familyMemberId?: string;
  longitude: number;
  latitude: number;
  address?: string;
  photoUrls?: string[];
  notes?: string;
  amapPoiId?: string;
}

export interface UpdateTombRequest extends Partial<CreateTombRequest> {
  id: string;
}
