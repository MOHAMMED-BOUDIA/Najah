import { useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HomeNavbar from '../components/HomeNavbar';
import AnimatedBackground from '../components/home/AnimatedBackground';
import HeroSection from '../components/home/HeroSection';
import FeaturesBento from '../components/home/FeaturesBento';
import InstructorsSection from '../components/home/InstructorsSection';

const StatsCounter = lazy(() => import('../components/home/StatsCounter'));
const HowItWorksTimeline = lazy(() => import('../components/home/HowItWorksTimeline'));
const TestimonialsMarquee = lazy(() => import('../components/home/TestimonialsMarquee'));
const CTASection = lazy(() => import('../components/home/CTASection'));
const Footer = lazy(() => import('../components/Footer'));

function SectionFallback() {
  return <div className="h-64" />;
}

export default function Home() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user) {
      const roleHome =
        user.role === 'admin'
          ? '/admin/dashboard'
          : user.role === 'instructor'
            ? '/dashboard'
            : '/instructors';
      navigate(roleHome, { replace: true });
    }
  }, [token, user, navigate]);

  if (token && user) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
      <AnimatedBackground />
      <HomeNavbar />
      <HeroSection />
      <FeaturesBento />
      <InstructorsSection />
      <Suspense fallback={<SectionFallback />}>
        <StatsCounter />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <HowItWorksTimeline />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TestimonialsMarquee />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CTASection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
    </div>
  );
}
