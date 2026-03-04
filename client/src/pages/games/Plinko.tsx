import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Coins, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useAudio } from "@/hooks/use-audio";
import confetti from "canvas-confetti";

// Simple Plinko physics mockup
const ROWS = 8;
const MULTIPLIERS = [10, 3, 1.5, 0.5, 0.2, 0.5, 1.5, 3, 10];

export default function Plinko() {
  const { balance, updateBalance, addTransaction } = useAppStore();
  const { playSound } = useAudio();
  const [isDropping, setIsDropping] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [balls, setBalls] = useState<{ id: string; path: number[], resultIndex: number }[]>([]);

  const betPresets = [10, 50, 100, 500];

  const dropBall = () => {
    if (balance < betAmount) return;

    updateBalance(-betAmount);
    setIsDropping(true);
    playSound('drop');

    // Generate path
    let currentPos = 0;
    const path = [currentPos];
    
    for (let i = 0; i < ROWS; i++) {
      const dir = Math.random() > 0.5 ? 0.5 : -0.5;
      currentPos += dir;
      path.push(currentPos);
    }

    const normalizedPos = currentPos + (ROWS / 2);
    const resultIndex = Math.max(0, Math.min(MULTIPLIERS.length - 1, Math.round(normalizedPos)));
    
    const newBall = {
      id: Math.random().toString(36).substring(7),
      path,
      resultIndex
    };

    setBalls(prev => [...prev, newBall]);

    setTimeout(() => {
      const won = betAmount * MULTIPLIERS[resultIndex];
      const isWin = MULTIPLIERS[resultIndex] >= 1;

      if (won > 0) {
        updateBalance(won);
        addTransaction(won, MULTIPLIERS[resultIndex] > 1 ? 'win' : 'loss');
        
        if (MULTIPLIERS[resultIndex] >= 1.5) {
          playSound('win');
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#F43F5E', '#FB7185']
          });
        } else if (MULTIPLIERS[resultIndex] < 1) {
          playSound('loss');
        }
      }
      setIsDropping(false);
      
      setTimeout(() => {
        setBalls(prev => prev.filter(b => b.id !== newBall.id));
      }, 2000);
      
    }, ROWS * 300); 
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/">
          <div className="p-2 -ml-2 rounded-full hover:bg-secondary active:scale-95 transition-transform cursor-pointer">
            <ArrowLeft className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="text-2xl font-display font-bold">Plinko Drop</h2>
      </div>

      {/* Main Game Area */}
      <div className="bg-card border border-border/50 rounded-3xl p-4 material-shadow relative overflow-hidden flex flex-col items-center">
        
        {/* Plinko Board */}
        <div className="relative w-full max-w-[300px] aspect-square my-8">
          
          {/* Pins */}
          {Array.from({ length: ROWS }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex justify-center gap-4 mb-4">
              {Array.from({ length: rowIndex + 3 }).map((_, pinIndex) => (
                <div 
                  key={`pin-${rowIndex}-${pinIndex}`} 
                  className="w-2 h-2 rounded-full bg-border shadow-[0_0_5px_rgba(255,255,255,0.2)]"
                />
              ))}
            </div>
          ))}

          {/* Balls */}
          <AnimatePresence>
            {balls.map(ball => (
              <motion.div
                key={ball.id}
                initial={{ top: -10, left: "50%", x: "-50%" }}
                animate={{ 
                  top: "100%",
                  x: `calc(-50% + ${ball.path[ball.path.length - 1] * 24}px)`,
                }}
                transition={{ duration: ROWS * 0.3, ease: "linear" }}
                className="absolute w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] z-10"
              />
            ))}
          </AnimatePresence>

          {/* Multipliers */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-between gap-1">
            {MULTIPLIERS.map((mult, i) => (
              <div 
                key={i} 
                className={`flex-1 flex items-center justify-center text-[10px] font-bold rounded-md py-1 ${
                  mult > 1 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {mult}x
              </div>
            ))}
          </div>

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
          onClick={dropBall}
          disabled={balance < betAmount}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-display font-bold text-2xl uppercase tracking-widest shadow-[0_0_20px_rgba(244,63,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all relative overflow-hidden"
        >
          DROP BALL
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-[shine_3s_infinite]" />
        </button>
      </div>
    </div>
  );
}