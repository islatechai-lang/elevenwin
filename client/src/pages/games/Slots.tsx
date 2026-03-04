import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Coins, AlertCircle, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { Link } from "wouter";
import { useAudio } from "@/hooks/use-audio";

const SYMBOLS = ["🍒", "🍋", "🔔", "🍉", "💎", "7️⃣"];
const REEL_COUNT = 3;
const SPIN_DURATION = 2000;

export default function Slots() {
  const { balance, updateBalance, addTransaction } = useAppStore();
  const { playSound } = useAudio();
  const [reels, setReels] = useState(["🍒", "🍒", "🍒"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [winAmount, setWinAmount] = useState(0);

  const betPresets = [10, 50, 100, 500];

  const spin = () => {
    if (balance < betAmount || isSpinning) return;

    setIsSpinning(true);
    setWinAmount(0);
    updateBalance(-betAmount);
    playSound('spin');

    // Staggered reel stop logic for immersive feel
    setTimeout(() => {
      const newReels = Array(REEL_COUNT).fill(0).map(() => 
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      );
      
      setReels(newReels);
      setIsSpinning(false);

      // Check win
      if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
        let multiplier = 5;
        if (newReels[0] === "7️⃣") multiplier = 20;
        if (newReels[0] === "💎") multiplier = 10;
        
        const won = betAmount * multiplier;
        setWinAmount(won);
        updateBalance(won);
        addTransaction(won, 'win');
        playSound('win');
        
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF8C00']
        });
      } else if (newReels[0] === newReels[1] || newReels[1] === newReels[2]) {
        const won = betAmount * 1.5;
        setWinAmount(won);
        updateBalance(won);
        addTransaction(won, 'win');
        playSound('win');
        if (navigator.vibrate) navigator.vibrate(50);
      } else {
        addTransaction(betAmount, 'loss');
        playSound('loss');
      }

    }, SPIN_DURATION);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/">
          <div className="p-2 -ml-2 rounded-full hover:bg-secondary active:scale-95 transition-transform cursor-pointer">
            <ArrowLeft className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="text-2xl font-display font-bold">Classic Slots</h2>
      </div>

      {/* Slot Machine Container */}
      <div className="bg-card border-4 border-primary rounded-3xl p-4 material-shadow relative overflow-hidden">
        {/* Decorative lights */}
        <div className="absolute top-0 left-0 w-full h-full border-4 border-dashed border-primary/30 rounded-2xl pointer-events-none" />
        
        <div className="bg-background rounded-xl p-6 flex justify-between items-center gap-2 border-y-8 border-x-4 border-[#0a0a0a] shadow-inner relative">
          
          {/* Win Line */}
          <div className="absolute left-0 right-0 h-1 bg-destructive/50 top-1/2 -translate-y-1/2 z-0 shadow-[0_0_10px_rgba(255,0,0,0.5)]" />

          {reels.map((symbol, i) => (
            <div key={i} className="flex-1 bg-gradient-to-b from-secondary via-background to-secondary rounded-lg h-32 flex items-center justify-center text-6xl relative overflow-hidden border border-border/50">
              <AnimatePresence mode="popLayout">
                {isSpinning ? (
                  <motion.div
                    key="spinning"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: [0, 100], opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.1, ease: "linear" }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-5xl blur-[2px]"
                  >
                    {SYMBOLS.slice(0, 3).map(s => <div key={s}>{s}</div>)}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`symbol-${symbol}-${i}`}
                    initial={{ y: -50, scale: 0.8, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="relative z-10"
                  >
                    {symbol}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Win Display */}
        <div className="h-12 mt-4 flex items-center justify-center bg-black/50 rounded-lg border border-primary/20">
          <AnimatePresence>
            {winAmount > 0 && !isSpinning && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="font-display font-bold text-2xl text-primary drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
              >
                WIN ₱{winAmount.toLocaleString()}!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card rounded-3xl p-5 border border-border/50 mt-auto material-shadow space-y-5">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-muted-foreground">Bet Amount</span>
          <div className="flex items-center gap-1 text-primary">
            <Coins className="w-4 h-4" />
            <span>₱{betAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {betPresets.map((amt) => (
            <button
              key={amt}
              onClick={() => setBetAmount(amt)}
              disabled={isSpinning}
              className={`py-3 rounded-xl font-bold transition-all active:scale-95 ${
                betAmount === amt 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              ₱{amt}
            </button>
          ))}
        </div>

        {balance < betAmount && (
          <div className="flex items-center gap-2 text-destructive text-sm justify-center">
            <AlertCircle className="w-4 h-4" />
            <span>Insufficient balance</span>
          </div>
        )}

        <button
          onClick={spin}
          disabled={isSpinning || balance < betAmount}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-yellow-500 text-primary-foreground font-display font-bold text-2xl uppercase tracking-widest shadow-[0_0_20px_rgba(255,215,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all relative overflow-hidden"
        >
          {isSpinning ? 'Spinning...' : 'SPIN'}
          {/* Shine effect */}
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-[shine_3s_infinite]" />
        </button>
      </div>
    </div>
  );
}