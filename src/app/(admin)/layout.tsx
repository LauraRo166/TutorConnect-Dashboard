import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

async function verifyAdminRole(): Promise<boolean> {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) return false;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return false;

    const data = (await res.json()) as { role?: string };
    return data.role === 'ADMIN';
  } catch {
    return false;
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/login');
  }

  const isAdmin = await verifyAdminRole();
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm">
          <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-destructive text-2xl">⛔</span>
          </div>
          <h1 className="text-xl font-semibold text-tc-text mb-2">Acceso denegado</h1>
          <p className="text-tc-muted text-sm mb-6">
            Esta sección es exclusiva para administradores de TutorConnect.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="pl-60 min-h-screen">
        {children}
      </div>
    </div>
  );
}
