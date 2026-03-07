import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
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
  const [isPulling, setIsPulling] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [winAmount, setWinAmount] = useState(0);


  const leverControls = useAnimation();

  const betPresets = [10, 50, 100, 500];

  const triggerSpinSequence = async () => {
    if (balance < betAmount || isSpinning || isPulling) return;

    setIsPulling(true);
    setWinAmount(0);



    // 1. Lever pulls down (-180deg arc)
    playSound('spin');
    await leverControls.start({ rotateX: -180, y: "0%", transition: { duration: 0.3, ease: "easeIn" } });

    // Spin officially starts!
    updateBalance(-betAmount);
    setIsSpinning(true);

    // 2. Lever snaps back up

    leverControls.start({
      rotateX: 0,
      y: 0,
      scaleX: 1,
      transition: { type: "spring", stiffness: 300, damping: 10 }
    });

    // Staggered reel stop logic
    setTimeout(() => {
      const newReels = Array(REEL_COUNT).fill(0).map(() =>
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      );

      setReels(newReels);
      setIsSpinning(false);
      setIsPulling(false);

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
    <div className="flex flex-col h-[calc(100vh-128px)] sm:h-full space-y-2 pt-2 pb-2 overflow-hidden items-center justify-center">
      {/* 3D Slot Machine Container */}
      <div className="relative w-full max-w-2xl mx-auto transform-gpu perspective-[1000px] mt-2 mb-2 flex-grow flex flex-col justify-center">

        <div className="bg-gradient-to-b from-gray-800 to-black rounded-t-[2.5rem] rounded-b-2xl p-4 shadow-[inset_0_4px_20px_rgba(255,255,255,0.1),_0_20px_50px_rgba(0,0,0,0.9)] border-t border-gray-600 relative z-10">

          {/* Machine Headboard (Marquee) */}
          <div className="mb-4 h-12 rounded-xl bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 p-[2px] shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            <div className="h-full w-full bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.2),transparent_70%)] animate-[pulse_2s_infinite]" />
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                WIN 777
              </span>
            </div>
          </div>

          {/* Reels Area */}
          <div className="bg-gradient-to-b from-[#111] via-[#222] to-[#111] rounded-2xl p-3 shadow-[inset_0_15px_30px_rgba(0,0,0,0.9)] border-4 border-gray-900 border-b-gray-700 mx-1">
            <div className="flex justify-between gap-2 relative">
              {/* Center Win Line Laser */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-2 -right-2 h-1 bg-red-500/80 shadow-[0_0_20px_rgba(239,68,68,1)] z-20 mix-blend-screen pointer-events-none" />

              {reels.map((symbol, i) => (
                <div key={i} className="flex-1 h-24 sm:h-32 bg-white rounded-lg relative overflow-hidden shadow-[inset_0_25px_20px_-10px_rgba(0,0,0,0.8),inset_0_-25px_20px_-10px_rgba(0,0,0,0.8)] border border-gray-400/50">
                  {/* Spinning Cylinder Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_0%,transparent_15%,transparent_85%,rgba(0,0,0,0.5)_100%)] z-10 pointer-events-none" />

                  <AnimatePresence mode="popLayout">
                    {isSpinning ? (
                      <motion.div
                        key="spinning"
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: [0, 100], opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.1, ease: "linear" }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-4xl blur-[2px] z-0"
                      >
                        {SYMBOLS.slice(0, 3).map((s, idx) => <div key={`${s}-${idx}`}>{s}</div>)}
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`symbol-${symbol}-${i}`}
                        initial={{ y: -80, scale: 0.8, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5, damping: 10, stiffness: 100 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-5xl z-0"
                      >
                        {symbol}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Win Display Screen */}
          <div className="h-10 mt-4 flex items-center justify-center bg-black rounded-lg border-2 border-gray-800 shadow-inner overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_50%,rgba(255,255,255,0.1)_50%)] bg-[length:4px_100%]" />
            <AnimatePresence>
              {winAmount > 0 && !isSpinning && !isPulling && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="font-display font-black text-xl text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.8)] tracking-wider"
                >
                  +₱{winAmount.toLocaleString()}
                </motion.div>
              )}
            </AnimatePresence>
            {(winAmount === 0 || isSpinning || isPulling) && (
              <div className="font-display font-bold text-[10px] text-gray-700 tracking-widest uppercase text-center">
                {isSpinning ? "Good Luck" : "Insert Coin"}
              </div>
            )}
          </div>

        </div>

        {/* Adjusted oval base: wider (w-8 -> w-[28px]), shorter (h-10), centered on reels */}
        <div className="absolute right-1 top-[160px] -translate-y-1/2 z-20 w-[20px] h-8 flex flex-col items-center justify-center perspective-[800px]">
          {/* Base box (Thin vertical oval directly on side casing) */}
          <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-r from-gray-800 to-black rounded-full border-r border-y border-gray-600 shadow-[-5px_0_10px_rgba(0,0,0,0.8),10px_0_20px_rgba(0,0,0,0.6)] z-10" />

          {/* The Pullable Lever (Front facing POV on side casing) */}
          <motion.div
            initial={{ rotateX: 0, scaleX: 1, y: 0 }}
            animate={leverControls}
            style={{ transformOrigin: "bottom center" }}
            className="absolute -top-[35px] left-1 w-3 h-[50px] bg-gradient-to-r from-gray-300 via-white to-gray-500 shadow-2xl rounded-full border border-gray-400/50 z-20"
          >
            {/* Red Lever Ball */}
            <div className="absolute -top-5 -left-2 w-8 h-8 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ef4444,#7f1d1d)] shadow-[0_10px_15px_rgba(0,0,0,0.8),inset_0_-4px_8px_rgba(0,0,0,0.6)] border border-red-500" />
          </motion.div>
        </div>

      </div>

      {/* Controls */}
      <div className="w-full bg-card rounded-t-3xl p-4 border border-border/50 material-shadow space-y-4 relative z-20">
        <div className="flex justify-between items-center text-xs font-medium">
          <span className="text-muted-foreground">Bet Amount</span>
          <div className="flex items-center gap-1 text-primary">
            <Coins className="w-4 h-4" />
            <span className="font-bold">₱{betAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {betPresets.map((amt) => (
            <button
              key={amt}
              onClick={() => setBetAmount(amt)}
              disabled={isSpinning || isPulling}
              className={`py-2 rounded-xl font-bold text-xs transition-all active:scale-95 ${betAmount === amt
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
            >
              ₱{amt}
            </button>
          ))}
        </div>

        {balance < betAmount && (
          <div className="flex items-center gap-2 text-destructive text-[10px] justify-center">
            <AlertCircle className="w-3 h-3" />
            <span>Insufficient balance</span>
          </div>
        )}

        <button
          onClick={triggerSpinSequence}
          disabled={isSpinning || isPulling || balance < betAmount}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 text-black font-display font-black text-xl uppercase tracking-widest shadow-[0_10px_20px_rgba(234,179,8,0.3),inset_0_-4px_0_rgba(202,138,4,0.8)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] active:shadow-[0_0_0_transparent,inset_0_4px_0_rgba(202,138,4,0.8)] active:translate-y-1 transition-all relative overflow-hidden"
        >
          {isSpinning || isPulling ? 'SPINNING...' : 'PULL TO SPIN'}
          {/* Shine effect */}
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] animate-[shine_3s_infinite]" />
        </button>
      </div>
    </div>
  );
}