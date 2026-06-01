import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import Preloader from '@/shared/components/Preloader';
import FinancingCalculator from '@/features/calculator/components/FinancingCalculator';
import FinancingFaq from '@/features/calculator/components/FinancingFaq';
import { Banknote } from 'lucide-react';
export const metadata = {
  title: 'Compare Solar Financing Options | SolarVista',
  description: 'Compare Cash Purchase, Solar Loans, and Solar Leases/PPAs to find the best way to finance your solar panel system.',
};

export default function FinancingPage() {
  return (
    <>
      <Preloader />
      <Navbar />
      
      <main className="financing-page pt-32 pb-24">
        <div className="container">
          <div className="section-header text-center mb-16" data-animate>
            <span className="section-badge"><Banknote size={16} /> Financing Options</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Compare Your <span className="text-accent-solar">Solar Financing</span></h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Going solar is one of the best financial decisions you can make, but how you pay for it matters. 
              Use our interactive tool below to compare the three most common ways to go solar over a 25-year lifespan.
            </p>
          </div>

          <div data-animate>
            <FinancingCalculator />
          </div>

          {/* Educational Content Below */}
          <FinancingFaq />
        </div>
      </main>

      <Footer />
    </>
  );
}
