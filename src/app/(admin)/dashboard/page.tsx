'use client';

import { useState } from 'react';
import { BookOpen, DollarSign, Star, Users, RefreshCw } from 'lucide-react';
import { AdminTopBar } from '@/components/layout/AdminTopBar';
import { KpiCard, KpiCardSkeleton } from '@/components/dashboard/KpiCard';
import { DateRangePicker } from '@/components/dashboard/DateRangePicker';
import { SessionsChart } from '@/components/dashboard/SessionsChart';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { NpsChart } from '@/components/dashboard/NpsChart';
import { UserGrowthChart } from '@/components/dashboard/UserGrowthChart';
import { BookingStatusChart } from '@/components/dashboard/BookingStatusChart';
import { TopTutorsTable } from '@/components/dashboard/TopTutorsTable';
import { useAdminMetrics } from '@/lib/hooks/useAdminMetrics';
import { MetricsQueryParams } from '@/lib/types/admin-metrics';
import { getPresetRange } from '@/lib/utils/format-date';
import { formatCOPCompact } from '@/lib/utils/format-currency';

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
        subtitle={
          data
            ? `Actualizado ${new Date(data.generatedAt).toLocaleString('es-CO', { hour: '2-digit', minute: '2-digit' })}`
            : 'Cargando métricas...'
        }
      />

      <main className="flex-1 px-6 py-5 space-y-6">
        {isError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
            Error al cargar los datos. Verifica tu conexión con el backend.
          </div>
        )}

        {/* Controls bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
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
          <SectionHeader title="Indicadores clave" description="Resumen del negocio para el período seleccionado" />
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
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
                  title="Sesiones totales"
                  value={data.sessions.total.toLocaleString('es-CO')}
                  subtitle={`${data.sessions.completionRate}% tasa de completitud`}
                  icon={<BookOpen />}
                  accentColor="#006A75"
                />
                <KpiCard
                  title="Comisión ganada"
                  value={formatCOPCompact(data.revenue.commissionTotal)}
                  subtitle={`Bruto: ${formatCOPCompact(data.revenue.grossTotal)}`}
                  icon={<DollarSign />}
                  accentColor="#F97316"
                />
                <KpiCard
                  title="NPS Score"
                  value={`${data.nps.score > 0 ? '+' : ''}${data.nps.score}`}
                  subtitle={`★ ${data.nps.averageRating.toFixed(1)} prom · ${data.nps.totalReviews} reseñas`}
                  icon={<Star />}
                  accentColor={
                    data.nps.score >= 50 ? '#22C55E' : data.nps.score >= 0 ? '#F59E0B' : '#EF4444'
                  }
                />
                <KpiCard
                  title="Usuarios activos"
                  value={data.users.totalUsers.toLocaleString('es-CO')}
                  subtitle={`${data.users.totalTutors} tutores · ${data.users.totalLearners} learners`}
                  icon={<Users />}
                  accentColor="#6366F1"
                />
              </>
            ) : null}
          </div>
        </section>

        {/* Charts row 1 */}
        <section className="space-y-3">
          <SectionHeader title="Actividad y rendimiento" description="Tendencias de sesiones e ingresos diarios" />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <SessionsChart data={data?.sessions.byDay ?? []} isLoading={isLoading} />
            <RevenueChart data={data?.revenue.byDay ?? []} isLoading={isLoading} />
          </div>
        </section>

        {/* Charts row 2 */}
        <section className="space-y-3">
          <SectionHeader title="Satisfacción y crecimiento" description="NPS, calificaciones y nuevos usuarios registrados" />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <NpsChart
              score={data?.nps.score ?? 0}
              distribution={data?.nps.distribution ?? []}
              totalReviews={data?.nps.totalReviews ?? 0}
              isLoading={isLoading}
            />
            <UserGrowthChart data={data?.users.growthByDay ?? []} isLoading={isLoading} />
          </div>
        </section>

        {/* Table + pie */}
        <section className="space-y-3">
          <SectionHeader title="Tutores destacados" description="Top 5 tutores por ingresos generados este período" />
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
            <div className="xl:col-span-3">
              <TopTutorsTable data={data?.topTutors ?? []} isLoading={isLoading} />
            </div>
            <div className="xl:col-span-2">
              <BookingStatusChart data={data?.sessions.byStatus ?? []} isLoading={isLoading} />
            </div>
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
