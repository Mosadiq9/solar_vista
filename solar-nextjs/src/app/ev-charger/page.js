import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import CustomCursor from '@/shared/components/CustomCursor';
import ThemeInit from '@/shared/components/ThemeInit';
import EVCharger from '@/features/products/components/EVCharger';

export const metadata = {
  title: 'Level 2 EV Charger | SolarVista',
  description: 'Fuel your electric vehicle with sunshine. Bypass the gas station and charge your EV up to 9x faster with SolarVista\'s Level 2 smart EV charger.',
};

export default function EVChargerPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <EVCharger />
      </main>
      <Footer />
      <ThemeInit />
    </>
  );
}
