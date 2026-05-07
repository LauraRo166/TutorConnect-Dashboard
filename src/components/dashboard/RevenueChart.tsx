'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { RevenueByDay } from '@/lib/types/admin-metrics';
import { formatAxisDate } from '@/lib/utils/format-date';
import { formatCOPCompact } from '@/lib/utils/format-currency';

interface RevenueChartProps {
  data: RevenueByDay[];
  isLoading?: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <Skeleton className="h-5 w-40 mb-1" />
        <Skeleton className="h-3 w-48 mb-5" />
        <Skeleton className="h-52 w-full rounded-xl" />
      </div>
    );
  }

  const totalGross = data.reduce((s, d) => s + d.gross, 0);
  const chartData = data.map((d) => ({ ...d, dateLabel: formatAxisDate(d.date) }));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-[#F97316]" />
      <div className="px-5 pt-4 pb-1 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Ingresos por día (COP)</h3>
          <p className="text-sm text-slate-400 mt-0.5">Ingreso bruto vs comisión generada</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-3xl font-black text-slate-900 leading-none">{formatCOPCompact(totalGross)}</p>
          <p className="text-xs text-slate-400 font-medium mt-1">bruto total</p>
        </div>
      </div>
      <div className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#006A75" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#006A75" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="commissionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCOPCompact}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                fontSize: 12,
              }}
              formatter={(v: unknown, name: unknown) => [
                formatCOPCompact(Number(v)),
                name === 'gross' ? 'Ingreso bruto' : 'Comisión',
              ]}
              labelStyle={{ color: '#0F172A', fontWeight: 700, marginBottom: 4 }}
            />
            <Legend
              iconSize={8}
              iconType="circle"
              formatter={(v) => (v === 'gross' ? 'Ingreso bruto' : 'Comisión')}
              wrapperStyle={{ fontSize: 11, color: '#64748B', paddingTop: 4 }}
            />
            <Area
              type="monotone"
              dataKey="gross"
              stroke="#006A75"
              strokeWidth={2.5}
              fill="url(#grossGrad)"
              dot={false}
              activeDot={{ r: 5, fill: '#006A75', stroke: '#fff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="commission"
              stroke="#F97316"
              strokeWidth={2.5}
              fill="url(#commissionGrad)"
              dot={false}
              activeDot={{ r: 5, fill: '#F97316', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
