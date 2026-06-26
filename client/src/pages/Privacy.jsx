import HomeNavbar from '../components/HomeNavbar';
import Footer from '../components/Footer';

const sections = [
  {
    title: 'Information We Collect',
    content: 'When you create an account, we collect your name, email address, and profile information. We also collect data about your usage of the platform, including courses viewed, progress, and interactions with instructors and other students.',
  },
  {
    title: 'How We Use Your Information',
    content: 'Your information is used to provide and improve the NAJAH platform, personalize your learning experience, communicate with you about updates and new features, and ensure the security and integrity of our services.',
  },
  {
    title: 'Data Sharing',
    content: 'We do not sell your personal data to third parties. We may share data with instructors only as necessary for your educational experience (e.g., your name and progress in their formation). We may share anonymized, aggregated data for analytical purposes.',
  },
  {
    title: 'Data Security',
    content: 'We implement industry-standard security measures, including encryption in transit and at rest, to protect your personal information. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: 'Your Rights',
    content: 'You have the right to access, correct, or delete your personal data at any time through your account settings. You may also contact us to request a copy of your data or to close your account permanently.',
  },
  {
    title: 'Cookies',
    content: 'We use essential cookies for authentication and platform functionality. We may also use analytics cookies to understand how the platform is used. You can control cookie preferences through your browser settings.',
  },
  {
    title: 'Contact',
    content: 'If you have any questions about this Privacy Policy, please contact us at privacy@najah-platform.com.',
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
      <HomeNavbar />
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
              Privacy{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Policy
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
