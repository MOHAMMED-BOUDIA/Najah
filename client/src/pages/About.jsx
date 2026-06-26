import HomeNavbar from '../components/HomeNavbar';
import Footer from '../components/Footer';

const team = [
  { name: 'Dr. Ahmed Benali', role: 'Founder & CEO', avatar: 'AB', initials: 'AB', color: 'from-[#FFB900] to-[#0084D1]' },
  { name: 'Sara Amrani', role: 'Head of Education', avatar: 'SA', initials: 'SA', color: 'from-[#FFB900] to-[#0084D1]' },
  { name: 'Youssef Karim', role: 'CTO', avatar: 'YK', initials: 'YK', color: 'from-cyan-500 to-blue-600' },
  { name: 'Nadia Tazi', role: 'Community Lead', avatar: 'NT', initials: 'NT', color: 'from-emerald-500 to-teal-600' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
      <HomeNavbar />
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-[#FFB900] to-[#0084D1] bg-clip-text text-transparent">
                NAJAH
              </span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
              We are on a mission to make quality education accessible to every student.
            </p>
          </div>

          {/* Story */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                NAJAH was founded with a simple vision: connect students with expert instructors
                through a modern, accessible platform. What started as a small pilot program has
                grown into a thriving community of learners and educators.
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Today, we serve over 500 students across 100+ formations, helping them gain the
                skills they need to succeed in their careers.
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFB900]/20 via-[#0084D1]/10 to-transparent rounded-3xl blur-3xl" />
              <div className="relative w-full aspect-[4/3] rounded-3xl bg-white border border-gray-200 dark:border-gray-700 flex items-center justify-center p-8 shadow-sm">
                <img
                  src="/img/najah.png"
                  alt="NAJAH logo"
                  className="w-64 sm:w-72 lg:w-80 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-24">
            <div className="p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                To provide every student with access to high-quality, instructor-led training
                that bridges the gap between academic knowledge and industry skills.
              </p>
            </div>
            <div className="p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                A world where anyone, anywhere, can learn from the best instructors and build
                the career they dream of.
              </p>
            </div>
          </div>

          {/* Team */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 text-center hover:shadow-lg transition-shadow">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-lg mx-auto mb-4`}>
                    {member.initials}
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-400">{member.role}</p>
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
