"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ModeToggle } from "@/core/components/theme/mode-toggle";
import { IdeeaIllustration } from "@/core/components/atoms/illustration";
import { IdeeaLogo } from "@/core/components/atoms/ideea-logo";
type Props = { children: ReactNode };

export default function AuthLayout({ children }: Props) {
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
            <ModeToggle />
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
