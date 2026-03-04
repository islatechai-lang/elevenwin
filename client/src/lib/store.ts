import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface AppState {
  user: User | null;
  balance: number;
  loginAsGuest: () => void;
  updateBalance: (amount: number) => void;
  transactions: { id: string; amount: number; type: 'win' | 'loss' | 'deposit'; date: Date }[];
  addTransaction: (amount: number, type: 'win' | 'loss' | 'deposit') => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  balance: 1000, // Starting balance for MVP
  transactions: [],
  loginAsGuest: () => set({ 
    user: { id: 'guest123', name: 'Guest User', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest' } 
  }),
  updateBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
  addTransaction: (amount, type) => set((state) => ({
    transactions: [
      { id: Math.random().toString(36).substring(7), amount, type, date: new Date() },
      ...state.transactions
    ].slice(0, 50) // Keep last 50
  }))
}));
