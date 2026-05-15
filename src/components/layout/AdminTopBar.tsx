interface AdminTopBarProps {
  title: string;
  subtitle?: string;
}

export function AdminTopBar({ title, subtitle }: AdminTopBarProps) {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-slate-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Admin
        </span>
        <div className="h-8 w-8 rounded-full bg-[#005862] flex items-center justify-center text-white text-xs font-bold select-none">
          TC
        </div>
      </div>
    </header>
  );
}
