import { Skeleton } from '@/components/ui/skeleton';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
  icon: React.ReactNode;
  accentColor?: string;
}

export function KpiCard({ title, value, subtitle, trend, icon, accentColor }: KpiCardProps) {
  const color = accentColor ?? '#006A75';
  const isPositive = (trend?.value ?? 0) >= 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-slate-100">
      {/* Colored accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: color }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{title}</p>
            <p className="mt-3 text-4xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
            {subtitle && (
              <p className="mt-2 text-sm text-slate-500 font-medium">{subtitle}</p>
            )}
            {trend && (
              <div className="mt-2.5 flex items-center gap-1.5">
                <div
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-2.5 w-2.5" />
                  ) : (
                    <TrendingDown className="h-2.5 w-2.5" />
                  )}
                  {isPositive ? '+' : ''}
                  {trend.value}%
                </div>
                <span className="text-[10px] text-slate-400">{trend.label}</span>
              </div>
            )}
          </div>
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ backgroundColor: color }}
          >
            <span className="text-white [&>svg]:h-7 [&>svg]:w-7">{icon}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
      <div className="h-1 w-full bg-slate-100" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
