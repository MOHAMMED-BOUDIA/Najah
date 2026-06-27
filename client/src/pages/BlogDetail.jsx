import { useParams, Link } from 'react-router-dom';
import HomeNavbar from '../components/HomeNavbar';
import Footer from '../components/Footer';
import { FiArrowLeft, FiClock, FiUser, FiCalendar } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const posts = [
  { id: 'future-online-learning', title: 'The Future of Online Learning in Morocco', excerpt: 'How digital education platforms are transforming the way Moroccan students learn and develop professional skills.', content: 'Online learning in Morocco has seen unprecedented growth over the past few years. With platforms like NAJAH leading the way, students now have access to high-quality instructor-led training from anywhere in the country.\n\nThe traditional education system faces challenges in keeping up with the rapidly evolving job market. NAJAH bridges this gap by connecting students with industry professionals who bring real-world experience to the classroom.\n\nWhether you are in Casablanca, Rabat, or a small rural town, NAJAH brings expert-led formations directly to your screen. The future of education is digital, accessible, and personalized.', category: 'Education', author: 'Sara Amrani', date: 'Jun 22, 2026', readTime: '5 min', color: 'from-[#FFB900] to-[#0084D1]' },
  { id: '5-tips-succeed-formation', title: '5 Tips to Succeed in Your Formation', excerpt: 'Practical advice to make the most of your instructor-led training.', content: 'Enrolling in a formation is just the first step. To truly succeed, you need a strategy. Here are five tips to make the most of your NAJAH experience.\n\n1. Set a consistent study schedule. Treat your formation like a real class by dedicating specific hours each day.\n\n2. Engage actively in group discussions and live meetings. The more you participate, the more you learn.\n\n3. Complete all assignments on time. They are designed to reinforce your understanding.\n\n4. Build a relationship with your instructor. Ask questions, seek feedback, and leverage their expertise.\n\n5. Track your progress regularly using your dashboard. Celebrate small wins to stay motivated.', category: 'Student Tips', author: 'Ahmed Benali', date: 'Jun 18, 2026', readTime: '4 min', color: 'from-[#FFB900] to-[#0084D1]' },
  { id: 'choose-right-instructor', title: 'How to Choose the Right Instructor', excerpt: 'A guide to finding the perfect instructor for your learning style.', content: 'Choosing the right instructor can make or break your learning experience. Here is how to find the best match on NAJAH.\n\nFirst, review the instructor profile. Look at their background, years of experience, and areas of expertise. A good instructor brings both knowledge and teaching ability.\n\nSecond, read reviews from other students. Their feedback can give you valuable insights into teaching style and communication.\n\nThird, consider the formations they offer. Does their curriculum align with your learning goals? Check the topics covered and the structure of the program.\n\nFinally, do not hesitate to reach out with questions before enrolling. A responsive instructor is a good sign.', category: 'Guidance', author: 'Youssef Karim', date: 'Jun 14, 2026', readTime: '6 min', color: 'from-cyan-500 to-blue-600' },
  { id: 'top-instructors-month', title: 'Meet Our Top Instructors of the Month', excerpt: 'Celebrating educators who go above and beyond for their students.', content: 'Every month, NAJAH recognizes instructors who have made an exceptional impact on their students. These educators go above and beyond to provide engaging, high-quality learning experiences.\n\nThis month, we are proud to highlight Dr. Ahmed Benali for his outstanding Full-Stack Web Development formation, Sara Amrani for her engaging Data Science sessions, and Youssef Karim for his comprehensive Mobile Development curriculum.\n\nThese instructors consistently receive top ratings from students for their clarity, responsiveness, and dedication. If you are looking for a formation, starting with one of our top-rated instructors is a safe bet.\n\nCongratulations to all our featured instructors. Your hard work is shaping the future of education in Morocco.', category: 'Community', author: 'Nadia Tazi', date: 'Jun 10, 2026', readTime: '3 min', color: 'from-emerald-500 to-teal-600' },
  { id: 'group-learning-vs-self-study', title: 'Group Learning vs Self-Study: Which is Better?', excerpt: 'Comparing the benefits of collaborative and self-paced learning methods.', content: 'Both group learning and self-study have their advantages, and the best choice depends on your learning style and goals.\n\nGroup learning on NAJAH offers live meetings, group chats, and collaborative projects. This approach is ideal if you thrive on interaction, accountability, and diverse perspectives. Studying with peers can keep you motivated and help you understand concepts through discussion.\n\nSelf-study offers flexibility. You learn at your own pace, on your own schedule, focusing on exactly what you need. This works well for disciplined learners who prefer independence.\n\nThe best approach? Combine both. Use NAJAH formations for structured group learning, then supplement with self-study for deeper exploration.', category: 'Education', author: 'Sara Amrani', date: 'Jun 6, 2026', readTime: '5 min', color: 'from-amber-500 to-orange-600' },
  { id: 'career-tech-without-degree', title: 'Building a Career in Tech Without a Degree', excerpt: 'How alternative education platforms are opening doors to tech careers.', content: 'A university degree has long been seen as the only path to a successful career. But the tech industry is proving that skills matter more than diplomas.\n\nPlatforms like NAJAH are democratizing access to tech education. Students can learn web development, data science, mobile development, and more from experienced professionals without enrolling in a traditional university program.\n\nEmployers are increasingly valuing practical skills over formal credentials. A strong portfolio of projects, combined with certifications from recognized platforms, can open doors to high-paying tech jobs.\n\nNAJAH graduates have gone on to work at leading companies, launch their own startups, and even become instructors themselves. The future of hiring is skills-based, and NAJAH is here to help you build those skills.', category: 'Career', author: 'Ahmed Benali', date: 'Jun 2, 2026', readTime: '7 min', color: 'from-rose-500 to-pink-600' },
];

export default function BlogDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
        <HomeNavbar />
        <section className="pt-32 pb-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">{t('static.blog.notFound')}</h1>
            <Link to="/blog" className="text-[#0084D1] hover:underline">{t('static.blog.backToBlog')}</Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
      <HomeNavbar />
      <section className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#0084D1] transition-colors mb-8">
            <FiArrowLeft className="w-4 h-4" />
            {t('static.blog.backToBlog')}
          </Link>

          <div className={`inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${post.color} text-white text-xs font-medium mb-4`}>
            {post.category}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">{post.title}</h1>

          <div className="flex items-center gap-6 text-sm text-gray-400 mb-10 pb-8 border-b border-gray-200 dark:border-gray-800">
            <span className="flex items-center gap-1.5"><FiUser className="w-4 h-4" />{post.author}</span>
            <span className="flex items-center gap-1.5"><FiCalendar className="w-4 h-4" />{post.date}</span>
            <span className="flex items-center gap-1.5"><FiClock className="w-4 h-4" />{post.readTime}{' '}{t('static.blog.minRead')}</span>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            {post.content.split('\n').map((paragraph, i) => (
              <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
