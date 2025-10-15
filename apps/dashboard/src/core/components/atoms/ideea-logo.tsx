
export const IdeeaLogo = ({ compact }: { compact?: boolean }) => {
  return (
    <div className={`flex items-center gap-3 ${compact ? "text-sm" : ""}`}>
      <div
        className={`h-9 w-9 rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/10 bg-gradient-to-br from-[var(--chart-2)] via-[var(--chart-3)] to-[var(--chart-1)]`}
        aria-hidden
      />
      {!compact && (
        <div className="leading-tight">
          <div className="font-extrabold text-lg">ideea</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Collaborate • Plan • Execute</div>
        </div>
      )}
    </div>
  );
}