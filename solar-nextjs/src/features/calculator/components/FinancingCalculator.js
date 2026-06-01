'use client';
import { useState, useEffect } from 'react';
import { DollarSign, Percent, Calendar, Check, AlertCircle } from 'lucide-react';

export default function FinancingCalculator() {
  const [systemCost, setSystemCost] = useState(25000);
  const [electricBill, setElectricBill] = useState(200);
  const [loanTerm, setLoanTerm] = useState(15);
  const [interestRate, setInterestRate] = useState(6.5);
  const [utilityInflation, setUtilityInflation] = useState(4); // 4% annual increase in utility rates

  // Results
  const [results, setResults] = useState({
    utility: { total25Yr: 0 },
    cash: { upfront: 0, itc: 0, total25Yr: 0, paybackYears: 0 },
    loan: { upfront: 0, monthlyPayment: 0, total25Yr: 0, totalInterest: 0 },
    lease: { upfront: 0, monthlyPayment: 0, total25Yr: 0 }
  });

  useEffect(() => {
    // Utility Status Quo Math
    let currentAnnualUtility = electricBill * 12;
    let utility25Yr = 0;
    for (let i = 0; i < 25; i++) {
      utility25Yr += currentAnnualUtility * Math.pow(1 + utilityInflation / 100, i);
    }

    // Cash Math
    const itcAmount = systemCost * 0.30;
    const cashNetCost = systemCost - itcAmount;
    // Payback period
    let cumulativeSavings = 0;
    let paybackYears = 25;
    for (let i = 1; i <= 25; i++) {
      cumulativeSavings += (electricBill * 12) * Math.pow(1 + utilityInflation / 100, i - 1);
      if (cumulativeSavings >= cashNetCost && paybackYears === 25) {
        paybackYears = i;
      }
    }
    const cashTotal25Yr = cashNetCost; // Only paying the net cost once

    // Loan Math (Assuming 0 down, 30% ITC applied to principal after month 18 as standard in solar loans, 
    // but for simplicity we'll just calculate a standard amortized loan on the full amount, 
    // and assume the user pays the ITC lump sum towards the principal at month 18 to keep the payment the same).
    // Let's do a simple amortization on the net cost to simulate the "Target Payment".
    const monthlyRate = (interestRate / 100) / 12;
    const numPayments = loanTerm * 12;
    const loanMonthly = cashNetCost * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalLoanCost = loanMonthly * numPayments;
    const loanTotal25Yr = totalLoanCost; // No utility bill

    // Lease Math (Assume 20% discount on current utility bill, with a 2.9% annual escalator)
    const initialLeasePayment = electricBill * 0.80;
    let lease25Yr = 0;
    const escalator = 2.9;
    for (let i = 0; i < 25; i++) {
      lease25Yr += (initialLeasePayment * 12) * Math.pow(1 + escalator / 100, i);
    }

    setResults({
      utility: { total25Yr: utility25Yr },
      cash: { upfront: systemCost, itc: itcAmount, netCost: cashNetCost, total25Yr: cashTotal25Yr, paybackYears },
      loan: { upfront: 0, monthlyPayment: loanMonthly, total25Yr: loanTotal25Yr, totalInterest: totalLoanCost - cashNetCost },
      lease: { upfront: 0, monthlyPayment: initialLeasePayment, total25Yr: lease25Yr }
    });
  }, [systemCost, electricBill, loanTerm, interestRate, utilityInflation]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="financing-comparator">
      <div className="fc-controls glass-card">
        <h3>Adjust Your Scenario</h3>
        
        <div className="fc-sliders-grid">
          <div className="fc-slider-group">
            <label>Gross System Cost</label>
            <div className="fc-val">{formatCurrency(systemCost)}</div>
            <input type="range" min="15000" max="60000" step="1000" value={systemCost} onChange={(e) => setSystemCost(Number(e.target.value))} />
          </div>
          
          <div className="fc-slider-group">
            <label>Current Monthly Bill</label>
            <div className="fc-val">{formatCurrency(electricBill)}</div>
            <input type="range" min="100" max="800" step="10" value={electricBill} onChange={(e) => setElectricBill(Number(e.target.value))} />
          </div>

          <div className="fc-slider-group">
            <label>Loan Term (Years)</label>
            <div className="fc-val">{loanTerm} Years</div>
            <input type="range" min="10" max="25" step="5" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} />
          </div>

          <div className="fc-slider-group">
            <label>Interest Rate (%)</label>
            <div className="fc-val">{interestRate.toFixed(2)}%</div>
            <input type="range" min="3.0" max="12.0" step="0.25" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
          </div>
        </div>

        <div className="fc-utility-context">
          <AlertCircle size={16} /> 
          <span>Without solar, you will pay <strong>{formatCurrency(results.utility.total25Yr)}</strong> to your utility company over 25 years (assuming {utilityInflation}% annual inflation).</span>
        </div>
      </div>

      <div className="fc-columns">
        {/* CASH COLUMN */}
        <div className="fc-column glass-card">
          <div className="fc-col-header">
            <h4>Cash Purchase</h4>
            <div className="fc-badge fc-badge-best">Highest ROI</div>
          </div>
          <div className="fc-metrics">
            <div className="fc-metric">
              <span className="fc-metric-label">Upfront Cost</span>
              <span className="fc-metric-val">{formatCurrency(results.cash.upfront)}</span>
            </div>
            <div className="fc-metric">
              <span className="fc-metric-label">30% Tax Credit</span>
              <span className="fc-metric-val fc-positive">-{formatCurrency(results.cash.itc)}</span>
            </div>
            <div className="fc-divider"></div>
            <div className="fc-metric fc-highlight">
              <span className="fc-metric-label">Net Cost</span>
              <span className="fc-metric-val">{formatCurrency(results.cash.netCost)}</span>
            </div>
            <div className="fc-metric">
              <span className="fc-metric-label">Payback Period</span>
              <span className="fc-metric-val">{results.cash.paybackYears} Years</span>
            </div>
          </div>
          <div className="fc-savings-box">
            <span>25-Year Net Savings</span>
            <strong>{formatCurrency(results.utility.total25Yr - results.cash.total25Yr)}</strong>
          </div>
          <ul className="fc-pros-cons">
            <li><Check size={14} className="text-success" /> Maximum financial return</li>
            <li><Check size={14} className="text-success" /> Increases home value</li>
            <li className="fc-con"><span className="text-danger">✖</span> High upfront capital required</li>
          </ul>
        </div>

        {/* LOAN COLUMN */}
        <div className="fc-column glass-card fc-column-featured">
          <div className="fc-col-header">
            <h4>Solar Loan</h4>
            <div className="fc-badge fc-badge-popular">Most Popular</div>
          </div>
          <div className="fc-metrics">
            <div className="fc-metric">
              <span className="fc-metric-label">Down Payment</span>
              <span className="fc-metric-val">$0</span>
            </div>
            <div className="fc-metric">
              <span className="fc-metric-label">Tax Credit Eligible?</span>
              <span className="fc-metric-val fc-positive">Yes (30%)</span>
            </div>
            <div className="fc-divider"></div>
            <div className="fc-metric fc-highlight">
              <span className="fc-metric-label">Monthly Payment</span>
              <span className="fc-metric-val">{formatCurrency(results.loan.monthlyPayment)} /mo</span>
            </div>
            <div className="fc-metric">
              <span className="fc-metric-label">Total Interest Paid</span>
              <span className="fc-metric-val">{formatCurrency(results.loan.totalInterest)}</span>
            </div>
          </div>
          <div className="fc-savings-box">
            <span>25-Year Net Savings</span>
            <strong>{formatCurrency(results.utility.total25Yr - results.loan.total25Yr)}</strong>
          </div>
          <ul className="fc-pros-cons">
            <li><Check size={14} className="text-success" /> $0 Down payment</li>
            <li><Check size={14} className="text-success" /> Keep the 30% Tax Credit</li>
            <li className="fc-con"><span className="text-danger">✖</span> Interest reduces overall ROI</li>
          </ul>
        </div>

        {/* LEASE COLUMN */}
        <div className="fc-column glass-card">
          <div className="fc-col-header">
            <h4>Solar Lease / PPA</h4>
            <div className="fc-badge">Easiest</div>
          </div>
          <div className="fc-metrics">
            <div className="fc-metric">
              <span className="fc-metric-label">Upfront Cost</span>
              <span className="fc-metric-val">$0</span>
            </div>
            <div className="fc-metric">
              <span className="fc-metric-label">Tax Credit Eligible?</span>
              <span className="fc-metric-val fc-negative">No (Installer keeps)</span>
            </div>
            <div className="fc-divider"></div>
            <div className="fc-metric fc-highlight">
              <span className="fc-metric-label">Starting Payment</span>
              <span className="fc-metric-val">{formatCurrency(results.lease.monthlyPayment)} /mo</span>
            </div>
            <div className="fc-metric">
              <span className="fc-metric-label">Annual Escalator</span>
              <span className="fc-metric-val">2.9%</span>
            </div>
          </div>
          <div className="fc-savings-box">
            <span>25-Year Net Savings</span>
            <strong>{formatCurrency(results.utility.total25Yr - results.lease.total25Yr)}</strong>
          </div>
          <ul className="fc-pros-cons">
            <li><Check size={14} className="text-success" /> $0 Down & Free Maintenance</li>
            <li><Check size={14} className="text-success" /> Immediate monthly savings</li>
            <li className="fc-con"><span className="text-danger">✖</span> Lowest long-term savings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
