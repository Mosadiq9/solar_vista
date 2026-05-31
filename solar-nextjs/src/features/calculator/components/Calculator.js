'use client';
import { Zap, Calculator as CalculatorIcon, DollarSign, TrendingUp, Leaf, Trees, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function Calculator() {
  useEffect(() => {
    const billSlider = document.getElementById('bill-slider');
    const roofSlider = document.getElementById('roof-slider');
    const sunSlider = document.getElementById('sun-slider');
    const billValue = document.getElementById('bill-value');
    const roofValue = document.getElementById('roof-value');
    const sunValue = document.getElementById('sun-value');
    const annualSavings = document.getElementById('annual-savings');
    const totalSavings = document.getElementById('total-savings');
    const co2Offset = document.getElementById('co2-offset');
    const treesEquiv = document.getElementById('trees-equiv');
    const zipInput = document.getElementById('zip-code');
    const rateIndicator = document.getElementById('rate-indicator');

    let currentRateValue = 0.15;
    const savingsChart = document.getElementById('savings-chart');
    let chartCtx = savingsChart ? savingsChart.getContext('2d') : null;

    function calculate() {
      if (!billSlider || !roofSlider || !sunSlider) return;
      const bill = parseInt(billSlider.value);
      const roof = parseInt(roofSlider.value);
      const sun = parseFloat(sunSlider.value);
      billValue.textContent = bill;
      roofValue.textContent = roof.toLocaleString();
      sunValue.textContent = sun;
      const panels = Math.floor(roof / 17);
      const systemSize = panels * 0.44;
      const dailyProduction = systemSize * sun * 0.8;
      const annualProduction = dailyProduction * 365;
      const annualSave = Math.min(bill * 12 * 0.85, annualProduction * currentRateValue);
      const totalSave = annualSave * 25 * 1.03;
      const co2 = annualProduction * 0.0004;
      const trees = Math.round(co2 * 16.5);
      animateNumber(annualSavings, annualSave, '$', '');
      animateNumber(totalSavings, totalSave, '$', '');
      animateNumber(co2Offset, co2, '', 'T');
      animateNumber(treesEquiv, trees, '', '');
      drawChart(annualSave);
    }

    function animateNumber(element, target, prefix, suffix) {
      if (!element) return;
      if (typeof gsap !== 'undefined') {
        const obj = { value: parseFloat(element.textContent.replace(/[^0-9.]/g, '')) || 0 };
        gsap.to(obj, {
          value: target, duration: 0.8, ease: 'power2.out',
          onUpdate: () => {
            if (target >= 1000) element.textContent = prefix + Math.round(obj.value).toLocaleString() + suffix;
            else element.textContent = prefix + obj.value.toFixed(1) + suffix;
          }
        });
      } else {
        if (target >= 1000) element.textContent = prefix + Math.round(target).toLocaleString() + suffix;
        else element.textContent = prefix + target.toFixed(1) + suffix;
      }
    }

    function drawChart(annualSave) {
      if (!chartCtx || !savingsChart) return;
      const canvas = savingsChart;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      chartCtx.scale(dpr, dpr);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const padding = { top: 30, right: 20, bottom: 40, left: 60 };
      const chartW = w - padding.left - padding.right;
      const chartH = h - padding.top - padding.bottom;
      chartCtx.clearRect(0, 0, w, h);
      const years = 25;
      const data = [];
      let cumulative = 0;
      const installCost = annualSave * 6;
      for (let i = 0; i <= years; i++) {
        cumulative += annualSave * Math.pow(1.03, i);
        data.push(cumulative - installCost);
      }
      const maxVal = Math.max(...data);
      const minVal = Math.min(...data, 0);
      const range = maxVal - minVal || 1;
      
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      
      chartCtx.strokeStyle = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
      chartCtx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartH / 5) * i;
        chartCtx.beginPath();
        chartCtx.moveTo(padding.left, y);
        chartCtx.lineTo(w - padding.right, y);
        chartCtx.stroke();
      }
      const zeroY = padding.top + chartH * (maxVal / range);
      chartCtx.strokeStyle = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)';
      chartCtx.setLineDash([5, 5]);
      chartCtx.beginPath();
      chartCtx.moveTo(padding.left, zeroY);
      chartCtx.lineTo(w - padding.right, zeroY);
      chartCtx.stroke();
      chartCtx.setLineDash([]);
      const gradient = chartCtx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
      gradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
      gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
      chartCtx.beginPath();
      chartCtx.moveTo(padding.left, zeroY);
      for (let i = 0; i <= years; i++) {
        const x = padding.left + (chartW / years) * i;
        const y = padding.top + chartH * (1 - (data[i] - minVal) / range);
        chartCtx.lineTo(x, y);
      }
      chartCtx.lineTo(w - padding.right, zeroY);
      chartCtx.closePath();
      chartCtx.fillStyle = gradient;
      chartCtx.fill();
      chartCtx.beginPath();
      for (let i = 0; i <= years; i++) {
        const x = padding.left + (chartW / years) * i;
        const y = padding.top + chartH * (1 - (data[i] - minVal) / range);
        if (i === 0) chartCtx.moveTo(x, y);
        else chartCtx.lineTo(x, y);
      }
      chartCtx.strokeStyle = '#f59e0b';
      chartCtx.lineWidth = 2.5;
      chartCtx.stroke();
      const textColor = getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#94a3b8';
      const breakEvenYear = data.findIndex(d => d >= 0);
      if (breakEvenYear > 0) {
        const bx = padding.left + (chartW / years) * breakEvenYear;
        chartCtx.beginPath();
        chartCtx.arc(bx, zeroY, 5, 0, Math.PI * 2);
        chartCtx.fillStyle = '#10b981';
        chartCtx.fill();
        chartCtx.fillStyle = textColor;
        chartCtx.font = '11px Inter';
        chartCtx.textAlign = 'center';
        chartCtx.fillText(`Break-even: Year ${breakEvenYear}`, bx, zeroY - 15);
      }
      chartCtx.fillStyle = textColor;
      chartCtx.font = '11px Inter';
      chartCtx.textAlign = 'center';
      for (let i = 0; i <= years; i += 5) {
        const x = padding.left + (chartW / years) * i;
        chartCtx.fillText(`Yr ${i}`, x, h - padding.bottom + 20);
      }
      chartCtx.textAlign = 'right';
      for (let i = 0; i <= 5; i++) {
        const val = maxVal - (range / 5) * i;
        const y = padding.top + (chartH / 5) * i;
        chartCtx.fillText('$' + Math.round(val / 1000) + 'k', padding.left - 10, y + 4);
      }
    }

    [billSlider, roofSlider, sunSlider].forEach(slider => {
      if (slider) {
        slider.addEventListener('input', calculate);
        slider.addEventListener('input', function() {
          const percent = (this.value - this.min) / (this.max - this.min) * 100;
          this.style.background = `linear-gradient(to right, #f59e0b 0%, #f59e0b ${percent}%, rgba(255,255,255,0.08) ${percent}%, rgba(255,255,255,0.08) 100%)`;
        });
      }
    });

    if (zipInput) {
      let debounceTimer;
      zipInput.addEventListener('input', (e) => {
        const zip = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = zip;
        clearTimeout(debounceTimer);
        if (zip.length === 5) {
          if (rateIndicator) rateIndicator.innerHTML = '<i class="lucide-loader animate-spin"></i> Fetching live rates...';
          debounceTimer = setTimeout(() => {
            const firstDigit = parseInt(zip[0]) || 0;
            let mockRate = 0.15;
            let stateLabel = 'national average';
            if (firstDigit === 9) { mockRate = 0.28; stateLabel = 'CA average'; }
            else if (firstDigit === 1) { mockRate = 0.22; stateLabel = 'NY average'; }
            else if (firstDigit === 7) { mockRate = 0.12; stateLabel = 'TX average'; }
            else if (firstDigit === 3) { mockRate = 0.13; stateLabel = 'FL average'; }
            else if (firstDigit > 5) { mockRate = 0.18; stateLabel = 'regional average'; }
            currentRateValue = mockRate;
            if (rateIndicator) rateIndicator.innerHTML = `<Zap></Zap> Using ${stateLabel}: $${mockRate}/kWh`;
            if (window.lucide) window.
            calculate();
          }, 600);
        } else if (zip.length === 0) {
          currentRateValue = 0.15;
          if (rateIndicator) rateIndicator.innerHTML = 'Using national average: $0.15/kWh';
          calculate();
        }
      });
    }

    if (billSlider) {
      [billSlider, roofSlider, sunSlider].forEach(s => {
        if (s) {
          const percent = (s.value - s.min) / (s.max - s.min) * 100;
          s.style.background = `linear-gradient(to right, #f59e0b 0%, #f59e0b ${percent}%, rgba(255,255,255,0.08) ${percent}%, rgba(255,255,255,0.08) 100%)`;
        }
      });
      calculate();
      window.addEventListener('resize', calculate);
    }
  }, []);

  return (
    <section id="calculator" className="calculator-section" aria-label="Solar savings calculator">
      <div className="container">
        <div className="section-header" data-animate>
          <span className="section-badge"><CalculatorIcon></CalculatorIcon> Savings Estimator</span>
          <h2>Calculate Your <span>Solar Savings</span></h2>
          <p className="section-subtitle">Use our interactive calculator to estimate how much you could save by switching to solar. Adjust the sliders to match your situation.</p>
        </div>

        <div className="calculator-card glass-card" data-animate>
          <div className="calc-body">
            <div className="calc-inputs">
              <div className="calc-slider-group">
                <label htmlFor="zip-code">Your Zip Code (for live rates)</label>
                <input id="zip-code" type="text" placeholder="e.g. 94086" maxLength="5" pattern="[0-9]*" className="zip-input" aria-label="Enter zip code" />
                <div id="rate-indicator" className="rate-indicator">Using national average: $0.15/kWh</div>
              </div>
              <div className="calc-slider-group">
                <label htmlFor="bill-slider">Monthly Electricity Bill</label>
                <div className="slider-value">$<span id="bill-value">150</span></div>
                <input id="bill-slider" type="range" min="50" max="500" defaultValue="150" step="10" aria-label="Monthly electricity bill amount" />
              </div>
              <div className="calc-slider-group">
                <label htmlFor="roof-slider">Roof Size (sq ft)</label>
                <div className="slider-value"><span id="roof-value">1500</span> sq ft</div>
                <input id="roof-slider" type="range" min="500" max="5000" defaultValue="1500" step="100" aria-label="Roof size in square feet" />
              </div>
              <div className="calc-slider-group">
                <label htmlFor="sun-slider">Average Sun Hours</label>
                <div className="slider-value"><span id="sun-value">5</span> hours/day</div>
                <input id="sun-slider" type="range" min="3" max="8" defaultValue="5" step="0.5" aria-label="Average daily sun hours" />
              </div>
            </div>

            <div className="calc-results">
              <div className="result-card">
                <div className="result-icon"><DollarSign></DollarSign></div>
                <div className="result-number" id="annual-savings">$2,160</div>
                <div className="result-label">Annual Savings</div>
              </div>
              <div className="result-card">
                <div className="result-icon"><TrendingUp></TrendingUp></div>
                <div className="result-number" id="total-savings">$54,000</div>
                <div className="result-label">25-Year Savings</div>
              </div>
              <div className="result-card">
                <div className="result-icon"><Leaf></Leaf></div>
                <div className="result-number" id="co2-offset">4.2T</div>
                <div className="result-label">CO₂ Offset/Year</div>
              </div>
              <div className="result-card">
                <div className="result-icon"><Trees></Trees></div>
                <div className="result-number" id="trees-equiv">68</div>
                <div className="result-label">Trees Equivalent</div>
              </div>
            </div>

            <div className="calc-chart">
              <canvas id="savings-chart" aria-label="Savings projection chart"></canvas>
            </div>
          </div>

          <div className="calc-cta">
            <a href="#contact" className="btn btn-primary btn-large">
              Get Your Detailed Quote <ArrowRight></ArrowRight>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
