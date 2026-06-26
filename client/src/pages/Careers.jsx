import HomeNavbar from '../components/HomeNavbar';
import Footer from '../components/Footer';
import { FiMapPin, FiClock, FiBriefcase } from 'react-icons/fi';

const positions = [
  { title: 'Senior Full-Stack Developer', dept: 'Engineering', location: 'Remote', type: 'Full-time', desc: 'Build and scale the NAJAH platform using React, Node.js, and MongoDB.' },
  { title: 'UX Designer', dept: 'Design', location: 'Casablanca', type: 'Full-time', desc: 'Design intuitive learning experiences for students and instructors.' },
  { title: 'Content Creator', dept: 'Education', location: 'Remote', type: 'Part-time', desc: 'Create engaging course materials and video content for our formations.' },
  { title: 'Community Manager', dept: 'Community', location: 'Remote', type: 'Full-time', desc: 'Grow and engage the NAJAH student and instructor community.' },
  { title: 'Data Analyst', dept: 'Data', location: 'Casablanca', type: 'Full-time', desc: 'Analyze platform data to improve learning outcomes and user experience.' },
  { title: 'Marketing Intern', dept: 'Marketing', location: 'Remote', type: 'Internship', desc: 'Support marketing campaigns and social media growth initiatives.' },
];

const perks = [
  'Remote-friendly work environment',
  'Flexible working hours',
  'Professional development budget',
  'Team retreats and events',
  'Competitive compensation',
  'Make a real impact in education',
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
      <HomeNavbar />
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-6">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
              Join the{' '}
              <span className="bg-gradient-to-r from-[#FFB900] to-[#0084D1] bg-clip-text text-transparent">
                NAJAH Team
              </span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
              Help us shape the future of education in Morocco and beyond.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0084D1]/10 border border-[#0084D1]/30 text-sm font-medium text-[#0084D1] mx-auto block w-fit mb-16">
            <span className="w-2 h-2 rounded-full bg-[#0084D1] animate-pulse" />
            We are hiring! 6 open positions
          </div>

          {/* Culture */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Culture</h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                At NAJAH, we believe in the power of education to transform lives. Our team is
                passionate, collaborative, and driven by a shared mission. We value creativity,
                inclusivity, and continuous learning.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {perks.map((p) => (
                  <div key={p} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0084D1]" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div className="aspect-[4/3] rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
                alt="Modern office team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0084D1]/20 to-[#0084D1]/20" />
            </div>
          </div>

          {/* Open Positions */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {positions.map((pos) => (
                <div key={pos.title} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFB900] to-[#0084D1] flex items-center justify-center text-white mb-4">
                    <FiBriefcase className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold mb-1 group-hover:text-[#0084D1] transition-colors">{pos.title}</h3>
                  <p className="text-xs text-[#0084D1] font-medium mb-3">{pos.dept}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{pos.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><FiMapPin className="w-3 h-3" />{pos.location}</span>
                    <span className="flex items-center gap-1"><FiClock className="w-3 h-3" />{pos.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
