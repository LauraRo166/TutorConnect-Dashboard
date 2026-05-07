'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-sm">
        <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-destructive text-2xl">⚠</span>
        </div>
        <h1 className="text-xl font-semibold text-tc-text mb-2">Algo salió mal</h1>
        <p className="text-tc-muted text-sm mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
