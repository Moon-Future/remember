import dayjs from 'dayjs';

export function formatDate(date: string | Date, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format);
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
}

export function formatYear(date: string | Date): string {
  return dayjs(date).format('YYYY');
}

export function getAge(birthYear?: number, deathYear?: number): string {
  if (!birthYear) return '';
  const endYear = deathYear || new Date().getFullYear();
  return `${endYear - birthYear}岁`;
}

export function getDateRangeDescription(date: string): string {
  const now = dayjs();
  const target = dayjs(date);
  const diff = target.diff(now, 'day');

  if (diff === 0) return '今天';
  if (diff === 1) return '明天';
  if (diff === -1) return '昨天';
  if (diff > 0 && diff <= 7) return `${diff}天后`;
  if (diff < 0 && diff >= -7) return `${Math.abs(diff)}天前`;

  return formatDate(date);
}

export function isDateInPast(date: string | Date): boolean {
  return dayjs(date).isBefore(dayjs(), 'day');
}

export function getDaysUntil(date: string | Date): number | null {
  const now = dayjs().startOf('day');
  const target = dayjs(date).startOf('day');
  return target.diff(now, 'day');
}
