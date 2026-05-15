'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Vista general' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-60 flex flex-col bg-[#005862]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="h-9 w-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-sm tracking-tight">TC</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm leading-tight">TutorConnect</span>
          <span className="text-white/45 text-[10px] font-semibold uppercase tracking-widest">Admin Panel</span>
        </div>
      </div>

      <div className="mx-4 h-px bg-white/10" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
          Navegación
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/55 hover:bg-white/10 hover:text-white/90'
              }`}
            >
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive ? 'bg-white/25 shadow-inner' : 'bg-white/8 group-hover:bg-white/15'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-sm leading-tight font-semibold">{item.label}</span>
                <span className="text-xs text-white/40 truncate leading-tight font-normal mt-0.5">
                  {item.description}
                </span>
              </div>
              {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-white/60 flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mx-4 h-px bg-white/10" />
      <div className="px-5 py-4 flex items-center gap-2">
        <TrendingUp className="h-3 w-3 text-white/25" />
        <p className="text-white/25 text-[10px] font-medium tracking-wide">Sprint 5 · v1.0.0</p>
      </div>
    </aside>
  );
}
