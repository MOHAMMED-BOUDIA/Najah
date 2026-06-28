import { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeNavbar from '../components/HomeNavbar';
import Footer from '../components/Footer';
import { FiClock, FiUser } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const posts = [
  { id: 'future-online-learning', title: 'The Future of Online Learning in Morocco', excerpt: 'How digital education platforms are transforming the way Moroccan students learn and develop professional skills.', category: 'Education', author: 'Sara Amrani', date: 'Jun 22, 2026', readTime: '5 min', color: 'from-[#FFB900] to-[#0084D1]' },
  { id: '5-tips-succeed-formation', title: '5 Tips to Succeed in Your Formation', excerpt: 'Practical advice to make the most of your instructor-led training and achieve your learning goals.', category: 'Student Tips', author: 'Ahmed Benali', date: 'Jun 18, 2026', readTime: '4 min', color: 'from-[#FFB900] to-[#0084D1]' },
  { id: 'choose-right-instructor', title: 'How to Choose the Right Instructor', excerpt: 'A guide to finding the perfect instructor for your learning style and professional needs.', category: 'Guidance', author: 'Youssef Karim', date: 'Jun 14, 2026', readTime: '6 min', color: 'from-cyan-500 to-blue-600' },
  { id: 'top-instructors-month', title: 'Meet Our Top Instructors of the Month', excerpt: 'Celebrating the educators who go above and beyond for their students on NAJAH.', category: 'Community', author: 'Nadia Tazi', date: 'Jun 10, 2026', readTime: '3 min', color: 'from-emerald-500 to-teal-600' },
  { id: 'group-learning-vs-self-study', title: 'Group Learning vs Self-Study: Which is Better?', excerpt: 'Comparing the benefits of collaborative group learning with traditional self-paced study methods.', category: 'Education', author: 'Sara Amrani', date: 'Jun 6, 2026', readTime: '5 min', color: 'from-amber-500 to-orange-600' },
  { id: 'career-tech-without-degree', title: 'Building a Career in Tech Without a Degree', excerpt: 'How alternative education platforms like NAJAH are opening doors to tech careers for everyone.', category: 'Career', author: 'Ahmed Benali', date: 'Jun 2, 2026', readTime: '7 min', color: 'from-rose-500 to-pink-600' },
];

const categories = ['All', 'Education', 'Student Tips', 'Guidance', 'Community', 'Career'];

export default function Blog() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('All');

  const categoryLabels = {
    All: t('static.blog.all'),
    Education: t('static.blog.education'),
    'Student Tips': t('static.blog.studentTips'),
    Guidance: t('static.blog.guidance'),
    Community: t('static.blog.community'),
    Career: t('static.blog.career'),
  };

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
      <HomeNavbar />
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
              {t('static.blog.title')}{' '}
              <span className="bg-gradient-to-r from-[#FFB900] to-[#0084D1] bg-clip-text text-transparent">
                {t('static.blog.titleAccent')}
              </span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
              {t('static.blog.subtitle')}
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#FFB900] to-[#0084D1] text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all block"
              >
                <div className={`h-44 bg-gradient-to-br ${post.color} flex items-center justify-center`}>
                  <span className="text-4xl font-bold text-white/30">{categoryLabels[post.category]}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${post.color} text-white`}>{categoryLabels[post.category]}</span>
                    <span className="flex items-center gap-1"><FiClock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                  <h3 className="font-bold mb-2 group-hover:text-[#0084D1] transition-colors">{post.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><FiUser className="w-3 h-3" />{post.author}</span>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <p className="text-center text-gray-400 mt-12">{t('static.blog.noArticles')}</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
