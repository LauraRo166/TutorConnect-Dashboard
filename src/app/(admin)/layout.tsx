import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { SidebarProvider } from '@/components/providers/SidebarProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
