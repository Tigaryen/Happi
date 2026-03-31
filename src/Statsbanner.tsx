import { useEffect, useRef, useState } from 'react';

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
    <div ref={ref} className="flex flex-col items-center gap-2 px-8 py-6">
      <div className="relative">
        <div className="absolute -top-2 -right-3 w-5 h-5 rounded-full opacity-80" style={{ backgroundColor: color }} />
        <span className="text-5xl md:text-6xl font-bold" style={{ color: '#020617' }}>
          {count}{suffix}
        </span>
      </div>
      <span className="text-sm md:text-base font-medium tracking-wide uppercase" style={{ color: '#1e293b' }}>
        {label}
      </span>
    </div>
  );
}

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
    <div ref={ref} className={`flex flex-col items-center gap-2 px-8 py-6 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative">
        <div className="absolute -top-2 -right-3 w-5 h-5 rounded-full opacity-80" style={{ backgroundColor: color }} />
        <span className="text-5xl md:text-6xl font-bold" style={{ color: '#020617' }}>{value}</span>
      </div>
      <span className="text-sm md:text-base font-medium tracking-wide uppercase" style={{ color: '#1e293b' }}>{label}</span>
    </div>
  );
}

export default function StatsBanner() {
  return (
    <section className="w-full py-16 md:py-20" style={{ background: 'linear-gradient(to right, #f0fdf4, #dcfce7)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-around gap-8 md:gap-4">
          <StatItem endValue={60} suffix="+" label="Projects Delivered" color="#f472b6" />
          <div className="hidden md:block w-px h-16 bg-gray-300" />
          <StatItem endValue={100} suffix="x" label="Faster Workflows" color="#67e8f9" />
          <div className="hidden md:block w-px h-16 bg-gray-300" />
          <StaticItem value="24/7" label="Availability" color="#fde047" />
        </div>
      </div>
    </section>
  );
}