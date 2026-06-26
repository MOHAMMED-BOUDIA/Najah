import { useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const instructors = [
  { name: 'Dr. Ahmed Benali', specialty: 'Full-Stack Web Development', formations: 12, avatar: 'AB', color: 'from-indigo-500 to-purple-600' },
  { name: 'Sara Amrani', specialty: 'Data Science & AI', formations: 8, avatar: 'SA', color: 'from-purple-500 to-pink-600' },
  { name: 'Youssef Karim', specialty: 'Mobile Development', formations: 10, avatar: 'YK', color: 'from-cyan-500 to-blue-600' },
  { name: 'Nadia Tazi', specialty: 'UI/UX Design', formations: 6, avatar: 'NT', color: 'from-emerald-500 to-teal-600' },
  { name: 'Omar Razi', specialty: 'Cloud & DevOps', formations: 7, avatar: 'OR', color: 'from-amber-500 to-orange-600' },
  { name: 'Lina Kadiri', specialty: 'Cybersecurity', formations: 5, avatar: 'LK', color: 'from-rose-500 to-pink-600' },
];

const InstructorCard = memo(function InstructorCard({ name, specialty, formations, avatar, color, i }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
      className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 hover:shadow-lg transition-all group"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm`}>
          {avatar}
        </div>
        <div>
          <h3 className="font-semibold text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{name}</h3>
          <p className="text-xs text-gray-400">{specialty}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{formations} formations</span>
        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
          View profile <FiArrowRight className="w-3 h-3" />
        </span>
      </div>
    </motion.div>
  );
});

function InstructorsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="instructors" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Meet Our{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Expert Instructors
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Learn from qualified professionals with real-world experience in their fields.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {instructors.map((inst, i) => (
            <InstructorCard key={inst.name} {...inst} i={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.35 }}
          className="text-center mt-10"
        >
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            View All Instructors
            <FiArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(InstructorsSection);
