import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import RoofPreview from '@/features/products/components/RoofPreview';
import CustomCursor from '@/shared/components/CustomCursor';
import ThemeInit from '@/shared/components/ThemeInit';

export const metadata = {
  title: 'AI Roof Analysis | SolarVista',
  description: 'Instantly visualize solar panels on your roof and calculate your estimated savings using our AI-powered analysis tool.',
};

export default function RoofPreviewPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <RoofPreview />
      </main>
      <Footer />
      <ThemeInit />
    </>
  );
}
