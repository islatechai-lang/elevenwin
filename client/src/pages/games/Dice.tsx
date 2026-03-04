import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Coins, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import confetti from "canvas-confetti";

export default function Dice() {
  const { balance, updateBalance, addTransaction } = useAppStore();
  const [isRolling, setIsRolling] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [prediction, setPrediction] = useState<'over' | 'under'>('over');
  const [targetNumber, setTargetNumber] = useState(50);
  const [lastRoll, setLastRoll] = useState<number | null>(null);

  const betPresets = [10, 50, 100, 500];
  
  // Basic multiplier calculation (configurable house edge)
  // Win chance: Over 50 = 49%, Under 50 = 49% (2% house edge)
  const multiplier = 1.98; 

  const rollDice = () => {
    if (balance < betAmount || isRolling) return;

    setIsRolling(true);
    setLastRoll(null);
    updateBalance(-betAmount);

    if (navigator.vibrate) navigator.vibrate(20);

    setTimeout(() => {
      // Provably fair placeholder - Random 1-100
      const result = Math.floor(Math.random() * 100) + 1;
      setLastRoll(result);
      setIsRolling(false);

      const isWin = prediction === 'over' ? result > targetNumber : result < targetNumber;

      if (isWin) {
        const won = betAmount * multiplier;
        updateBalance(won);
        addTransaction(won, 'win');
        
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10B981', '#34D399']
        });
      } else {
        addTransaction(betAmount, 'loss');
        if (navigator.vibrate) navigator.vibrate(200);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/">
          <div className="p-2 -ml-2 rounded-full hover:bg-secondary active:scale-95 transition-transform cursor-pointer">
            <ArrowLeft className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="text-2xl font-display font-bold">Dice Roll</h2>
      </div>

      {/* Main Game Area */}
      <div className="bg-card border border-border/50 rounded-3xl p-6 material-shadow relative">
        <div className="text-center space-y-2 mb-8">
          <div className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Multiplier</div>
          <div className="text-3xl font-display font-bold text-emerald-500">{multiplier}x</div>
          <div className="text-xs text-muted-foreground">Win Chance: 49%</div>
        </div>

        {/* Dice Result Display */}
        <div className="flex justify-center mb-8 relative h-32">
          <AnimatePresence mode="popLayout">
            {isRolling ? (
              <motion.div
                key="rolling"
                animate={{ 
                  rotate: [0, 90, 180, 270, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-24 h-24 bg-primary/20 rounded-2xl flex items-center justify-center border-2 border-primary border-dashed"
              >
                <div className="text-4xl">🎲</div>
              </motion.div>
            ) : lastRoll !== null ? (
              <motion.div
                key="result"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                type="spring"
                className={`w-32 h-32 rounded-3xl flex items-center justify-center text-5xl font-display font-bold border-4 shadow-xl ${
                  (prediction === 'over' && lastRoll > targetNumber) || (prediction === 'under' && lastRoll < targetNumber)
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-emerald-500/20'
                    : 'bg-destructive/20 border-destructive text-destructive shadow-destructive/20'
                }`}
              >
                {lastRoll}
              </motion.div>
            ) : (
              <div className="w-32 h-32 rounded-3xl bg-secondary flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border">
                <span className="text-4xl mb-2">🎲</span>
                <span className="text-xs uppercase font-bold">Roll Now</span>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Target Slider Area */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-muted-foreground">Target: {targetNumber}</span>
            <span className="text-sm font-bold text-muted-foreground">Roll: 1-100</span>
          </div>
          
          <div className="flex gap-2 p-1 bg-secondary rounded-2xl">
            <button
              onClick={() => setPrediction('under')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm flex flex-col items-center gap-1 ${
                prediction === 'under' 
                  ? 'bg-background shadow-md text-foreground' 
                  : 'text-muted-foreground'
              }`}
            >
              <span>Under {targetNumber}</span>
            </button>
            <button
              onClick={() => setPrediction('over')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm flex flex-col items-center gap-1 ${
                prediction === 'over' 
                  ? 'bg-background shadow-md text-foreground' 
                  : 'text-muted-foreground'
              }`}
            >
              <span>Over {targetNumber}</span>
            </button>
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
              disabled={isRolling}
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
          onClick={rollDice}
          disabled={isRolling || balance < betAmount}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-display font-bold text-2xl uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all relative overflow-hidden"
        >
          {isRolling ? 'Rolling...' : 'ROLL DICE'}
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-[shine_3s_infinite]" />
        </button>
      </div>
    </div>
  );
}