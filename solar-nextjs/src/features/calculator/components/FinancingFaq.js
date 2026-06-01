'use client';
import { useState } from 'react';
import { DollarSign, Percent, Banknote, HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is the 30% Federal Tax Credit (ITC)?",
    answer: "The Investment Tax Credit (ITC) allows you to deduct 30% of the cost of installing a solar energy system from your federal taxes. This applies to both Cash Purchases and Solar Loans. If you choose a Solar Lease/PPA, the solar company claims the credit instead.",
    icon: <DollarSign size={20} />
  },
  {
    question: "How do solar loans work?",
    answer: "Solar loans usually require $0 down. Your installer connects you with a lending partner. Typically, loans are structured assuming you will apply the 30% tax credit to the loan principal around month 18 to keep your monthly payments low.",
    icon: <Percent size={20} />
  },
  {
    question: "What is a Solar Lease or PPA?",
    answer: "With a lease or Power Purchase Agreement (PPA), a third party owns the solar panels on your roof. You simply agree to buy the power they produce at a locked-in rate that is usually much lower than your utility company's rate.",
    icon: <Banknote size={20} />
  },
  {
    question: "Which option is best for me?",
    answer: "If you have the capital and tax liability, a Cash Purchase yields the highest ROI. If you want to own the system but want $0 down, a Solar Loan is best. If you have no tax liability or just want the easiest path, a Lease/PPA is great.",
    icon: <HelpCircle size={20} />
  }
];

export default function FinancingFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .financing-faq-wrapper {
          margin-top: 96px;
          max-width: 896px;
          margin-left: auto;
          margin-right: auto;
        }
        .faq-header-text {
          text-align: center;
          margin-bottom: 48px;
        }
        .faq-header-text h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .faq-header-text p {
          color: var(--c-text2);
          font-size: 1.125rem;
        }
        .faq-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .faq-item-card {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: 16px;
          transition: all 0.3s ease;
          overflow: hidden;
          cursor: pointer;
        }
        .faq-item-card:hover {
          background: rgba(255,255,255,0.02);
        }
        .faq-item-card.is-open {
          border-color: rgba(245, 158, 11, 0.5);
          background: var(--c-surface-hover);
          box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.2);
        }
        .faq-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
        }
        .faq-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .faq-icon-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.1);
          color: var(--c-primary);
          transition: all 0.3s ease;
        }
        .is-open .faq-icon-circle {
          background: var(--c-primary);
          color: var(--c-bg);
        }
        .faq-question-text {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--c-text1);
          transition: color 0.3s ease;
          margin: 0;
        }
        .is-open .faq-question-text {
          color: var(--c-primary);
        }
        .faq-chevron {
          color: var(--c-text2);
          transition: transform 0.3s ease;
        }
        .is-open .faq-chevron {
          transform: rotate(180deg);
          color: var(--c-primary);
        }
        .faq-content-box {
          transition: all 0.4s ease-in-out;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          padding: 0 24px 0 80px;
        }
        .is-open .faq-content-box {
          max-height: 300px;
          opacity: 1;
          padding-bottom: 24px;
        }
        .faq-content-box p {
          color: var(--c-text2);
          line-height: 1.6;
          margin: 0;
        }
      `}} />
      
      <div className="financing-faq-wrapper" data-animate>
        <div className="faq-header-text">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about paying for your solar system.</p>
        </div>
        
        <div className="faq-accordion-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`faq-item-card ${isOpen ? 'is-open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-header-bar">
                  <div className="faq-header-left">
                    <div className="faq-icon-circle">
                      {faq.icon}
                    </div>
                    <h3 className="faq-question-text">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="faq-chevron">
                    <ChevronDown size={24} />
                  </div>
                </div>
                
                <div className="faq-content-box">
                  <p>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
