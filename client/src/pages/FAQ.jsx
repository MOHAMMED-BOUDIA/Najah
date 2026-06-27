import { useState } from 'react';
import HomeNavbar from '../components/HomeNavbar';
import Footer from '../components/Footer';
import { FiChevronDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

function Accordion({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-medium text-gray-900 dark:text-white">{q}</span>
        <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { t } = useTranslation();

  const categories = [
    {
      name: t('static.faq.general'),
      items: [
        { q: 'What is NAJAH?', a: 'NAJAH is a modern online learning platform that connects students with expert instructors for professional training programs.' },
        { q: 'Is NAJAH free?', a: 'Yes! NAJAH is completely free for students. You can enroll in formations and learn without any cost.' },
        { q: 'How do I create an account?', a: 'Click "Get Started" on the homepage, fill in your details, and verify your email address. It takes less than 2 minutes.' },
      ],
    },
    {
      name: t('static.faq.students'),
      items: [
        { q: 'How do I join a formation?', a: 'Browse available instructors, request to join their training group, and once approved, you will get access to all course materials.' },
        { q: 'Can I study at my own pace?', a: 'Yes. Formations include recorded materials you can access anytime, plus scheduled live sessions with your instructor.' },
        { q: 'How do I track my progress?', a: 'Your dashboard shows your enrolled formations, completed tasks, and overall progress percentage for each course.' },
      ],
    },
    {
      name: t('static.faq.instructors'),
      items: [
        { q: 'How do I become an instructor?', a: 'Contact us through the contact form. We review applications and onboard qualified professionals in various fields.' },
        { q: 'Can I create my own formation?', a: 'Yes, approved instructors can create and manage their own formations, including course content, tasks, and live sessions.' },
        { q: 'How do I communicate with students?', a: 'You can use group chats, schedule live meetings, and send announcements through the platform.' },
      ],
    },
    {
      name: t('static.faq.billing'),
      items: [
        { q: 'Is there any hidden fee?', a: 'No. The platform is free for students. Instructors may have premium features available as the platform grows.' },
        { q: 'How do I pay for premium features?', a: 'Premium features are not yet available. We will announce pricing when they launch.' },
        { q: 'Can I get a refund?', a: 'Since the platform is free, there is nothing to refund. Premium features will have a clear refund policy when introduced.' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
      <HomeNavbar />
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
              {t('static.faq.title')}{' '}
              <span className="bg-gradient-to-r from-[#FFB900] to-[#0084D1] bg-clip-text text-transparent">
                {t('static.faq.titleAccent')}
              </span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {t('static.faq.subtitle')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-12">
            {categories.map((cat, index) => (
              <div key={index}>
                <h2 className="text-lg font-bold text-[#0084D1] mb-2">{cat.name}</h2>
                <div className="border-t border-gray-200 dark:border-gray-800">
                  {cat.items.map((item) => (
                    <Accordion key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
