"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";

type Props = { children: ReactNode };

export default function AuthLayout({ children }: Props) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detect system theme preference & apply to <html> class
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (v: boolean) => {
      setIsDark(v);
      if (v) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    };
    apply(darkQuery.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    darkQuery.addEventListener("change", handler);
    return () => darkQuery.removeEventListener("change", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* top bar (logo + small theme toggle) */}
      <header className="absolute z-40 left-0 right-0 top-4 px-5 md:px-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IdeeaLogo compact />
            <span className="hidden md:inline text-xl font-extrabold text-muted-foreground">ideea — Visual collaboration</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">Docs</Link>
            <button
              aria-label="Toggle theme"
              onClick={() => {
                const now = !document.documentElement.classList.contains("dark");
                if (now) document.documentElement.classList.add("dark");
                else document.documentElement.classList.remove("dark");
                setIsDark(now);
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary hover:bg-secondary/80"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main two-column layout */}
      <main className="min-h-screen relative z-10">
        <div className="flex min-h-screen flex-col md:flex-row">
          {/* LEFT: narrow form column */}
          <aside className="w-full md:w-[420px] lg:w-[480px] flex items-center justify-center p-6">
            <div className="w-full max-w-md p-10 space-y-6 bg-card/70 backdrop-blur-xl rounded-3xl border border-border shadow-lg z-20">
              {/* Mobile: small headline above form */}
              <div className="md:hidden text-center">
                <IdeeaLogo />
                <h2 className="mt-4 text-lg font-semibold">Welcome to ideea</h2>
                <p className="text-sm text-muted-foreground">Sign in to continue</p>
              </div>

              {children}
              {/* small footer */}
              <div className="pt-2 text-center text-xs text-muted-foreground">
                By continuing you agree to our{" "}
                <Link href="/terms" className="underline">Terms</Link> and{" "}
                <Link href="/privacy" className="underline">Privacy</Link>.
              </div>
            </div>
          </aside>

          {/* RIGHT: illustration & marketing (hidden on small screens) */}
          <section
            aria-hidden
            className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden px-8"
          >
            {/* decorative gradient blobs (subtle and responsive) */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute -right-28 top-6 h-[56rem] w-[56rem] -translate-y-1/2 rounded-full blur-3xl opacity-40 bg-[conic-gradient(from_180deg,var(--chart-1),var(--chart-2),var(--chart-3))]" />
              <div className="absolute left-8 bottom-0 h-[40rem] w-[40rem] rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle_at_10%_10%,_color-mix(in_oklab,_white_60%,_var(--chart-3))_0%,_transparent_60%)]" />
            </div>

            <div className="max-w-3xl relative z-10 flex flex-col gap-6">
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
                Visual collaboration for teams that ship faster
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                ideea brings context, presence, and precision — from quick sketches to full product planning.
                Secure, fast, and delightful for teams of any size.
              </p>

              <div className="flex gap-4 items-center">
                <Link
                  href="/pricing"
                  className="rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-black/5 bg-gradient-to-br from-[var(--chart-2)] via-[var(--chart-3)] to-[var(--chart-1)]"
                >
                  Explore pricing
                </Link>
                <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground underline">See features</Link>
              </div>
            </div>

            {/* Branded illustration on the right */}
            <div className="absolute right-8 top-12 hidden lg:block pointer-events-none">
              <IdeeaIllustration />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---------- small components (inline so you can copy-paste) ---------- */

function IdeeaLogo({ compact }: { compact?: boolean }) {
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

/* A lightweight SVG illustration inspired by the blob/grid motif.
   - uses CSS variables (chart-1/2/3) so colors automatically change with theme */
function IdeeaIllustration() {
  return (
    <svg width="420" height="380" viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0" stopColor="var(--chart-2)" />
          <stop offset="1" stopColor="var(--chart-3)" />
        </linearGradient>
        <linearGradient id="g2" x1="0" x2="1">
          <stop offset="0" stopColor="var(--chart-1)" />
          <stop offset="1" stopColor="var(--chart-2)" />
        </linearGradient>
      </defs>

      <rect x="0" y="20" width="240" height="240" rx="36" fill="url(#g1)" opacity="0.95" />
      <rect x="150" y="100" width="220" height="180" rx="36" fill="url(#g2)" opacity="0.95" />
      <circle cx="320" cy="40" r="30" fill="var(--chart-3)" opacity="0.9" />
      <circle cx="60" cy="280" r="28" fill="var(--chart-1)" opacity="0.9" />
      {/* light highlight */}
      <rect x="20" y="200" width="100" height="40" rx="8" fill="white" opacity="0.06" />
    </svg>
  );
}
