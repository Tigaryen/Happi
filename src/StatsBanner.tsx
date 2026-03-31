import { useEffect, useRef, useState } from 'react';

// ── Word Rotator ────────────────────────────────────────────────────────────
const WordRotator = () => {
  const [index, setIndex] = useState(0);
  const words = ["Customers", "Employees", "Businesses"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 4100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col items-start text-left overflow-visible text-5xl md:text-7xl font-black tracking-tighter"
      style={{ minHeight: '2.5em' }}
    >
      <span className="text-happi-accent leading-none">Happier</span>
      <div
        className="relative overflow-hidden w-full"
        style={{ height: '1.3em', marginTop: '12px' }}
      >
        {words.map((word, i) => {
          const isActive = i === index;
          const isPast = i === (index - 1 + words.length) % words.length;
          return (
            <span
              key={word}
              className="absolute left-0 right-0 text-happi-primary whitespace-nowrap"
              style={{
                transform: isActive ? 'translateY(0)' : isPast ? 'translateY(-100%)' : 'translateY(100%)',
                opacity: isActive ? 1 : 0,
                transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                visibility: (isActive || isPast) ? 'visible' : 'hidden',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ── Animated count stat ─────────────────────────────────────────────────────
function StatItem({ endValue, suffix, label, color }: { endValue: number; suffix: string; label: string; color: string }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let current = 0;
          const increment = endValue / 60;
          const timer = setInterval(() => {
            current += increment;
            if (current >= endValue) {
              setCount(endValue);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 33);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [endValue]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1.5">
      <div className="relative pr-3">
        <div className="absolute -top-1.5 -right-0.5 w-4 h-4 rounded-full opacity-80" style={{ backgroundColor: color }} />
        <span className="text-4xl md:text-6xl font-bold text-happi-accent">{count}{suffix}</span>
      </div>
      <span className="text-xs md:text-sm font-medium tracking-wide uppercase text-happi-muted text-center">{label}</span>
    </div>
  );
}

// ── Static stat (no count-up) ───────────────────────────────────────────────
function StaticItem({ value, label, color }: { value: string; label: string; color: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`flex flex-col items-center gap-1.5 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative pr-3">
        <div className="absolute -top-1.5 -right-0.5 w-4 h-4 rounded-full opacity-80" style={{ backgroundColor: color }} />
        <span className="text-4xl md:text-6xl font-bold text-happi-accent">{value}</span>
      </div>
      <span className="text-xs md:text-sm font-medium tracking-wide uppercase text-happi-muted text-center">{label}</span>
    </div>
  );
}

// ── Combined banner ─────────────────────────────────────────────────────────
export default function StatsBanner() {
  return (
    <section className="w-full py-16 md:py-24 bg-white overflow-visible">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">

          {/* Left — animated text */}
          <div className="w-full md:w-auto md:flex-1">
            <WordRotator />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px self-stretch bg-happi-border" />

          {/* Right — stats */}
          <div className="w-full md:w-auto md:flex-1 flex flex-row items-center justify-between md:justify-around gap-2 md:gap-6">
            <StatItem endValue={60} suffix="+" label="Projects Delivered" color="#f472b6" />
            <div className="w-px h-10 bg-happi-border shrink-0" />
            <StatItem endValue={100} suffix="x" label="Faster Workflows" color="#67e8f9" />
            <div className="w-px h-10 bg-happi-border shrink-0" />
            <StaticItem value="24/7" label="Availability" color="#fde047" />
          </div>

        </div>
      </div>
    </section>
  );
}
