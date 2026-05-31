import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RoofPreview from '../../components/RoofPreview';
import CustomCursor from '../../components/CustomCursor';
import ThemeInit from '../../components/ThemeInit';

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
