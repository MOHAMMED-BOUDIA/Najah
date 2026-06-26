import { useState } from 'react';

const testimonials = [
  { quote: 'NAJAH helped me master web development with hands-on training and amazing instructors.', name: 'Sara M.', role: 'Web Development', avatar: 'SM' },
  { quote: 'The platform makes learning so organized. I love the group chats and live meetings!', name: 'Ahmed K.', role: 'Mobile Development', avatar: 'AK' },
  { quote: 'Best decision I made. The instructors are top-notch and always available to help.', name: 'Yasmine B.', role: 'Data Science', avatar: 'YB' },
  { quote: 'I went from complete beginner to building my own app. Thank you NAJAH!', name: 'Omar R.', role: 'Full Stack Student', avatar: 'OR' },
  { quote: 'The formations are well-structured and the live sessions make all the difference.', name: 'Lina K.', role: 'AI Student', avatar: 'LK' },
  { quote: 'Finally a platform that connects students with real instructors. Game changer.', name: 'Rayan M.', role: 'Cyber Security', avatar: 'RM' },
];

const doubled = [...testimonials, ...testimonials];
const doubledRev = [...testimonials, ...testimonials].reverse();

function Stars() {
  return (
    <div className="flex gap-0.5 mb-3">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ quote, name, role, avatar, i }) {
  const borders = [
    'border-indigo-200/50 dark:border-indigo-700/50',
    'border-purple-200/50 dark:border-purple-700/50',
    'border-pink-200/50 dark:border-pink-700/50',
    'border-cyan-200/50 dark:border-cyan-700/50',
    'border-amber-200/50 dark:border-amber-700/50',
    'border-emerald-200/50 dark:border-emerald-700/50',
  ];

  return (
    <div
      className={`flex-shrink-0 w-[340px] rounded-2xl border bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-shadow ${borders[i % borders.length]}`}
    >
      <Stars />
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
          {avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{name}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, reverse }) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="overflow-hidden mb-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex gap-5"
        style={{
          animation: `marquee-${reverse ? 'rev' : 'fwd'} 40s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {items.map((t, i) => (
          <TestimonialCard key={`${reverse ? 'r' : 'f'}-${i}`} {...t} i={i} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsMarquee() {
  return (
    <section className="py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-pink-600/5 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              What our students say
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Hear from students who transformed their skills with NAJAH.
          </p>
        </div>
      </div>

      <MarqueeRow items={doubled} reverse={false} />
      <MarqueeRow items={doubledRev} reverse={true} />
    </section>
  );
}
