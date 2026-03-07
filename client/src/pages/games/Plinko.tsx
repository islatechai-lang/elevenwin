import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Coins, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useAudio } from "@/hooks/use-audio";
import confetti from "canvas-confetti";

const ROWS = 8;
const MULTIPLIERS = [10, 3, 1.5, 0.5, 0.2, 0.5, 1.5, 3, 10];
const PIN_GAP_X = 24; // approximation matching the gap-3 + pin size


export default function Plinko() {
  const { balance, updateBalance, addTransaction } = useAppStore();
  const { playSound } = useAudio();
  const [betAmount, setBetAmount] = useState(50);
  const [balls, setBalls] = useState<{ id: string; framesX: number[]; framesY: string[]; resultIndex: number }[]>([]);
  const [isDropping, setIsDropping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);


  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const betPresets = [10, 50, 100, 500];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const dropBall = async () => {
    if (balance < betAmount) return;

    updateBalance(-betAmount);
    playSound('drop');



    // Ball Physics Path Generation
    const framesX = [];
    const framesY = [];
    let currentX = 0;

    // Start above pins area
    framesX.push(currentX);
    framesY.push("-5%");

    for (let i = 0; i < ROWS; i++) {
      // Impact Pin
      framesX.push(currentX);
      framesY.push(`${(i + 0.5) * (75 / ROWS)}%`);

      // Bounce Arc Peak (More exaggerated for feel)
      const dir = Math.random() > 0.5 ? 1 : -1;

      // Sub-frame for impact feel (squeeze/bounce)
      framesX.push(currentX + (dir * 0.15));
      framesY.push(`${((i + 0.5) * (75 / ROWS)) - 1}%`);

      // Mid-air peak
      framesX.push(currentX + (dir * 0.5));
      framesY.push(`${((i + 1) * (75 / ROWS)) - 4}%`);

      currentX += dir * 0.5;

      // Schedule impact sounds with timing offset to match animation
      setTimeout(() => {
        playSound('click'); // Using 'click' or 'chip' or 'collect' as a short impact sound
      }, (i + 1) * 300);
    }

    // Final Drop into multiplier (100% of container height)
    framesX.push(currentX);
    framesY.push("100%");

    // With 9 multipliers, center is 0. Map range [-4, 4] to [0, 8]
    const resultIndex = Math.max(0, Math.min(MULTIPLIERS.length - 1, Math.round(currentX + 4)));

    const newBall = {
      id: Math.random().toString(36).substring(7),
      framesX,
      framesY,
      resultIndex
    };

    // Slight delay so it appears from hand opening
    setTimeout(() => {
      setBalls(prev => [...prev, newBall]);
    }, 100);

    setTimeout(() => {
      const won = betAmount * MULTIPLIERS[resultIndex];

      if (won > 0) {
        updateBalance(won);
        addTransaction(won, MULTIPLIERS[resultIndex] >= 1 ? 'win' : 'loss');

        if (MULTIPLIERS[resultIndex] >= 1.5) {
          playSound('win');
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#F43F5E', '#10B981', '#3B82F6']
          });
        }
      } else {
        addTransaction(betAmount, 'loss');
      }

      setTimeout(() => {
        setBalls(prev => prev.filter(b => b.id !== newBall.id));
      }, 500);

    }, (ROWS + 1) * 300); // Wait for physical animation to finish
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] items-center bg-[#0a0a0f] text-white overflow-hidden safe-area-inset-top">
      {/* Header */}
      <div className="w-full flex justify-between items-center p-4 z-50">
        <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-rose-400" />
        </button>
        <div className="text-center">
          <h1 className="text-[10px] font-black tracking-[0.3em] uppercase text-rose-400/50">ElevenWin</h1>
          <div className="text-sm font-bold italic tracking-tighter uppercase">PLINKO DROP</div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-rose-400 font-bold"
        >
          ?
        </button>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <div className="bg-[#0c0c14] border border-rose-500/20 p-8 rounded-[2.5rem] space-y-6 max-w-xs text-left">
              <h2 className="text-xl font-black text-rose-400 uppercase italic">Plinko Rules</h2>
              <p className="text-[10px] font-bold uppercase text-white/50 leading-loose">
                Drop the ball and watch it bounce through the pins.
                <br /><br />
                The multiplier landing determines your win!
                <br /><br />
                Outer bins pay the most.
              </p>
              <button onClick={() => setShowInfo(false)} className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Back to Casino</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 3D Game Area */}
      <div className="bg-gradient-to-b from-slate-900 to-black border-4 border-slate-800 border-b-slate-900 rounded-[2.5rem] p-4 shadow-[inset_0_20px_40px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col items-center flex-grow w-full max-w-md min-h-[300px]">

        {/* Glass Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />



        {/* 3D Plinko Board */}
        <div className="relative w-full max-w-[280px] aspect-square my-2 perspective-[1000px] flex-grow flex flex-col items-center">

          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 to-transparent rounded-3xl" />

          {/* Pins layout - use fixed spacing for predictable alignment */}
          <div className="absolute inset-x-0 top-0 bottom-12 flex flex-col justify-around py-4">
            {Array.from({ length: ROWS }).map((_, rowIndex) => {
              const rowPinCount = rowIndex + 3;
              return (
                <div key={`row-${rowIndex}`} className="flex justify-center relative z-20" style={{ gap: `${PIN_GAP_X - 8}px` }}>
                  {Array.from({ length: rowPinCount }).map((_, pinIndex) => (
                    <div
                      key={`pin-${rowIndex}-${pinIndex}`}
                      className="w-2 h-2 rounded-full bg-slate-200 shadow-[0_3px_5px_rgba(0,0,0,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.4),inset_1px_1px_2px_rgba(255,255,255,0.9)] border border-slate-400 relative"
                    >
                      {/* Glossy highlight on pin */}
                      <div className="absolute top-[1px] left-[1px] w-[2px] h-[2px] bg-white rounded-full opacity-80 mix-blend-screen" />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Balls with physical bouncing keyframes */}
          <AnimatePresence>
            {balls.map(ball => (
              <motion.div
                key={ball.id}
                initial={{ top: "-10%", left: "50%", x: "-50%", scale: 0 }}
                animate={{
                  top: ball.framesY,
                  x: ball.framesX.map(px => `calc(-50% + ${px * PIN_GAP_X}px)`),
                  scale: [0, 1.1, 1, 1, 1],
                  rotate: [0, 180, 360, 540, 720]
                }}
                transition={{
                  duration: (ROWS + 1) * 0.3,
                  ease: "easeOut",
                  times: ball.framesY.map((_, i) => i / (ball.framesY.length - 1))
                }}
                className="absolute w-3 h-3 rounded-full bg-[radial-gradient(circle_at_30%_30%,#fb7185,#e11d48)] shadow-[0_10px_10px_rgba(225,29,72,0.4),inset_-2px_-2px_3px_rgba(0,0,0,0.6),inset_1px_1px_3px_rgba(255,255,255,0.9)] border border-rose-400 z-30"
              />
            ))}
          </AnimatePresence>

          {/* 3D Multipliers Bins - Perfectly Aligned with Pins */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex justify-center h-9 perspective-[800px] transform-gpu" style={{ gap: '4px', width: `${MULTIPLIERS.length * PIN_GAP_X}px` }}>
            {MULTIPLIERS.map((mult, i) => (
              <div
                key={i}
                className={`relative flex items-center justify-center text-[7px] font-black rounded-full border-2 ${mult > 1
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400'
                  }`}
                style={{
                  width: `${PIN_GAP_X - 4}px`,
                  transform: `rotateX(15deg) translateZ(5px)`,
                }}
              >
                <div className="absolute inset-0 bg-white/5 rounded-full pointer-events-none" />
                {mult}x
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Controls */}
      <div className="w-full bg-card rounded-t-3xl p-4 border border-border/50 material-shadow space-y-4 relative z-40">
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
              className={`py-2 rounded-xl font-bold text-xs transition-all active:scale-95 ${betAmount === amt
                ? 'bg-primary text-primary-foreground shadow-[0_5px_15px_rgba(var(--primary),0.3)]'
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
          onClick={dropBall}
          disabled={balance < betAmount}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-display font-black text-xl uppercase tracking-widest shadow-[0_10px_20px_rgba(244,63,94,0.4),inset_0_-4px_0_rgba(190,18,60,0.8)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] active:shadow-[0_0_0_transparent,inset_0_4px_0_rgba(190,18,60,0.8)] active:translate-y-1 transition-all relative overflow-hidden"
        >
          DROP BALL
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-[shine_2s_infinite]" />
        </button>
      </div>
    </div>
  );
}