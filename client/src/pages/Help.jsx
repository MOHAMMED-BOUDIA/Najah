import { useState } from 'react';
import HomeNavbar from '../components/HomeNavbar';
import Footer from '../components/Footer';
import { FiSearch, FiBookOpen, FiUserCheck, FiSettings, FiShield, FiLayers, FiTool, FiX, FiClock, FiArrowRight, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const articles = [
  {
    id: 1, title: 'How to create an account', description: 'Step-by-step guide to register on NAJAH', category: 'Getting Started', readTime: '3 min',
    content: 'Creating an account on NAJAH is quick and free. Click "Get Started" on the homepage, enter your name, email, and password, then verify your email address through the link we send you. Once verified, you can immediately browse formations and instructors.'
  },
  {
    id: 2, title: 'Navigating the dashboard', description: 'Learn how to use your student dashboard', category: 'Getting Started', readTime: '4 min',
    content: 'Your dashboard is the central hub for all your learning activity. From here you can view your enrolled formations, track progress, check upcoming live meetings, see new messages, and access your profile settings. The sidebar gives you quick access to all sections.'
  },
  {
    id: 3, title: 'Finding formations', description: 'How to browse and discover formations', category: 'Getting Started', readTime: '3 min',
    content: 'Head to the Instructors page to see all available instructors and their formations. Each instructor profile lists their specialties, formation count, and ratings. Click on an instructor to view their available formations and request to join.'
  },
  {
    id: 4, title: 'Updating your profile', description: 'Change your name, photo, and preferences', category: 'Account', readTime: '2 min',
    content: 'Go to your Profile page from the dashboard menu. Here you can update your name, profile photo, bio, and notification preferences. Changes are saved automatically. You can also link your social accounts for easier login.'
  },
  {
    id: 5, title: 'Changing your password', description: 'How to reset or change your password', category: 'Account', readTime: '2 min',
    content: 'In your Profile settings, click "Change Password". Enter your current password, then your new password twice. Make sure your new password is at least 8 characters and includes a mix of letters, numbers, and symbols.'
  },
  {
    id: 6, title: 'Deleting your account', description: 'Permanently close your NAJAH account', category: 'Account', readTime: '3 min',
    content: 'To delete your account, go to Profile settings and scroll to "Danger Zone". Click "Delete Account" and confirm. This action is permanent and cannot be undone. Your data will be erased within 30 days. Download any data you want to keep first.'
  },
  {
    id: 7, title: 'How to join a formation', description: 'Enroll in your first formation', category: 'Formations', readTime: '4 min',
    content: 'Once you find an instructor and formation you like, click "Request to Join". The instructor will review your request and approve it. You will receive a notification once approved. After that, the formation appears in your dashboard and you can access all materials.'
  },
  {
    id: 8, title: 'Tracking your progress', description: 'Monitor your learning journey', category: 'Formations', readTime: '3 min',
    content: 'Each formation has a progress bar showing how much of the curriculum you have completed. Your dashboard displays overall progress across all formations. You can also view detailed stats per course, including completed tasks, quiz scores, and attendance.'
  },
  {
    id: 9, title: 'Completing assignments', description: 'How to submit and track assignments', category: 'Formations', readTime: '4 min',
    content: 'Assignments are listed in each formation. Click on an assignment to view instructions and the due date. Submit your work through the upload form. Instructors review submissions and provide feedback, which you can see in the assignment details page.'
  },
  {
    id: 10, title: 'Contacting your instructor', description: 'How to reach your instructor', category: 'Instructors', readTime: '2 min',
    content: 'You can message your instructor directly through the group chat or send a private message from their profile page. Instructors typically respond within 24 hours. For urgent matters, check if they have office hours listed on their profile.'
  },
  {
    id: 11, title: 'How live meetings work', description: 'Attend and participate in live sessions', category: 'Instructors', readTime: '3 min',
    content: 'Live meetings are scheduled by your instructor and appear on your dashboard calendar. Click "Join" when the session is active to enter the video call. You can ask questions via chat or raise your hand to speak. Recordings are available afterward.'
  },
  {
    id: 12, title: 'Understanding group chat', description: 'Collaborate with peers in real-time', category: 'Formations', readTime: '2 min',
    content: 'Each formation has a dedicated group chat where you can discuss topics, ask questions, and share resources with fellow students. Your instructor also participates. Keep conversations respectful and on-topic. Pin important messages for easy reference.'
  },
  {
    id: 13, title: 'Payment and billing FAQ', description: 'Common questions about billing', category: 'Billing', readTime: '3 min',
    content: 'NAJAH is currently free for all students. There are no hidden fees or subscription costs. If premium features are introduced in the future, we will announce them clearly with transparent pricing. Instructors are compensated through our platform partnership model.'
  },
  {
    id: 14, title: 'Privacy settings explained', description: 'Control your data and visibility', category: 'Security', readTime: '4 min',
    content: 'In your Profile settings, you can control who sees your profile, activity status, and learning progress. You can choose to make your profile public or private. We never share your data with third parties without your explicit consent.'
  },
  {
    id: 15, title: 'Two-factor authentication', description: 'Add extra security to your account', category: 'Security', readTime: '5 min',
    content: 'Enable two-factor authentication in Security settings. You can use an authenticator app like Google Authenticator or receive codes via email. Once enabled, you will need a code from your chosen method in addition to your password when logging in.'
  },
  {
    id: 16, title: 'How to reset your password', description: 'Quick steps to regain access', category: 'Account', readTime: '2 min',
    content: 'On the login page, click "Forgot Password". Enter your email address and we will send you a reset link. Click the link in the email and choose a new password. Make sure to check your spam folder if you do not see the email within a few minutes.'
  },
];

export default function Help() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categoryOptions = [
    { key: 'Getting Started', label: t('static.help.gettingStarted'), icon: FiBookOpen, desc: t('static.help.gettingStartedDesc') },
    { key: 'Account', label: t('static.help.account'), icon: FiUserCheck, desc: t('static.help.accountDesc') },
    { key: 'Formations', label: t('static.help.formations'), icon: FiLayers, desc: t('static.help.formationsDesc') },
    { key: 'Instructors', label: t('static.help.instructors'), icon: FiTool, desc: t('static.help.instructorsDesc') },
    { key: 'Billing', label: t('static.help.billing'), icon: FiSettings, desc: t('static.help.billingDesc') },
    { key: 'Security', label: t('static.help.security'), icon: FiShield, desc: t('static.help.securityDesc') },
  ];

  const categoryLabels = {
    'Getting Started': t('static.help.gettingStarted'),
    'Account': t('static.help.account'),
    'Formations': t('static.help.formations'),
    'Instructors': t('static.help.instructors'),
    'Billing': t('static.help.billing'),
    'Security': t('static.help.security'),
  };

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || a.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
      <HomeNavbar />

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 pb-16 overflow-y-auto bg-black/50 backdrop-blur-sm" onClick={() => setSelectedArticle(null)}>
          <div className="relative w-full max-w-3xl mx-4 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <button onClick={() => setSelectedArticle(null)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#0084D1] transition-colors">
                <FiX className="w-4 h-4" />
                {t('static.help.close')}
              </button>
              <span className="text-xs text-gray-400">{t('static.help.lastUpdated')}</span>
            </div>
            <div className="px-6 py-8">
              <span className="inline-flex px-3 py-1 rounded-full bg-[#0084D1]/10 text-[#0084D1] text-xs font-medium mb-4">
                {categoryLabels[selectedArticle.category] || selectedArticle.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">{selectedArticle.title}</h2>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                <FiClock className="w-3 h-3" />
                {selectedArticle.readTime}
              </div>
              <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {selectedArticle.content}
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold mb-3">{t('static.help.relatedArticles')}</h3>
                <div className="space-y-2">
                  {articles.filter((a) => a.category === selectedArticle.category && a.id !== selectedArticle.id).slice(0, 3).map((rel) => (
                    <button key={rel.id} onClick={() => setSelectedArticle(rel)} className="block text-sm text-[#0084D1] hover:underline text-left">
                      {rel.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
              {t('static.help.title')}{' '}
              <span className="bg-gradient-to-r from-[#FFB900] to-[#0084D1] bg-clip-text text-transparent">
                {t('static.help.titleAccent')}
              </span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
              {t('static.help.subtitle')}
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('static.help.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0084D1] focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Category Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            <button
              onClick={() => setCategory('All')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                category === 'All'
                  ? 'border-[#0084D1] bg-[#0084D1]/10 shadow-md'
                  : 'border-gray-200 dark:border-gray-800 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <h3 className="font-semibold">{t('static.help.allArticles')}</h3>
              <p className="text-sm text-gray-400 mt-1">{articles.length} {t('static.help.articles')}</p>
            </button>
            {categoryOptions.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  category === cat.key
                    ? 'border-[#0084D1] bg-[#0084D1]/10 shadow-md'
                    : 'border-gray-200 dark:border-gray-800 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFB900] to-[#0084D1] flex items-center justify-center text-white mb-3">
                  <cat.icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm">{cat.label}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat.desc}</p>
              </button>
            ))}
          </div>

          {/* Results Header */}
          <div className="max-w-3xl mx-auto mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {search || category !== 'All' ? t('static.help.searchResults') : t('static.help.popularArticles')}
            </h2>
            <span className="text-xs text-gray-400">{filtered.length} {t('static.help.articles')}</span>
          </div>

          {/* Articles List */}
          <div className="max-w-3xl mx-auto space-y-3 mb-16">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">{t('static.help.noResults')}</p>
                <button onClick={() => { setSearch(''); setCategory('All'); }} className="text-sm text-[#0084D1] hover:underline mt-2">
                  {t('static.help.clearFilters')}
                </button>
              </div>
            ) : (
              filtered.map((article) => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition flex items-start justify-between gap-4 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#0084D1]">{categoryLabels[article.category] || article.category}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><FiClock className="w-3 h-3" />{article.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-sm">{article.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{article.description}</p>
                  </div>
                  <FiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0084D1] transition-colors flex-shrink-0 mt-1" />
                </button>
              ))
            )}
          </div>

          {/* Contact Support */}
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-[#0084D1]/10 to-[#FFB900]/10 border border-[#0084D1]/30 text-center">
            <h2 className="text-2xl font-bold mb-2">{t('static.help.stillNeedHelp')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {t('static.help.supportDesc')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFB900] to-[#0084D1] text-white font-semibold text-sm hover:from-[#FFB900] hover:to-[#0277BD] transition-all shadow-lg shadow-[#0084D1]/25">
                {t('static.help.contactSupport')}
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <a href="mailto:support@najah.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                <FiMail className="w-4 h-4" />
                support@najah.com
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
