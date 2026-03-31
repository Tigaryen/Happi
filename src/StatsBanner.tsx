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

const COUNT_DURATION = 1400; // ms — fixed duration regardless of end value

// easeOutExpo: fast start, decelerates to final value — feels snappy on mobile
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

// ── Animated count stat ─────────────────────────────────────────────────────
function StatItem({ endValue, suffix, label, color }: { endValue: number; suffix: string; label: string; color: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / COUNT_DURATION, 1);
            const value = Math.floor(easeOutExpo(progress) * endValue);
            // Write directly to DOM — no React re-render
            if (spanRef.current) spanRef.current.textContent = `${value}${suffix}`;
            if (progress < 1) {
              rafRef.current = requestAnimationFrame(animate);
            } else {
              if (spanRef.current) spanRef.current.textContent = `${endValue}${suffix}`;
            }
          };

          rafRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0, rootMargin: '0px 0px 100px 0px' }
    );
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [endValue, suffix]);

  return (
    <div ref={wrapperRef} className="flex flex-col items-center gap-1.5">
      <div className="relative pr-3">
        <div className="absolute -top-1.5 -right-0.5 w-4 h-4 rounded-full opacity-80" style={{ backgroundColor: color }} />
        <span ref={spanRef} className="text-4xl md:text-6xl font-bold text-happi-accent">0{suffix}</span>
      </div>
      <span className="text-xs md:text-sm font-medium tracking-wide uppercase text-happi-muted text-center">{label}</span>
    </div>
  );
}

// ── Static stat — CSS-driven fade in, no JS state ───────────────────────────
function StaticItem({ value, label, color }: { value: string; label: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '0px 0px 100px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-1.5"
      style={{ opacity: 0, transition: 'opacity 0.6s ease' }}
    >
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
            <StatItem endValue={60} suffix="+" label="Happy Customers" color="#f472b6" />
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
