'use client';

import { Menu } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useSidebar } from '@/components/providers/SidebarProvider';

interface AdminTopBarProps {
  title: string;
  subtitle?: string;
}

export function AdminTopBar({ title, subtitle }: AdminTopBarProps) {
  const { toggle } = useSidebar();

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={toggle}
          className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/30 transition-colors"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">{title}</h1>
          {subtitle && <p className="text-xs md:text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Admin
        </span>
        <UserButton
          appearance={{
            variables: { colorPrimary: '#006A75' },
          }}
        />
      </div>
    </header>
  );
}
