export type ReminderType = 'deathday' | 'qingming';

export interface Reminder {
  id: string;
  userId: string;
  familyMemberId?: string;
  type: ReminderType;
  title: string;
  remindMonth: number;
  remindDay: number;
  isLunar: boolean;
  daysBefore: number;
  isEnabled: boolean;
  lastNotifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  memberName?: string;
  memberPhoto?: string;
  nextDate?: string;
  daysUntil?: number;
}

export interface CreateReminderRequest {
  familyMemberId?: string;
  type: ReminderType;
  title: string;
  remindMonth: number;
  remindDay: number;
  isLunar?: boolean;
  daysBefore?: number;
  isEnabled?: boolean;
}

export interface UpdateReminderRequest extends Partial<CreateReminderRequest> {
  id: string;
}

export interface ToggleReminderRequest {
  id: string;
  isEnabled: boolean;
}

export const DAYS_BEFORE_OPTIONS = [0, 1, 3, 7];

export const REMINDER_TYPE_OPTIONS: { value: ReminderType; label: string }[] = [
  { value: 'deathday', label: '忌日' },
  { value: 'qingming', label: '清明节' },
];

export function getReminderTypeLabel(type: ReminderType): string {
  const option = REMINDER_TYPE_OPTIONS.find((o) => o.value === type);
  return option?.label || type;
}
