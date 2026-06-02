const fs = require('fs');
const path = require('path');

const filesToRefactor = [
  'src/features/products/components/RoofPreview.js',
  'src/features/calculator/components/IncentivesLookup.js',
  'src/features/booking/components/BookingCalendar.js',
  'src/features/products/components/Ecosystem.js',
  'src/features/dashboard/components/LiveDashboard.js',
  'src/app/login/page.js',
  'src/app/portal/page.js'
];

const replacements = [
  // Backgrounds and Texts
  { search: /#09090b/g, replace: 'var(--bg-primary)' },
  { search: /#f8fafc/g, replace: 'var(--text-primary)' },
  { search: /color:\s*#fff/g, replace: 'color: var(--text-primary)' },
  { search: /color:\s*#94a3b8/g, replace: 'color: var(--text-secondary)' },
  { search: /color:\s*#64748b/g, replace: 'color: var(--text-muted)' },
  
  // Specific to Login
  { search: /color: #fff/g, replace: 'color: var(--text-primary)' },
  { search: /#0f172a/g, replace: 'var(--bg-secondary)' },
  
  // Glass backgrounds
  { search: /background:\s*rgba\(255,\s*255,\s*255,\s*0\.0[2358]\)/g, replace: 'background: var(--glass-bg)' },
  { search: /background:\s*rgba\(255,255,255,0\.0[2358]\)/g, replace: 'background: var(--glass-bg)' },
  
  // Glass Borders
  { search: /border:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.05\)/g, replace: 'border: 1px solid var(--glass-border)' },
  { search: /border:\s*1px\s*solid\s*rgba\(255,255,255,0\.05\)/g, replace: 'border: 1px solid var(--glass-border)' },
  { search: /border:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.1\)/g, replace: 'border: 1px solid var(--glass-border)' },
  { search: /border:\s*1px\s*solid\s*rgba\(255,255,255,0\.1\)/g, replace: 'border: 1px solid var(--glass-border)' },
  
  // Darker container backgrounds
  { search: /rgba\(0,0,0,0\.2\)/g, replace: 'var(--bg-tertiary)' },
  { search: /rgba\(0,\s*0,\s*0,\s*0\.2\)/g, replace: 'var(--bg-tertiary)' },
  
  // Navbar/HUD backgrounds
  { search: /rgba\(15,23,42,0\.85\)/g, replace: 'var(--nav-bg)' },
  { search: /rgba\(15,\s*23,\s*42,\s*0\.85\)/g, replace: 'var(--nav-bg)' },
  
  // Specific Theme Accents
  { search: /#38bdf8/g, replace: 'var(--accent-cyan)' },
  { search: /#0ea5e9/g, replace: 'var(--accent-blue)' },
  { search: /#10b981/g, replace: 'var(--accent-green)' },
  { search: /#059669/g, replace: 'var(--accent-green)' },
  { search: /#fbbf24/g, replace: 'var(--accent-glow)' },
  { search: /#f59e0b/g, replace: 'var(--accent-solar)' },
  { search: /#a855f7/g, replace: 'var(--accent-purple)' },
  { search: /#9333ea/g, replace: 'var(--accent-purple)' }
];

filesToRefactor.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found.`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  replacements.forEach(({ search, replace }) => {
    content = content.replace(search, replace);
  });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Refactored ${file}`);
});
