import { create } from 'zustand';
import { UserProfile, UserRole } from '../types';

interface AuthState {
  currentUser: UserProfile | null;
  setRole: (role: UserRole) => void;
}

// Mock users for our roles
const mockUsers: Record<UserRole, UserProfile> = {
  super_admin: { id: 'u-1', email: 'admin@solar.com', full_name: 'Super Admin', role: 'super_admin' },
  sales: { id: 'u-2', email: 'sales@solar.com', full_name: 'Sales Rep', role: 'sales' },
  logistics: { id: 'u-3', email: 'logistics@solar.com', full_name: 'Logistics Manager', role: 'logistics' },
  installer: { id: 'u-4', email: 'installer@solar.com', full_name: 'Site Installer', role: 'installer' },
};

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: mockUsers['super_admin'], // Default to Super Admin so we can see everything initially
  
  setRole: (role) => {
    set({ currentUser: mockUsers[role] });
  }
}));
