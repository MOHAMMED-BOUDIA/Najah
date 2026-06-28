import HomeNavbar from '../components/HomeNavbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  const team = [
  { name: 'Dr. Ahmed Benali', role: t('static.about.teamRoles.0'), img: 'https://i.pravatar.cc/120?img=11', color: 'from-[#FFB900] to-[#0084D1]' },
  { name: 'Sara Amrani', role: t('static.about.teamRoles.1'), img: 'https://i.pravatar.cc/120?img=5', color: 'from-[#FFB900] to-[#0084D1]' },
  { name: 'Youssef Karim', role: t('static.about.teamRoles.2'), img: 'https://i.pravatar.cc/120?img=12', color: 'from-cyan-500 to-blue-600' },
  { name: 'Nadia Tazi', role: t('static.about.teamRoles.3'), img: 'https://i.pravatar.cc/120?img=9', color: 'from-emerald-500 to-teal-600' },
];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
      <HomeNavbar />
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-[#FFB900] to-[#0084D1] bg-clip-text text-transparent">
              {t('static.about.title')}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
              {t('static.about.mission')}
            </p>
          </div>

          {/* Story */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl font-bold mb-4">{t('static.about.ourStory')}</h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                {t('static.about.storyP1')}
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {t('static.about.storyP2')}
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFB900]/20 via-[#0084D1]/10 to-transparent rounded-3xl blur-3xl" />
              <div className="relative w-full aspect-[4/3] rounded-3xl bg-white border border-gray-200 dark:border-gray-700 flex items-center justify-center p-8 shadow-sm">
                <img
                  src="/img/najah.png"
                  alt={t('static.about.logoAlt')}
                  className="w-64 sm:w-72 lg:w-80 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-24">
            <div className="p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-xl font-bold mb-3">{t('static.about.ourMission')}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {t('static.about.missionText')}
              </p>
            </div>
            <div className="p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-xl font-bold mb-3">{t('static.about.ourVision')}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {t('static.about.visionText')}
              </p>
            </div>
          </div>

          {/* Team */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-12">{t('static.about.meetTeam')}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
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
