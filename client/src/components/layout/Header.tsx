import { useAppStore } from "@/lib/store";
import { Coins, Volume2, VolumeX, LogIn, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user, balance, isMuted, toggleMute } = useAppStore();
  const { login, logout } = useAuth(); // useAuth already provides the login/logout functions

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-card border-b border-border/50 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="font-display font-bold text-primary-foreground text-lg">E</span>
        </div>
        <span className="font-display font-bold text-lg text-foreground tracking-wider italic hidden sm:block">ELEVEN<span className="text-primary">WIN</span></span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleMute}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full active:bg-secondary"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <AnimatePresence mode="wait">
          {!user ? (
            <motion.button
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={login} // This calls the login function from useAuth
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
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-1.5 bg-background rounded-full px-3 py-1.5 border border-border shadow-sm">
                <Coins className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm tracking-tight">₱{balance.toLocaleString()}</span>
              </div>

              <div className="relative group">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full border-2 border-primary/20 p-0.5 cursor-pointer"
                />
                <button
                  onClick={logout} // This calls the logout function from useAuth
                  className="absolute -bottom-1 -right-1 bg-destructive text-destructive-foreground p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}