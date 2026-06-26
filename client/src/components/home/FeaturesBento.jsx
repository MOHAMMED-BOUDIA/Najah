import { useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiOutlineBookOpen, HiOutlineUserGroup, HiOutlineClipboardList, HiOutlineCalendar, HiOutlineChatAlt2, HiOutlineChartBar } from 'react-icons/hi';
import { HiCheck } from 'react-icons/hi';

const checkItems = [
  '50+ expert-led formations',
  'Hands-on projects & labs',
  'Certificate on completion',
];

const colors = {
  formations: 'from-indigo-500 to-purple-600',
  instructors: 'from-purple-500 to-pink-600',
  group: 'from-pink-500 to-rose-600',
  meetings: 'from-cyan-500 to-blue-600',
  chat: 'from-amber-500 to-orange-600',
  progress: 'from-emerald-500 to-teal-600',
};

function MiniStat({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
    </div>
  );
}

const BentoCard = memo(function BentoCard({ icon: Icon, title, desc, color, size, i, children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const spanClass = size === 'large'
    ? 'sm:col-span-2 sm:row-span-2'
    : size === 'wide'
      ? 'sm:col-span-2 sm:row-span-1'
      : 'sm:col-span-1 sm:row-span-1';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
      className={`group relative overflow-hidden rounded-3xl border border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/70 p-6 sm:p-7 flex flex-col transition-shadow duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 ${spanClass}`}
      style={{ willChange: 'transform' }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${color} opacity-10 blur-2xl transition-opacity duration-300`} />

      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>

      <h3 className="font-bold text-gray-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{desc}</p>

      {children}
    </motion.div>
  );
});

function FeaturesBento() {
  const ref = useRef(null);
  const sectionInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="formations" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Everything you need
            </span>{' '}
            to learn and grow
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            All the tools you need to enroll in formations, learn from instructors, and track your progress in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px] sm:auto-rows-[200px]">
          <BentoCard
            icon={HiOutlineBookOpen}
            title="Expert Formations"
            desc="Enroll in high-quality training programs created by industry experts"
            color={colors.formations}
            size="large"
            i={0}
          >
            <div className="mt-3 space-y-2 flex-1">
              {checkItems.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <HiCheck className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" />
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 py-3 border-t border-gray-100 dark:border-gray-800">
              <MiniStat value="50+" label="Formations" />
              <MiniStat value="25+" label="Instructors" />
              <MiniStat value="4.9" label="Avg Rating" />
            </div>

            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1.5">
                <span>Completion rate</span>
                <span>78%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={sectionInView ? { width: '78%' } : {}}
                  transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                />
              </div>
            </div>
          </BentoCard>

          <BentoCard
            icon={HiOutlineUserGroup}
            title="Learn from Instructors"
            desc="Direct access to qualified instructors in your field"
            color={colors.instructors}
            size="small"
            i={1}
          />

          <BentoCard
            icon={HiOutlineClipboardList}
            title="Group Learning"
            desc="Join study groups and collaborate with fellow students"
            color={colors.group}
            size="small"
            i={2}
          />

          <BentoCard
            icon={HiOutlineCalendar}
            title="Live Meetings"
            desc="Attend scheduled sessions with your instructor and group"
            color={colors.meetings}
            size="wide"
            i={3}
          >
            <div className="mt-3 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live now
              </span>
              <span>12 sessions this week</span>
            </div>
          </BentoCard>

          <BentoCard
            icon={HiOutlineChatAlt2}
            title="Group Chat"
            desc="Ask questions and discuss topics in real-time"
            color={colors.chat}
            size="small"
            i={4}
          />

          <BentoCard
            icon={HiOutlineChartBar}
            title="Track Your Progress"
            desc="Monitor your learning journey with detailed progress tracking"
            color={colors.progress}
            size="small"
            i={5}
          />
        </div>
      </div>
    </section>
  );
}

export default memo(FeaturesBento);
