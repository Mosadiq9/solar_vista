import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CustomCursor from '../../components/CustomCursor';
import ThemeInit from '../../components/ThemeInit';
import Ecosystem from '../../components/Ecosystem';

export const metadata = {
  title: 'Smart Home Energy Ecosystem & EV Charging | SolarVista',
  description: 'Discover how integrating solar panels, battery storage, and an EV charger creates the ultimate smart home energy ecosystem.',
};

export default function EcosystemPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Ecosystem />
      </main>
      <Footer />
      <ThemeInit />
    </>
  );
}
