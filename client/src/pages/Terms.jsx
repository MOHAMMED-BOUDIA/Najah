import HomeNavbar from '../components/HomeNavbar';
import Footer from '../components/Footer';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using NAJAH, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform. We reserve the right to update these terms at any time, and continued use constitutes acceptance of changes.',
  },
  {
    title: '2. Account Registration',
    content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. You must be at least 16 years old to use the platform.',
  },
  {
    title: '3. User Conduct',
    content: 'Users agree to use the platform respectfully and lawfully. Harassment, impersonation, sharing harmful content, or violating any applicable laws is strictly prohibited. We reserve the right to suspend or terminate accounts that violate these rules.',
  },
  {
    title: '4. Intellectual Property',
    content: 'All content provided through NAJAH, including course materials, videos, and assessments, is the intellectual property of NAJAH or its instructors. Users may not reproduce, distribute, or create derivative works without explicit permission.',
  },
  {
    title: '5. Instructor Responsibilities',
    content: 'Instructors are responsible for the accuracy and quality of their content. They agree to maintain professional standards and respond to student inquiries in a timely manner. NAJAH reserves the right to remove content that violates platform policies.',
  },
  {
    title: '6. Limitation of Liability',
    content: 'NAJAH is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use or inability to use the platform, including but not limited to direct, indirect, incidental, or consequential damages.',
  },
  {
    title: '7. Termination',
    content: 'We reserve the right to suspend or terminate accounts at our discretion, particularly in cases of policy violations. Users may delete their accounts at any time through their profile settings.',
  },
  {
    title: '8. Contact',
    content: 'For questions about these terms, please contact us at contact@najah-platform.com.',
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
      <HomeNavbar />
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
              Terms of{' '}
              <span className="bg-gradient-to-r from-[#FFB900] to-[#0084D1] bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-sm text-gray-400">Last updated: June 2026</p>
          </div>

          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-xl font-bold mb-3">{s.title}</h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
