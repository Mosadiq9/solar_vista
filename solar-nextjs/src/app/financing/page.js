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
      
      <style dangerouslySetInnerHTML={{ __html: `
        .financing-page {
          padding-top: 180px;
          padding-bottom: 80px;
        }
        .financing-header-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 24px;
        }
        .financing-header-desc {
          font-size: 1.25rem;
          color: var(--c-text2);
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }
        @media (max-width: 768px) {
          .financing-page { padding-top: 140px; }
          .financing-header-title { font-size: 2.5rem; }
        }
      `}} />
      
      <main className="financing-page">
        <div className="container">
          <div className="section-header text-center mb-16" data-animate style={{ marginBottom: '64px' }}>
            <span className="section-badge"><Banknote size={16} /> Financing Options</span>
            <h1 className="financing-header-title">Compare Your <span className="text-accent-solar">Solar Financing</span></h1>
            <p className="financing-header-desc">
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
