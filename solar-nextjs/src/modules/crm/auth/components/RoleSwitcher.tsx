'use client';

import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '../types';
import { ShieldAlert, Shield, ShieldCheck, HardHat, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const ROLE_OPTIONS: { role: UserRole; label: string; icon: any; color: string }[] = [
  { role: 'super_admin', label: 'Super Admin', icon: ShieldAlert, color: 'text-purple-400' },
  { role: 'sales', label: 'Sales Rep', icon: Shield, color: 'text-blue-400' },
  { role: 'logistics', label: 'Logistics', icon: ShieldCheck, color: 'text-orange-400' },
  { role: 'installer', label: 'Installer', icon: HardHat, color: 'text-green-400' },
];

export function RoleSwitcher() {
  const { currentUser, setRole } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const currentOption = ROLE_OPTIONS.find(o => o.role === currentUser.role) || ROLE_OPTIONS[0];
  const Icon = currentOption.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/[0.05] transition-colors"
      >
        <span className="text-white/40">Viewing as:</span>
        <Icon className={cn("h-3.5 w-3.5", currentOption.color)} />
        <span className="text-white/90">{currentOption.label}</span>
        <ChevronDown className="h-3 w-3 text-white/40 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 rounded-xl border border-white/10 bg-[#1a1b1e] p-1 shadow-xl z-50">
          <div className="px-2 py-1.5 text-2xs font-semibold text-white/40 uppercase tracking-wider mb-1">
            Simulate Role
          </div>
          {ROLE_OPTIONS.map((option) => {
            const OptIcon = option.icon;
            const isSelected = option.role === currentUser.role;
            return (
              <button
                key={option.role}
                onClick={() => {
                  setRole(option.role);
                  setIsOpen(false);
                  window.location.reload(); // Hard reload to reset state and clear any cached data easily
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium transition-colors",
                  isSelected ? 'bg-brand-primary/10 text-brand-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                <OptIcon className={cn("h-3.5 w-3.5", isSelected ? 'text-brand-primary' : option.color)} />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
