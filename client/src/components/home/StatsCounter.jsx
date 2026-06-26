import { useRef, useState, useEffect, memo } from 'react';
import { useInView } from 'framer-motion';

const AnimatedNumber = memo(function AnimatedNumber({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
});

const stats = [
  { value: 500, suffix: '+', label: 'Students Enrolled' },
  { value: 25, suffix: '+', label: 'Expert Instructors' },
  { value: 100, suffix: '+', label: 'Active Formations' },
  { value: 95, suffix: '%', label: 'Success Rate' },
];

function StatsCounter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: `${i * 0.1}s`, transitionDuration: '0.35s', transitionProperty: 'opacity, transform', transitionTimingFunction: 'ease-out' }}
            >
              <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
                <AnimatedNumber target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(StatsCounter);
