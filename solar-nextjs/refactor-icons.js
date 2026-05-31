const fs = require('fs');
const path = require('path');

function toPascalCase(str) {
  return str.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let iconsUsed = new Set();
  let useDynamicIcon = false;
  
  const staticRegex = /<i\s+data-lucide="([^"]+)"([^>]*)>(.*?)<\/i>/g;
  content = content.replace(staticRegex, (match, iconName, props, inner) => {
    const componentName = toPascalCase(iconName);
    iconsUsed.add(componentName);
    return `<${componentName}${props}>${inner}</${componentName}>`;
  });

  const staticSelfClosingRegex = /<i\s+data-lucide="([^"]+)"([^>]*)\/>/g;
  content = content.replace(staticSelfClosingRegex, (match, iconName, props) => {
    const componentName = toPascalCase(iconName);
    iconsUsed.add(componentName);
    return `<${componentName}${props} />`;
  });

  const dynamicRegex = /<i\s+data-lucide={([^}]+)}([^>]*)>(.*?)<\/i>/g;
  content = content.replace(dynamicRegex, (match, expression, props, inner) => {
    useDynamicIcon = true;
    return `<DynamicIcon name={${expression}}${props}>${inner}</DynamicIcon>`;
  });

  const dynamicSelfClosingRegex = /<i\s+data-lucide={([^}]+)}([^>]*)\/>/g;
  content = content.replace(dynamicSelfClosingRegex, (match, expression, props) => {
    useDynamicIcon = true;
    return `<DynamicIcon name={${expression}}${props} />`;
  });

  if (iconsUsed.size > 0 || useDynamicIcon) {
    let importStatement = '';
    if (iconsUsed.size > 0) {
      importStatement += `import { ${Array.from(iconsUsed).join(', ')} } from 'lucide-react';\n`;
    }
    if (useDynamicIcon) {
      const isApp = filePath.includes('app\\') || filePath.includes('app/');
      const isComponents = filePath.includes('components\\') || filePath.includes('components/');
      let prefix = '';
      if (isComponents) prefix = './DynamicIcon';
      else if (isApp) {
         const parts = filePath.split(/app[\\/]/)[1].split(/[\\/]/);
         prefix = '../'.repeat(parts.length) + 'components/DynamicIcon';
      }
      importStatement += `import DynamicIcon from '${prefix}';\n`;
    }

    if (content.startsWith("'use client';") || content.startsWith('"use client";')) {
      content = content.replace(/['"]use client['"];\n/, `$&${importStatement}`);
    } else {
      content = importStatement + content;
    }
  }

  content = content.replace(/if\s*\(typeof lucide !== 'undefined'\)\s*\{\s*lucide\.createIcons\(\);\s*\}/g, '');
  content = content.replace(/if\s*\(typeof lucide !== 'undefined'\)\s*lucide\.createIcons\(\);/g, '');
  content = content.replace(/lucide\.createIcons\(\{.*\}\);/g, '');
  content = content.replace(/lucide\.createIcons\(\);/g, '');
  content = content.replace(/try\s*\{\s*window\.lucide\.createIcons\(\);\s*\}\s*catch\s*\(e\)\s*\{\}/g, '');
  content = content.replace(/window\.lucide\.createIcons\(\{.*\}\);/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.js') && !fullPath.includes('DynamicIcon.js') && !fullPath.includes('LucideInit.js')) {
      processFile(fullPath);
    }
  }
}

walk('components');
walk('app');
