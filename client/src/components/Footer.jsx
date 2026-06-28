import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const footerSections = [
  {
    titleKey: 'footer.product',
    links: [
      { labelKey: 'nav.formations', to: '#formations', scroll: true },
      { labelKey: 'nav.instructors', to: '#instructors', scroll: true },
      { labelKey: 'nav.howItWorks', to: '#how-it-works', scroll: true },
      { labelKey: 'footer.pricing', to: '/pricing' },
    ],
  },
  {
    titleKey: 'footer.company',
    links: [
      { labelKey: 'footer.aboutUs', to: '/about' },
      { labelKey: 'nav.contact', to: '/contact' },
      { labelKey: 'footer.blog', to: '/blog' },
      { labelKey: 'footer.careers', to: '/careers' },
    ],
  },
  {
    titleKey: 'footer.support',
    links: [
      { labelKey: 'footer.helpCenter', to: '/help' },
      { labelKey: 'footer.faq', to: '/faq' },
      { labelKey: 'footer.terms', to: '/terms' },
      { labelKey: 'footer.privacy', to: '/privacy' },
    ],
  },
];

const socialLinks = [
  { icon: FiGithub, href: 'https://github.com/najah' },
  { icon: FiTwitter, href: 'https://twitter.com/najah' },
  { icon: FiLinkedin, href: 'https://linkedin.com/company/najah' },
];

const Footer = memo(function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
           {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/img/najah-circle-removebg-preview.png" alt="najah" className="w-8 h-8 object-contain group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#FFB900] to-[#0084D1] bg-clip-text text-transparent">
              Najah
            </span>
          </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#FFB900] flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.titleKey}>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {t(section.titleKey)}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.labelKey}>
                    {link.scroll ? (
                      <a
                        href={`/#${link.to.replace('#', '')}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const target = document.getElementById(link.to.replace('#', ''));
                          if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            window.location.href = `/#${link.to.replace('#', '')}`;
                          }
                        }}
                        className="text-sm text-gray-400 hover:text-[#FFB900] transition-colors cursor-pointer"
                      >
                        {t(link.labelKey)}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-sm text-gray-400 hover:text-[#FFB900] transition-colors"
                      >
                        {t(link.labelKey)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-gray-800 my-8" />

        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} NAJAH &mdash; {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
});

export default Footer;
