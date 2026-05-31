import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import CustomCursor from '@/shared/components/CustomCursor';
import ThemeInit from '@/shared/components/ThemeInit';
import Ecosystem from '@/features/products/components/Ecosystem';

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
