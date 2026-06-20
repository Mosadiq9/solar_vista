import { create } from 'zustand';
import { UserProfile, UserRole } from '../types';

interface AuthState {
  currentUser: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  
  setUser: (user) => {
    set({ currentUser: user });
  },

  setRole: (role) => {
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, role } : null
    }));
  }
}));
