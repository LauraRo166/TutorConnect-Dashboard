import { Skeleton } from '@/components/ui/skeleton';
import { TopTutor } from '@/lib/types/admin-metrics';
import { formatCOP } from '@/lib/utils/format-currency';

const MEDALS: Record<number, { emoji: string; color: string }> = {
  0: { emoji: '🥇', color: '#F59E0B' },
  1: { emoji: '🥈', color: '#94A3B8' },
  2: { emoji: '🥉', color: '#CD7C2F' },
};

interface TopTutorsTableProps {
  data: TopTutor[];
  isLoading?: boolean;
}

export function TopTutorsTable({ data, isLoading }: TopTutorsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <Skeleton className="h-5 w-40 mb-1" />
        <Skeleton className="h-3 w-48 mb-5" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-[#6366F1]" />
      <div className="px-5 pt-4 pb-3">
        <h3 className="text-base font-bold text-slate-800">Top tutores del período</h3>
        <p className="text-sm text-slate-400 mt-0.5">Ordenado por ingresos brutos generados</p>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-slate-400 text-sm font-medium px-5 pb-5">
          Sin datos para el período seleccionado
        </div>
      ) : (
        <div className="px-3 pb-4 space-y-1">
          {/* Header row */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 px-3 py-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400 w-6">#</span>
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Tutor</span>
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400 text-right w-14">Ses.</span>
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400 text-right w-28">Ingresos</span>
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400 text-right w-16">Rating</span>
          </div>

          {data.map((tutor, index) => {
            const medal = MEDALS[index];
            return (
              <div
                key={tutor.tutorId}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 items-center px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-6 flex-shrink-0 text-center">
                  {medal ? (
                    <span className="text-base leading-none">{medal.emoji}</span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">{index + 1}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-slate-800 truncate leading-tight">{tutor.name}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Comisión: {formatCOP(tutor.commission)}
                  </p>
                </div>
                <div className="w-14 text-right flex-shrink-0">
                  <span className="text-base font-bold text-slate-700">{tutor.sessionsCount}</span>
                </div>
                <div className="w-28 text-right flex-shrink-0">
                  <span className="text-base font-bold text-primary">{formatCOP(tutor.grossRevenue)}</span>
                </div>
                <div className="w-16 text-right flex-shrink-0">
                  {tutor.averageRating != null ? (
                    <span className="text-base font-bold text-amber-500">★ {tutor.averageRating.toFixed(1)}</span>
                  ) : (
                    <span className="text-sm text-slate-300">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
