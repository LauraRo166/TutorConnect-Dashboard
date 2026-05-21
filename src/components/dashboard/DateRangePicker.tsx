'use client';

import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DatePreset, getPresetRange, toISODate } from '@/lib/utils/format-date';
import { MetricsQueryParams } from '@/lib/types/admin-metrics';

const PRESETS: { value: DatePreset; label: string }[] = [
  { value: '7d', label: '7 días' },
  { value: '30d', label: '30 días' },
  { value: 'this-month', label: 'Este mes' },
  { value: 'last-month', label: 'Mes anterior' },
];

interface DateRangePickerProps {
  params: MetricsQueryParams;
  onParamsChange: (params: MetricsQueryParams) => void;
}

export function DateRangePicker({ params, onParamsChange }: DateRangePickerProps) {
  const [today, setToday] = useState('');
  useEffect(() => { setToday(toISODate(new Date())); }, []);

  const activePreset = PRESETS.find((p) => {
    const range = getPresetRange(p.value);
    return range.from === params.from && range.to === params.to;
  });

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      {/* Segmented preset control — scrollable on very small screens */}
      <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm gap-0.5 overflow-x-auto max-w-full">
        {PRESETS.map((preset) => {
          const isActive = activePreset?.value === preset.value;
          return (
            <button
              key={preset.value}
              onClick={() => onParamsChange(getPresetRange(preset.value))}
              className={`px-3 md:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Custom date range — hidden on mobile */}
      <div className="hidden sm:flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
        <Calendar className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
        <input
          type="date"
          value={params.from}
          max={params.to}
          onChange={(e) => onParamsChange({ ...params, from: e.target.value })}
          className="text-sm text-slate-700 bg-transparent focus:outline-none w-32 font-medium cursor-pointer"
        />
        <span className="text-slate-300 text-sm font-medium">—</span>
        <input
          type="date"
          value={params.to}
          min={params.from}
          max={today}
          onChange={(e) => onParamsChange({ ...params, to: e.target.value })}
          className="text-sm text-slate-700 bg-transparent focus:outline-none w-32 font-medium cursor-pointer"
        />
      </div>
    </div>
  );
}
