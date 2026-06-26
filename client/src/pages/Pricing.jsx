import { Link } from 'react-router-dom';
import HomeNavbar from '../components/HomeNavbar';
import Footer from '../components/Footer';
import { HiCheck } from 'react-icons/hi';

const plans = [
  {
    name: 'Free',
    price: '0',
    desc: 'Get started with basic access to formations and community.',
    features: ['Access to 5 sample formations', 'Join public study groups', 'Basic progress tracking', 'Community forum access'],
    cta: 'Start Free',
    to: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '199',
    desc: 'Unlock the full NAJAH experience for serious learners.',
    features: ['Unlimited formations', 'Direct instructor access', 'Live meeting attendance', 'Group chat & collaboration', 'Certificate on completion', 'Priority support'],
    cta: 'Go Pro',
    to: '/register',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '999',
    desc: 'For organizations and institutions with custom needs.',
    features: ['All Pro features', 'Custom formation creation', 'Dedicated account manager', 'API access', 'Bulk student enrollment', 'Analytics & reports', 'SLA support'],
    cta: 'Contact Sales',
    to: '/contact',
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
      <HomeNavbar />
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
              Simple,{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Transparent
              </span>{' '}
              Pricing
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-800/50 text-sm font-medium text-emerald-600 dark:text-emerald-400 mx-auto block w-fit mb-14">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            100% Free for Students
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-3xl border transition-shadow hover:shadow-xl ${
                  plan.highlight
                    ? 'border-indigo-500/50 dark:border-indigo-500/50 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/30 dark:to-gray-950 shadow-lg shadow-indigo-500/10'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400 text-sm">DH/{plan.name === 'Enterprise' ? 'custom' : 'month'}</span>
                  </div>
                  <p className="text-sm text-gray-400">{plan.desc}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <HiCheck className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.to}
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500'
                      : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
