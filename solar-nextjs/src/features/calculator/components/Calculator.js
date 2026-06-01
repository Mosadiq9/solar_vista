'use client';
import { Zap, Calculator as CalculatorIcon, DollarSign, TrendingUp, Leaf, Trees, ArrowRight, MapPin, Sun } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function Calculator() {
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);
  const [error, setError] = useState(null);

  const billSliderRef = useRef(null);
  const roofSliderRef = useRef(null);
  const sunSliderRef = useRef(null);
  const annualSavingsRef = useRef(null);
  const totalSavingsRef = useRef(null);
  const co2OffsetRef = useRef(null);
  const treesEquivRef = useRef(null);
  const chartRef = useRef(null);
  const currentRateRef = useRef(0.15);
  const debounceRef = useRef(null);

  // ─── Animate a number with GSAP or instant fallback ───
  const animateNumber = useCallback((element, target, prefix, suffix) => {
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
  }, []);

  // ─── Draw the 25-year savings chart ───
  const drawChart = useCallback((annualSave) => {
    const canvas = chartRef.current;
    if (!canvas) return;
    const chartCtx = canvas.getContext('2d');
    if (!chartCtx) return;

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

    // Grid
    chartCtx.strokeStyle = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
    chartCtx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartH / 5) * i;
      chartCtx.beginPath();
      chartCtx.moveTo(padding.left, y);
      chartCtx.lineTo(w - padding.right, y);
      chartCtx.stroke();
    }

    // Zero line
    const zeroY = padding.top + chartH * (maxVal / range);
    chartCtx.strokeStyle = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)';
    chartCtx.setLineDash([5, 5]);
    chartCtx.beginPath();
    chartCtx.moveTo(padding.left, zeroY);
    chartCtx.lineTo(w - padding.right, zeroY);
    chartCtx.stroke();
    chartCtx.setLineDash([]);

    // Fill area
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

    // Line
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

    // Break-even
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

    // X labels
    chartCtx.fillStyle = textColor;
    chartCtx.font = '11px Inter';
    chartCtx.textAlign = 'center';
    for (let i = 0; i <= years; i += 5) {
      const x = padding.left + (chartW / years) * i;
      chartCtx.fillText(`Yr ${i}`, x, h - padding.bottom + 20);
    }

    // Y labels
    chartCtx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const val = maxVal - (range / 5) * i;
      const y = padding.top + (chartH / 5) * i;
      chartCtx.fillText('$' + Math.round(val / 1000) + 'k', padding.left - 10, y + 4);
    }
  }, []);

  // ─── Core calculation ───
  const calculate = useCallback(() => {
    const billSlider = billSliderRef.current;
    const roofSlider = roofSliderRef.current;
    const sunSlider = sunSliderRef.current;
    if (!billSlider || !roofSlider || !sunSlider) return;

    const bill = parseInt(billSlider.value);
    const roof = parseInt(roofSlider.value);
    const sun = parseFloat(sunSlider.value);

    const panels = Math.floor(roof / 17);
    const systemSize = panels * 0.44;
    const dailyProduction = systemSize * sun * 0.8;
    const annualProduction = dailyProduction * 365;
    const annualSave = Math.min(bill * 12 * 0.85, annualProduction * currentRateRef.current);
    const totalSave = annualSave * 25 * 1.03;
    const co2 = annualProduction * 0.0004;
    const trees = Math.round(co2 * 16.5);

    animateNumber(annualSavingsRef.current, annualSave, '$', '');
    animateNumber(totalSavingsRef.current, totalSave, '$', '');
    animateNumber(co2OffsetRef.current, co2, '', 'T');
    animateNumber(treesEquivRef.current, trees, '', '');
    drawChart(annualSave);
  }, [animateNumber, drawChart]);

  // ─── Slider styling ───
  const updateSliderBg = useCallback((slider) => {
    if (!slider) return;
    const percent = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #f59e0b 0%, #f59e0b ${percent}%, rgba(255,255,255,0.08) ${percent}%, rgba(255,255,255,0.08) 100%)`;
  }, []);

  // ─── ZIP code handler — real API call ───
  const handleZipChange = useCallback((e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setZipCode(raw);
    setError(null);

    clearTimeout(debounceRef.current);

    if (raw.length === 5) {
      setLoading(true);
      setLocationInfo(null);

      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/solar-estimate?zip=${raw}`);
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || 'Failed to look up ZIP code');
          }

          // Update rate
          currentRateRef.current = data.electricity_rate;

          // Auto-set sun hours slider
          if (sunSliderRef.current && data.avg_sun_hours) {
            sunSliderRef.current.value = data.avg_sun_hours;
            updateSliderBg(sunSliderRef.current);
          }

          setLocationInfo(data);
          setLoading(false);
          calculate();
        } catch (err) {
          // Fallback to mock logic
          const firstDigit = parseInt(raw[0]) || 0;
          let mockRate = 0.15;
          if (firstDigit === 9) mockRate = 0.28;
          else if (firstDigit === 1) mockRate = 0.22;
          else if (firstDigit === 7) mockRate = 0.12;
          else if (firstDigit === 3) mockRate = 0.13;
          else if (firstDigit > 5) mockRate = 0.18;
          currentRateRef.current = mockRate;

          setError(err.message);
          setLocationInfo(null);
          setLoading(false);
          calculate();
        }
      }, 400);
    } else if (raw.length === 0) {
      currentRateRef.current = 0.15;
      setLocationInfo(null);
      calculate();
    }
  }, [calculate, updateSliderBg]);

  // ─── Init ───
  useEffect(() => {
    const sliders = [billSliderRef.current, roofSliderRef.current, sunSliderRef.current];
    sliders.forEach(s => updateSliderBg(s));
    calculate();

    const onResize = () => calculate();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [calculate, updateSliderBg]);

  const handleSliderInput = useCallback((ref) => (e) => {
    updateSliderBg(ref.current);
    calculate();
  }, [calculate, updateSliderBg]);

  return (
    <section id="calculator" className="calculator-section" aria-label="Solar savings calculator">
      <div className="container">
        <div className="section-header" data-animate>
          <span className="section-badge"><CalculatorIcon></CalculatorIcon> Savings Estimator</span>
          <h2>Calculate Your <span>Solar Savings</span></h2>
          <p className="section-subtitle">Use our interactive calculator to estimate how much you could save by switching to solar. Enter your ZIP code for location-specific estimates powered by NREL data.</p>
        </div>

        <div className="calculator-card glass-card" data-animate>
          <div className="calc-body">
            <div className="calc-inputs">
              {/* ZIP Code Input */}
              <div className="calc-slider-group">
                <label htmlFor="zip-code">Your Zip Code</label>
                <input
                  id="zip-code"
                  type="text"
                  placeholder="e.g. 94086"
                  maxLength="5"
                  pattern="[0-9]*"
                  className="zip-input"
                  aria-label="Enter zip code"
                  value={zipCode}
                  onChange={handleZipChange}
                />
                
                {/* Rate Indicator — dynamic states */}
                <div className={`rate-indicator ${loading ? 'loading' : ''} ${locationInfo ? 'revealed' : ''}`}>
                  {loading ? (
                    <>
                      <div className="zip-scanning-bar"></div>
                      <div className="scanning-text">
                        <Sun className="scanning-sun-icon" size={14} />
                        <span>Analyzing solar potential...</span>
                      </div>
                    </>
                  ) : locationInfo ? (
                    <div className="rate-result-reveal">
                      <MapPin size={14} />
                      <span>
                        {locationInfo.city}, {locationInfo.state} — ${locationInfo.electricity_rate.toFixed(2)}/kWh — {locationInfo.avg_sun_hours} sun hrs/day
                      </span>
                      {locationInfo.source === 'nrel_pvwatts' && (
                        <span className="nrel-badge">NREL Data</span>
                      )}
                    </div>
                  ) : error ? (
                    <div className="rate-error">
                      <Zap size={14} />
                      <span>Using estimated rates (could not reach API)</span>
                    </div>
                  ) : (
                    <span>Using national average: $0.15/kWh</span>
                  )}
                </div>
              </div>

              {/* Bill Slider */}
              <div className="calc-slider-group">
                <label htmlFor="bill-slider">Monthly Electricity Bill</label>
                <div className="slider-value">$<span id="bill-value">150</span></div>
                <input
                  id="bill-slider"
                  ref={billSliderRef}
                  type="range"
                  min="50" max="500" defaultValue="150" step="10"
                  aria-label="Monthly electricity bill amount"
                  onInput={handleSliderInput(billSliderRef)}
                />
              </div>

              {/* Roof Slider */}
              <div className="calc-slider-group">
                <label htmlFor="roof-slider">Roof Size (sq ft)</label>
                <div className="slider-value"><span id="roof-value">1500</span> sq ft</div>
                <input
                  id="roof-slider"
                  ref={roofSliderRef}
                  type="range"
                  min="500" max="5000" defaultValue="1500" step="100"
                  aria-label="Roof size in square feet"
                  onInput={handleSliderInput(roofSliderRef)}
                />
              </div>

              {/* Sun Hours Slider */}
              <div className="calc-slider-group">
                <label htmlFor="sun-slider">Average Sun Hours</label>
                <div className="slider-value"><span id="sun-value">5</span> hours/day</div>
                <input
                  id="sun-slider"
                  ref={sunSliderRef}
                  type="range"
                  min="3" max="8" defaultValue="5" step="0.5"
                  aria-label="Average daily sun hours"
                  onInput={(e) => {
                    updateSliderBg(sunSliderRef.current);
                    document.getElementById('sun-value').textContent = sunSliderRef.current.value;
                    calculate();
                  }}
                />
              </div>
            </div>

            <div className="calc-results">
              <div className="result-card">
                <div className="result-icon"><DollarSign></DollarSign></div>
                <div className="result-number" ref={annualSavingsRef}>$2,160</div>
                <div className="result-label">Annual Savings</div>
              </div>
              <div className="result-card">
                <div className="result-icon"><TrendingUp></TrendingUp></div>
                <div className="result-number" ref={totalSavingsRef}>$54,000</div>
                <div className="result-label">25-Year Savings</div>
              </div>
              <div className="result-card">
                <div className="result-icon"><Leaf></Leaf></div>
                <div className="result-number" ref={co2OffsetRef}>4.2T</div>
                <div className="result-label">CO₂ Offset/Year</div>
              </div>
              <div className="result-card">
                <div className="result-icon"><Trees></Trees></div>
                <div className="result-number" ref={treesEquivRef}>68</div>
                <div className="result-label">Trees Equivalent</div>
              </div>
            </div>

            <div className="calc-chart">
              <canvas id="savings-chart" ref={chartRef} aria-label="Savings projection chart" style={{ width: '100%', minHeight: '250px', display: 'block' }}></canvas>
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
