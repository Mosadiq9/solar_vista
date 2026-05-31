import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CustomCursor from '../../components/CustomCursor';
import ThemeInit from '../../components/ThemeInit';
import IncentivesLookup from '../../components/IncentivesLookup';

export const metadata = {
  title: 'Solar Incentives & Rebates Calculator | SolarVista',
  description: 'Enter your ZIP code to instantly discover thousands of dollars in hidden federal, state, and local utility incentives for your solar installation.',
};

export default function IncentivesPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <IncentivesLookup />
      </main>
      <Footer />
      <ThemeInit />
    </>
  );
}
