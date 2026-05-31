import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import LiveDashboard from '@/features/dashboard/components/LiveDashboard';
import CustomCursor from '@/shared/components/CustomCursor';
import ThemeInit from '@/shared/components/ThemeInit';

export const metadata = {
  title: 'Live Energy Monitoring | SolarVista',
  description: 'View real-time solar generation, home usage, and battery storage metrics.',
};

export default function MonitoringPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <LiveDashboard />
      </main>
      <Footer />
      <ThemeInit />
    </>
  );
}
