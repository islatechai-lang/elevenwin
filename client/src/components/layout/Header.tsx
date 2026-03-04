import { useAppStore } from "@/lib/store";
import { Coins, Bell } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  const { balance } = useAppStore();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-card border-b border-border/50 material-shadow">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="font-display font-bold text-primary-foreground text-lg">S</span>
        </div>
        <span className="font-display font-bold text-lg text-foreground tracking-wider">SPIN<span className="text-primary">&</span>WIN</span>
      </div>

      <div className="flex items-center gap-3">
        <motion.div 
          key={balance}
          initial={{ scale: 1.2, color: "var(--color-primary)" }}
          animate={{ scale: 1, color: "var(--color-foreground)" }}
          className="flex items-center gap-1.5 bg-background rounded-full px-3 py-1.5 border border-border"
        >
          <Coins className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm">₱{balance.toLocaleString()}</span>
        </motion.div>
        
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full active:bg-secondary">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
        </button>
      </div>
    </header>
  );
}