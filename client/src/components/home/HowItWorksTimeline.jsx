import { useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiMail, HiSearch, HiPlay } from 'react-icons/hi';

const steps = [
  { icon: HiMail, title: 'Create Your Account', desc: 'Sign up for free with your Gmail and verify your email to get started.' },
  { icon: HiSearch, title: 'Choose Your Instructor', desc: 'Browse available instructors and request to join their training group.' },
  { icon: HiPlay, title: 'Start Your Formation', desc: 'Once approved, access courses, tasks, meetings, and learn at your own pace.' },
];

const StepItem = memo(function StepItem({ step, i, active }) {
  const ref = useRef(null);
  const cardInView = useInView(ref, { once: true, margin: '-40px' });
  const StepIcon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={cardInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.35, delay: i * 0.15, ease: 'easeOut' }}
      className="relative flex items-start gap-6 md:gap-10"
    >
      <div className="relative z-10 flex-shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
          <StepIcon className="w-5 h-5" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-950 border-2 border-indigo-500 flex items-center justify-center">
          <span className="text-[10px] font-bold text-indigo-600">{i + 1}</span>
        </div>
      </div>

      <div className="flex-1 pt-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  );
});

function HowItWorksTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how-it-works" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Start learning in{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              3 simple steps
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            From account creation to learning in minutes.
          </p>
        </motion.div>

        <div ref={ref} className="max-w-3xl mx-auto relative">
          <div className="absolute left-6 top-14 bottom-0 w-0.5 hidden md:block">
            <motion.div
              initial={{ height: 0 }}
              animate={isInView ? { height: '100%' } : {}}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="w-full bg-gradient-to-b from-indigo-500 to-purple-600"
            />
          </div>

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, i) => (
              <StepItem key={step.title} step={step} i={i} active={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(HowItWorksTimeline);
