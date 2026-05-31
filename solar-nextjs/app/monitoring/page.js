import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LiveDashboard from '../../components/LiveDashboard';
import CustomCursor from '../../components/CustomCursor';
import ThemeInit from '../../components/ThemeInit';

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
