export const IdeeaIllustration = () => {
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