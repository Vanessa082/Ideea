'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  PencilLine,
  MessageSquare,
  Shapes,
  Share2,
  Zap,
  Users,
  Shield,
  Download,
  History,
  Play,
  Star,
  Quote,
  Github,
  Twitter,
  Linkedin,
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';

/** ---------------------------------------------------------
 * Ideea — Premium Landing (single file)
 * - OKLCH palette via CSS variables (bg-background, text-foreground, etc.)
 * - No Framer Motion; native IntersectionObserver for reveal animations
 * - Sticky glass navbar, dark mode toggle, smooth carousel/testimonials
 * -------------------------------------------------------- */

type Slide = { icon: React.ComponentType<any>; title: string; description: string };
type Testimonial = { name: string; role: string; content: string; rating: number };

const brandGradient = 'from-[var(--chart-2)] via-[var(--chart-3)] to-[var(--chart-1)]';
const brandRadial =
  'bg-[radial-gradient(1200px_600px_at_10%_-10%,_color-mix(in_oklab,_white_60%,_var(--chart-2))_0%,_transparent_60%),radial-gradient(1000px_600px_at_90%_0%,_color-mix(in_oklab,_white_60%,_var(--chart-3))_0%,_transparent_55%)]';

const slides: Slide[] = [
  { icon: PencilLine, title: 'Sketch Together', description: 'Real-time whiteboarding that feels instant' },
  { icon: MessageSquare, title: 'Chat While You Create', description: 'Contextual chat anchored to shapes' },
  { icon: Shapes, title: 'Precision Tools', description: 'Snapping, grids, vector handles, and more' },
  { icon: Share2, title: 'Share & Present', description: 'One link for edit, comment, or view' },
];

const features = [
  { icon: Zap, title: 'Live Sync', description: 'Low-latency cursor presence and conflict-free edits' },
  { icon: Users, title: 'Team-first', description: 'Roles, invite links, guest mode, and SSO' },
  { icon: Shapes, title: 'Pro Tooling', description: 'Vectors, connectors, frames, sticky notes' },
  { icon: Shield, title: 'Secure by Default', description: 'Private rooms, audit logs, data export' },
  { icon: Download, title: 'Export Anywhere', description: 'PNG, SVG, PDF, embeds, and deck export' },
  { icon: History, title: 'Time Travel', description: 'Version history, branching, and merge' },
];

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Head of Product, Northstar',
    content:
      'ideea made our remote workshops actually fun. The board loads instantly and nothing feels laggy.',
    rating: 5,
  },
  {
    name: 'Mike Rodriguez',
    role: 'Engineering Manager, Spindle',
    content:
      'We replaced 3 apps with ideea. Fewer tabs, better context, faster output. It’s a no-brainer.',
    rating: 5,
  },
  {
    name: 'Emma Johnson',
    role: 'UX Research Lead, Clover',
    content:
      'The little details add up: cursors, snapping, frames. My team ships ideas faster than ever.',
    rating: 5,
  },
];

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/month',
    features: ['3 Active Boards', '5 Members', 'Core Drawing Tools', 'PNG Export', 'Community Support'],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$18',
    period: '/user/mo',
    features: [
      'Unlimited Boards',
      'Up to 25 Members',
      'Advanced Vector Tools',
      'SVG & PDF Export',
      'Version History',
      'Priority Support',
    ],
    cta: 'Start 14-day Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Unlimited Members', 'Admin & SCIM', 'SSO/SAML', 'Audit Logs', 'Custom Branding', 'Dedicated CSM'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const IdeeaLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div
      className={`h-9 w-9 rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/10 bg-gradient-to-br ${brandGradient}`}
    />
    <div className="leading-tight">
      <span className="text-xl font-extrabold tracking-tight">ideea</span>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Collaborate • Plan • Execute</div>
    </div>
  </div>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
    {children}
  </span>
);

const StatPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
    <span className="font-semibold text-foreground">{value}</span> {label}
  </div>
);

const LandingPage: React.FC = () => {

    const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL;

  // THEME
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  );
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  // NAV
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setMobileOpen(false);
  };

  // REVEAL ANIMATIONS
  const [visible, setVisible] = useState<Set<string>>(new Set());
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible((prev) => new Set(prev).add(e.target.id));
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll('[data-animate]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const show = (id: string) =>
    `transition-all duration-700 will-change-transform ${visible.has(id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`;

  // CAROUSEL
  const [slide, setSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const slideRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!autoPlay) return;
    slideRef.current = setInterval(() => setSlide((s) => (s + 1) % slides.length), 4200);
    return () => {
      if (slideRef.current) clearInterval(slideRef.current);
    };
  }, [autoPlay]);

  const next = () => {
    setSlide((s) => (s + 1) % slides.length);
    pause();
  };
  const prev = () => {
    setSlide((s) => (s - 1 + slides.length) % slides.length);
    pause();
  };
  const pause = () => {
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 4000);
  };

  // TESTIMONIALS
  const [tIndex, setTIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTIndex((i) => (i + 1) % testimonials.length), 5200);
    return () => clearInterval(t);
  }, []);

  // Derived heading split for subtle gradient emphasis
  const heroHeading = useMemo(
    () => ({
      line1: 'Think visually.',
      line2: 'Build together.',
      line3: 'Ship faster.',
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[var(--chart-4)]/40 selection:text-foreground">
      {/* NAV */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-card/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <IdeeaLogo />
          <div className="hidden items-center gap-8 md:flex">
            <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => scrollTo('features')}>
              Features
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => scrollTo('use-cases')}>
              Use Cases
            </button>
            <button
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => scrollTo('testimonials')}
            >
              Testimonials
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => scrollTo('pricing')}>
              Pricing
            </button>
            <Link
              href={`${dashboardUrl}`}
              className={`rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-black/5 transition hover:shadow-md bg-gradient-to-br ${brandGradient}`}
            >
              Get Started
            </Link>
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary hover:bg-secondary/80"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Mobile */}
          <button
            className="inline-flex items-center justify-center rounded-lg border border-border p-2 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>

        {mobileOpen && (
          <div className="absolute inset-x-0 top-full border-b border-border bg-card/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 md:hidden">
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm font-semibold text-muted-foreground">Menu</span>
                <button
                  className="inline-flex items-center justify-center rounded-lg border border-border p-2"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              {['features', 'use-cases', 'testimonials', 'pricing'].map((id) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {id.replace('-', ' ')}
                </button>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/auth"
                  className={`flex-1 rounded-xl px-4 py-2 text-center text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-black/5 transition hover:shadow-md bg-gradient-to-br ${brandGradient}`}
                >
                  Get Started
                </Link>
                <button
                  onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary hover:bg-secondary/80"
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        className={`relative overflow-hidden pt-28 md:pt-32 pb-20 ${brandRadial}`}
      >
        {/* subtle gradient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
          <div className="absolute left-1/2 top-[-20%] h-[50rem] w-[50rem] -translate-x-1/2 rounded-full blur-3xl opacity-20 bg-[conic-gradient(from_180deg,var(--chart-1),var(--chart-2),var(--chart-3))]" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 md:grid-cols-2 md:gap-16">
          <div id="hero-text" data-animate className={show('hero-text')}>
            <Badge>
              <Zap size={14} />
              Real-time Collaboration Platform
            </Badge>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              <span className="block">ideea</span>
              <span className={`block bg-gradient-to-r ${brandGradient} bg-clip-text text-transparent`}>
                {heroHeading.line1}
              </span>
              <span className="block">{heroHeading.line2}</span>
              <span className="block text-muted-foreground">{heroHeading.line3}</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              The all-in-one creative hub where teams sketch, discuss, and ship ideas. Lightning-fast presence,
              precision tools, and sharing that just works.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth"
                className={`group inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:shadow-md bg-gradient-to-br ${brandGradient}`}
              >
                Start free <ArrowIcon />
              </Link>
              <button className="inline-flex items-center justify-center rounded-xl border border-border bg-secondary px-5 py-3 text-sm font-semibold hover:bg-secondary/80">
                <Play size={16} className="mr-2" />
                Watch demo (2 min)
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <StatPill value="60K+" label="Active Users" />
              <StatPill value="1.3M+" label="Boards Created" />
              <StatPill value="99.99%" label="Uptime" />
              <StatPill value="SOC2" label="Type II" />
            </div>
          </div>

          {/* Carousel */}
          <div
            id="hero-carousel"
            data-animate
            className={`${show('hero-carousel')}`}
          >
            <div
              className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg"
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
            >
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${slide * 100}%)` }}
              >
                {slides.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="w-full flex-shrink-0">
                      <div
                        className={`relative flex h-80 items-center justify-center overflow-hidden bg-gradient-to-br ${brandGradient}`}
                      >
                        <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />
                        <div className="relative z-10 text-center text-primary-foreground">
                          <Icon className="mx-auto mb-4 h-14 w-14 animate-pulse" />
                          <h3 className="mb-1 text-2xl font-bold">{s.title}</h3>
                          <p className="text-sm/6 opacity-90">{s.description}</p>
                        </div>

                        {/* subtle animated orbs */}
                        <div className="absolute right-6 top-4 h-14 w-14 animate-bounce rounded-full bg-white/15 blur-[1px]" />
                        <div
                          className="absolute left-8 bottom-8 h-10 w-10 animate-pulse rounded-full bg-white/10"
                          style={{ animationDelay: '600ms' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Controls */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card/80 p-2 shadow-sm backdrop-blur hover:bg-card"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card/80 p-2 shadow-sm backdrop-blur hover:bg-card"
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      i === slide ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div id="features-head" data-animate className={`mb-14 text-center ${show('features-head')}`}>
            <h2 className="text-3xl font-extrabold md:text-4xl">Built for modern, high-velocity teams</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              From workshops to wireframes—ideea adapts to your canvas and your cadence.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  id={`feature-${i}`}
                  data-animate
                  className={`${show(`feature-${i}`)} rounded-2xl border border-border bg-card p-6 transition hover:shadow-md`}
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <div className={`mb-4 inline-flex rounded-xl border border-border bg-secondary p-3`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section id="use-cases" className="border-y border-border py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div id="use-head" data-animate className={`mb-12 ${show('use-head')}`}>
            <h2 className="text-3xl font-extrabold md:text-4xl">One tool — endless ways to ideate</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Design reviews, systems diagrams, sprint planning, research synthesis, classrooms, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Design Teams', desc: 'Wireframes, flows, and component audits', icon: Shapes },
              { title: 'Engineering', desc: 'Architecture, incident maps, RFC reviews', icon: Zap },
              { title: 'Marketing', desc: 'Campaign storyboards, content mapping', icon: Users },
              { title: 'Education', desc: 'Workshops, lessons, async feedback', icon: MessageSquare },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  id={`use-${i}`}
                  data-animate
                  className={`${show(`use-${i}`)} group rounded-2xl border border-border bg-card p-6 transition hover:shadow-md`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div
                    className={`mb-4 inline-flex rounded-xl p-3 text-primary-foreground shadow ring-1 ring-black/5 bg-gradient-to-br ${brandGradient}`}
                  >
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24">
        <div className="mx-auto max-w-5xl px-5">
          <div id="t-head" data-animate className={`mb-12 text-center ${show('t-head')}`}>
            <h2 className="text-3xl font-extrabold md:text-4xl">Loved by teams worldwide</h2>
            <p className="mt-3 text-muted-foreground">Real stories from people moving faster with ideea.</p>
          </div>

          <div
            id="t-wrap"
            data-animate
            className={`${show('t-wrap')} relative overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-md`}
          >
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <Quote className="absolute -left-2 -top-2 h-24 w-24" />
              <Quote className="absolute -bottom-2 -right-2 h-24 w-24 rotate-180" />
            </div>

            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${tIndex * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full flex-shrink-0 text-center">
                  <blockquote className="mx-auto max-w-2xl text-lg leading-relaxed">
                    “{t.content}”
                  </blockquote>
                  <div className="mt-6 flex justify-center gap-1">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <div className="mt-3 text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTIndex(i)}
                  className={`h-2.5 w-2.5 rounded-full transition ${i === tIndex ? 'bg-foreground' : 'bg-muted'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-t border-border py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div id="p-head" data-animate className={`mb-12 text-center ${show('p-head')}`}>
            <h2 className="text-3xl font-extrabold md:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-3 text-muted-foreground">Choose the plan that matches your team’s momentum.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((p, i) => (
              <div
                key={i}
                id={`plan-${i}`}
                data-animate
                className={`${show(`plan-${i}`)} relative rounded-3xl border border-border bg-card p-8 shadow-sm transition hover:shadow-md`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {p.popular && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold text-primary-foreground shadow ring-1 ring-black/5 bg-gradient-to-br ${brandGradient}`}
                  >
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <div className="mt-3 flex items-end gap-2">
                  <span className={`text-4xl font-extrabold ${p.price === 'Custom' ? 'text-3xl' : ''}`}>{p.price}</span>
                  <span className="pb-1 text-sm text-muted-foreground">{p.period}</span>
                </div>

                <ul className="mt-6 space-y-3 text-sm">
                  {p.features.map((f: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-8 w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-sm ring-1 ring-black/5 transition ${
                    p.popular
                      ? `text-primary-foreground hover:shadow-md bg-gradient-to-br ${brandGradient}`
                      : 'border border-border bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
          <div className="absolute left-1/2 top-0 h-[44rem] w-[44rem] -translate-x-1/2 rounded-full blur-3xl opacity-25 bg-[conic-gradient(from_90deg,var(--chart-3),var(--chart-5),var(--chart-2))]" />
        </div>
        <div className="mx-auto max-w-5xl px-5">
          <div
            id="cta"
            data-animate
            className={`${show('cta')} rounded-3xl border border-border bg-card p-8 text-center shadow-md md:p-12`}
          >
            <h3 className="text-2xl font-extrabold md:text-3xl">Ready to bring your ideas to life?</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
              Join thousands of teams using ideea to collaborate visually and move work forward.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/auth"
                className={`group inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:shadow-md bg-gradient-to-br ${brandGradient}`}
              >
                Start your free workspace <ArrowIcon />
              </Link>
              <button className="inline-flex items-center justify-center rounded-xl border border-border bg-secondary px-5 py-3 text-sm font-semibold hover:bg-secondary/80">
                Talk to sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card py-14">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <IdeeaLogo />
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                ideea is the canvas for teams to visualize thinking, align fast, and execute together—without tool
                friction.
              </p>
              <div className="mt-5 flex gap-3">
                <a
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary"
                >
                  <Github size={18} />
                </a>
                <a
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold">Product</div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a className="hover:text-foreground" href="#">Features</a></li>
                <li><a className="hover:text-foreground" href="#">Use Cases</a></li>
                <li><a className="hover:text-foreground" href="#">Pricing</a></li>
                <li><a className="hover:text-foreground" href="#">Roadmap</a></li>
                <li><a className="hover:text-foreground" href="#">Changelog</a></li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold">Resources</div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a className="hover:text-foreground" href="#">Documentation</a></li>
                <li><a className="hover:text-foreground" href="#">Tutorials</a></li>
                <li><a className="hover:text-foreground" href="#">Blog</a></li>
                <li><a className="hover:text-foreground" href="#">Community</a></li>
                <li><a className="hover:text-foreground" href="#">Support</a></li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold">Company</div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a className="hover:text-foreground" href="#">About</a></li>
                <li><a className="hover:text-foreground" href="#">Careers</a></li>
                <li><a className="hover:text-foreground" href="#">Contact</a></li>
                <li><a className="hover:text-foreground" href="#">Partners</a></li>
                <li><a className="hover:text-foreground" href="#">Press</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
            <div>&copy; {new Date().getFullYear()} ideea, Inc. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
              <a href="#" className="hover:text-foreground">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ArrowIcon = () => (
  <span className="ml-2 inline-flex items-center transition-transform group-hover:translate-x-0.5">
    <ChevronRight size={16} />
  </span>
);

export default LandingPage;
