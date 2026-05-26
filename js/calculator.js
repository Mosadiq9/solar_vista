(function() {
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
  
  // Base national average is 15 cents/kWh
  let currentRateMultiplier = 1.0;
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
    const systemSize = panels * 0.44; // kW
    
    const dailyProduction = systemSize * sun * 0.8;
    const annualProduction = dailyProduction * 365;
    
    // Instead of fixed 0.15, we use the dynamically fetched currentRateValue
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
        value: target,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: () => {
          if (target >= 1000) {
            element.textContent = prefix + Math.round(obj.value).toLocaleString() + suffix;
          } else {
            element.textContent = prefix + obj.value.toFixed(1) + suffix;
          }
        }
      });
    } else {
      if (target >= 1000) {
        element.textContent = prefix + Math.round(target).toLocaleString() + suffix;
      } else {
        element.textContent = prefix + target.toFixed(1) + suffix;
      }
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
    
    chartCtx.strokeStyle = 'rgba(255,255,255,0.06)';
    chartCtx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartH / 5) * i;
      chartCtx.beginPath();
      chartCtx.moveTo(padding.left, y);
      chartCtx.lineTo(w - padding.right, y);
      chartCtx.stroke();
    }
    
    const zeroY = padding.top + chartH * (maxVal / range);
    chartCtx.strokeStyle = 'rgba(255,255,255,0.15)';
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
    
    const breakEvenYear = data.findIndex(d => d >= 0);
    if (breakEvenYear > 0) {
      const bx = padding.left + (chartW / years) * breakEvenYear;
      chartCtx.beginPath();
      chartCtx.arc(bx, zeroY, 5, 0, Math.PI * 2);
      chartCtx.fillStyle = '#10b981';
      chartCtx.fill();
      chartCtx.fillStyle = 'rgba(255,255,255,0.7)';
      chartCtx.font = '11px Inter';
      chartCtx.textAlign = 'center';
      chartCtx.fillText(`Break-even: Year ${breakEvenYear}`, bx, zeroY - 15);
    }
    
    chartCtx.fillStyle = 'rgba(255,255,255,0.4)';
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

  // Mock API for Zip Code Rates
  if (zipInput) {
    let debounceTimer;
    zipInput.addEventListener('input', (e) => {
      const zip = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = zip;
      
      clearTimeout(debounceTimer);
      if (zip.length === 5) {
        if (rateIndicator) rateIndicator.innerHTML = '<i class="lucide-loader animate-spin"></i> Fetching live rates...';
        
        debounceTimer = setTimeout(() => {
          // In production, this would be: await fetch(`https://developer.nrel.gov/api/utility_rates/v3.json?api_key=YOUR_KEY&address=${zip}`)
          // We simulate API variance based on the first digit of the zip code
          const firstDigit = parseInt(zip[0]) || 0;
          let mockRate = 0.15; // default 15c
          let stateLabel = 'national average';
          
          if (firstDigit === 9) { mockRate = 0.28; stateLabel = 'CA average'; } // California is expensive
          else if (firstDigit === 1) { mockRate = 0.22; stateLabel = 'NY average'; }
          else if (firstDigit === 7) { mockRate = 0.12; stateLabel = 'TX average'; }
          else if (firstDigit === 3) { mockRate = 0.13; stateLabel = 'FL average'; }
          else if (firstDigit > 5) { mockRate = 0.18; stateLabel = 'regional average'; }
          
          currentRateValue = mockRate;
          if (rateIndicator) rateIndicator.innerHTML = `<i data-lucide="zap"></i> Using ${stateLabel}: $${mockRate}/kWh`;
          if (window.lucide) window.lucide.createIcons({ root: rateIndicator.parentElement });
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
})();
