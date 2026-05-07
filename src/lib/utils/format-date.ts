import { format, subDays, startOfMonth, endOfMonth, subMonths, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatAxisDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return format(date, 'd MMM', { locale: es });
}

export type DatePreset = '7d' | '30d' | 'this-month' | 'last-month';

export function getPresetRange(preset: DatePreset): { from: string; to: string } {
  const today = startOfDay(new Date());

  switch (preset) {
    case '7d':
      return { from: toISODate(subDays(today, 6)), to: toISODate(today) };
    case '30d':
      return { from: toISODate(subDays(today, 29)), to: toISODate(today) };
    case 'this-month':
      return {
        from: toISODate(startOfMonth(today)),
        to: toISODate(endOfMonth(today)),
      };
    case 'last-month': {
      const lastMonth = subMonths(today, 1);
      return {
        from: toISODate(startOfMonth(lastMonth)),
        to: toISODate(endOfMonth(lastMonth)),
      };
    }
  }
}
