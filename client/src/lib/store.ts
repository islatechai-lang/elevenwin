import { create } from 'zustand';
import { doc, updateDoc, arrayUnion, increment, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'win' | 'loss' | 'deposit';
  date: any;
}

interface AppState {
  user: User | null;
  isAuthLoading: boolean;
  balance: number;
  isMuted: boolean;
  transactions: Transaction[];
  vipLevel: string;
  setUser: (user: User | null) => void;
  setBalance: (balance: number) => void;
  updateBalance: (amount: number) => void;
  toggleMute: () => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (amount: number, type: 'win' | 'loss' | 'deposit') => void;
  clearStore: () => void;
  setAuthLoading: (isLoading: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAuthLoading: true,
  balance: 0,
  isMuted: false,
  transactions: [],
  vipLevel: 'BRONZE',
  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
  setUser: (user) => set({ user }),
  setBalance: (balance) => set({ balance }),
  updateBalance: async (amount) => {
    const { user, balance } = get();
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        balance: increment(amount)
      });
    } else {
      set({ balance: balance + amount });
    }
  },
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: async (amount, type) => {
    const { user } = get();

    const newTransaction = {
      id: Math.random().toString(36).substring(7),
      amount,
      type,
      date: Timestamp.now()
    };

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        transactions: arrayUnion(newTransaction)
      });
    } else {
      set((state) => ({
        transactions: [newTransaction, ...state.transactions].slice(0, 50)
      }));
    }
  },
  clearStore: () => set({ user: null, balance: 0, transactions: [] })
}));
