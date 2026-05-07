'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusCount } from '@/lib/types/admin-metrics';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  completed: { label: 'Completada', color: '#22C55E' },
  confirmed: { label: 'Confirmada', color: '#006A75' },
  pending: { label: 'Pendiente', color: '#F59E0B' },
  cancelled: { label: 'Cancelada', color: '#EF4444' },
};

interface BookingStatusChartProps {
  data: StatusCount[];
  isLoading?: boolean;
}

export function BookingStatusChart({ data, isLoading }: BookingStatusChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <Skeleton className="h-5 w-40 mb-1" />
        <Skeleton className="h-3 w-32 mb-5" />
        <Skeleton className="h-52 w-full rounded-xl" />
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    label: STATUS_CONFIG[d.status]?.label ?? d.status,
    color: STATUS_CONFIG[d.status]?.color ?? '#94A3B8',
  }));

  const total = chartData.reduce((s, d) => s + d.count, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full">
      <div className="h-1 w-full bg-[#22C55E]" />
      <div className="px-5 pt-4 pb-1">
        <h3 className="text-base font-bold text-slate-800">Estado de sesiones</h3>
        <p className="text-sm text-slate-400 mt-0.5">Distribución por estado en el período</p>
      </div>
      <div className="px-4 pb-2">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={75}
              dataKey="count"
              nameKey="label"
              strokeWidth={3}
              stroke="#ffffff"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                fontSize: 12,
              }}
              formatter={(v: unknown, name: unknown) => [String(v), String(name)] as [string, string]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
          {chartData.map((entry) => {
            const pct = total > 0 ? Math.round((entry.count / total) * 100) : 0;
            return (
              <div key={entry.status} className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-600 truncate">{entry.label}</p>
                  <p className="text-xs text-slate-400">{entry.count} · {pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
