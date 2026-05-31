import * as Icons from 'lucide-react';

export default function DynamicIcon({ name, ...props }) {
  if (!name) return null;
  // Convert kebab-case to PascalCase
  const pascalName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  const IconComponent = Icons[pascalName] || Icons.HelpCircle;
  return <IconComponent {...props} />;
}
