'use client';

import { useState } from 'react';
import { BookOpen, RefreshCw, Users, GraduationCap, UserCheck } from 'lucide-react';
import { AdminTopBar } from '@/components/layout/AdminTopBar';
import { KpiCard, KpiCardSkeleton } from '@/components/dashboard/KpiCard';
import { DateRangePicker } from '@/components/dashboard/DateRangePicker';
import { useAdminMetrics } from '@/lib/hooks/useAdminMetrics';
import { MetricsQueryParams } from '@/lib/types/admin-metrics';
import { getPresetRange } from '@/lib/utils/format-date';

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <h2 className="text-base font-bold text-slate-700 tracking-tight">{title}</h2>
      {description && <p className="text-sm text-slate-400">{description}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [params, setParams] = useState<MetricsQueryParams>(() => getPresetRange('30d'));
  const { data, isLoading, isError, refetch, isFetching } = useAdminMetrics(params);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminTopBar
        title="Dashboard"
        subtitle={data ? 'Datos actualizados' : 'Cargando métricas...'}
      />

      <main className="flex-1 px-4 md:px-6 py-5 space-y-6">
        {isError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
            Error al cargar los datos. Verifica tu conexión con el backend.
          </div>
        )}

        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <SectionHeader title="Período de análisis" description="Filtra todas las métricas por rango de fechas" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-primary hover:border-primary/30 transition-colors disabled:opacity-50"
              title="Actualizar datos"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <DateRangePicker params={params} onParamsChange={setParams} />
          </div>
        </div>

        {/* KPI Cards */}
        <section className="space-y-3">
          <SectionHeader title="Indicadores clave" description="Resumen de usuarios y cursos en la plataforma" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {isLoading ? (
              <>
                <KpiCardSkeleton />
                <KpiCardSkeleton />
                <KpiCardSkeleton />
                <KpiCardSkeleton />
              </>
            ) : data ? (
              <>
                <KpiCard
                  title="Usuarios totales"
                  value={data.totalUsers.toLocaleString('es-CO')}
                  icon={<Users />}
                  accentColor="#006A75"
                />
                <KpiCard
                  title="Tutores"
                  value={data.totalTutors.toLocaleString('es-CO')}
                  icon={<UserCheck />}
                  accentColor="#F97316"
                />
                <KpiCard
                  title="Estudiantes"
                  value={data.totalLearners.toLocaleString('es-CO')}
                  icon={<GraduationCap />}
                  accentColor="#6366F1"
                />
                <KpiCard
                  title="Cursos activos"
                  value={data.totalCourses.toLocaleString('es-CO')}
                  icon={<BookOpen />}
                  accentColor="#22C55E"
                />
              </>
            ) : null}
          </div>
        </section>

        {/* Footer */}
        <div className="pb-2">
          <p className="text-[11px] text-slate-400 text-center font-medium">
            TutorConnect Admin · {params.from} → {params.to}
          </p>
        </div>
      </main>
    </div>
  );
}
