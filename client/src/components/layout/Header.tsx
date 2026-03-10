import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Coins, LogIn, LogOut, Wallet, User, ChevronDown, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export function Header() {
  const { user, balance } = useAppStore();
  const { login, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0a0a0f]/90 border-b border-white/5 backdrop-blur-xl shrink-0">
      {/* Logo - clickable to go home */}
      <Link href="/">
        <div className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform">
          <img
            src="/logo.png"
            alt="ElevenWin Logo"
            className="w-10 h-10 object-contain drop-shadow-lg"
          />
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.button
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={login}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </motion.button>
          ) : (
            <motion.div
              key="user-info"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              {/* Balance Pill + Add Funds */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 border border-white/10 shadow-inner">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="font-bold text-sm tracking-tight text-white">₱{balance.toLocaleString()}</span>
                </div>
                <Link href="/deposit">
                  <button className="flex items-center justify-center w-[34px] h-[34px] bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all">
                    <Plus className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              {/* Profile Avatar + Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1"
                >
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full border-2 border-primary/30 object-cover"
                  />
                  <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <div className="font-bold text-sm text-white truncate">{user.displayName || 'High Roller'}</div>
                        <div className="text-[10px] text-white/40 font-mono truncate">{user.email}</div>
                      </div>

                      <Link href="/wallet" onClick={() => setDropdownOpen(false)}>
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer">
                          <Wallet className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-white">Wallet</span>
                        </div>
                      </Link>

                      <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer">
                          <User className="w-4 h-4 text-indigo-400" />
                          <span className="text-sm font-medium text-white">Profile</span>
                        </div>
                      </Link>

                      <div className="border-t border-white/5">
                        <button
                          onClick={() => { logout(); setDropdownOpen(false); }}
                          className="flex items-center gap-3 px-4 py-3 w-full hover:bg-rose-500/10 active:bg-rose-500/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span className="text-sm font-medium text-rose-400">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}