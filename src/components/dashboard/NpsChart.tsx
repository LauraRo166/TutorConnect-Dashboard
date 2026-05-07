'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { RatingDistribution } from '@/lib/types/admin-metrics';

const RATING_COLORS: Record<number, string> = {
  1: '#EF4444',
  2: '#F97316',
  3: '#F59E0B',
  4: '#84CC16',
  5: '#22C55E',
};

interface NpsChartProps {
  score: number;
  distribution: RatingDistribution[];
  totalReviews: number;
  isLoading?: boolean;
}

export function NpsChart({ score, distribution, totalReviews, isLoading }: NpsChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <Skeleton className="h-5 w-40 mb-1" />
        <Skeleton className="h-3 w-32 mb-5" />
        <Skeleton className="h-52 w-full rounded-xl" />
      </div>
    );
  }

  const npsColor = score >= 50 ? '#22C55E' : score >= 0 ? '#F59E0B' : '#EF4444';
  const npsLabel = score >= 50 ? 'Excelente' : score >= 0 ? 'Bueno' : 'Crítico';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="h-1 w-full" style={{ backgroundColor: npsColor }} />
      <div className="px-5 pt-4 pb-1 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">NPS y calificaciones</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            {totalReviews} reseñas en el período
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex items-baseline gap-1.5 justify-end">
            <p className="text-3xl font-black leading-none" style={{ color: npsColor }}>
              {score > 0 ? '+' : ''}{score}
            </p>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${npsColor}18`, color: npsColor }}
            >
              {npsLabel}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1">NPS Score</p>
        </div>
      </div>
      <div className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={distribution}
            margin={{ top: 10, right: 8, left: -25, bottom: 0 }}
            barSize={36}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="rating"
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}★`}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                fontSize: 12,
              }}
              formatter={(v: unknown, _: unknown, props: { payload?: RatingDistribution }) => [
                `${v} reseñas (${props?.payload?.percentage ?? 0}%)`,
                `${props?.payload?.rating ?? ''}★`,
              ]}
              labelStyle={{ display: 'none' }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {distribution.map((entry) => (
                <Cell key={`cell-${entry.rating}`} fill={RATING_COLORS[entry.rating] ?? '#94A3B8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
