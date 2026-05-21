import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { SidebarProvider } from '@/components/providers/SidebarProvider';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="md:pl-60 min-h-screen">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
