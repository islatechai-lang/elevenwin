import { useEffect } from 'react';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import {
    doc,
    getDoc,
    setDoc,
    onSnapshot,
    Timestamp
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { useAppStore } from '../lib/store';

export function useAuth() {
    const setUser = useAppStore((state) => state.setUser);
    const setBalance = useAppStore((state) => state.setBalance);
    const setTransactions = useAppStore((state) => state.setTransactions);
    const clearStore = useAppStore((state) => state.clearStore);
    const setAuthLoading = useAppStore((state) => state.setAuthLoading);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                const user = {
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                };
                setUser(user);

                // Check if user exists in Firestore
                const userRef = doc(db, 'users', firebaseUser.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    // Initialize user in Firestore
                    await setDoc(userRef, {
                        uid: firebaseUser.uid,
                        displayName: firebaseUser.displayName,
                        email: firebaseUser.email,
                        photoURL: firebaseUser.photoURL,
                        balance: 1000,
                        transactions: [],
                        vipLevel: 'DIAMOND VIP',
                        lastLogin: Timestamp.now(),
                        createdAt: Timestamp.now(),
                    });
                }

                // Set up real-time listener for user data
                const unsubscribeFirestore = onSnapshot(userRef, (doc) => {
                    if (doc.exists()) {
                        const data = doc.data();
                        setBalance(data.balance || 0);
                        setTransactions(data.transactions || []);
                        useAppStore.setState({ vipLevel: data.vipLevel || 'BRONZE' });
                    }
                });

                setAuthLoading(false);

                return () => unsubscribeFirestore();
            } else {
                // User is signed out
                clearStore();
                setAuthLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, [setUser, setBalance, setTransactions, clearStore]);

    const login = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return { login, logout };
}
