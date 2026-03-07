import { useState, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Coins, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import confetti from "canvas-confetti";
import { useAudio } from "@/hooks/use-audio";



const FACE_CLASS = "absolute inset-0 bg-gradient-to-br from-emerald-500/95 to-teal-700/95 border-2 border-emerald-300 rounded-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center text-5xl font-display font-black text-white";

export default function Dice() {
  const { balance, updateBalance, addTransaction } = useAppStore();
  const { playSound } = useAudio();
  const [isRolling, setIsRolling] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [prediction, setPrediction] = useState<'over' | 'under'>('over');
  const [targetNumber, setTargetNumber] = useState(50);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const diceControls = useAnimation();

  const betPresets = [10, 50, 100, 500];
  const multiplier = 1.98;

  const rollDice = async () => {
    if (balance < betAmount || isRolling) return;

    setIsRolling(true);
    setLastRoll(null);
    updateBalance(-betAmount);

    // 1. Dice Enters Center
    await diceControls.start({ x: 0, y: 0, scale: 0.75, rotateX: 20, rotateY: 30, rotateZ: 10, transition: { type: "spring", bounce: 0.4 } });

    // 2. Shake Dice
    playSound('roll');
    if (navigator.vibrate) navigator.vibrate([20, 20]);

    await diceControls.start({ x: [0, -15, 15, -10, 0], y: [0, 10, -5, 10, 0], rotateX: [20, 90, -40, 60, 20], rotateY: [30, -60, 90, -30, 30], transition: { duration: 0.5, ease: "easeInOut" } });

    // 3. Throw sequence (Dice flies upwards/outwards)

    // The Dice Arc (Parabola)
    // Flies up, spins vigorously, lands squarely at 0
    const result = Math.floor(Math.random() * 100) + 1;
    setLastRoll(result); // Set secretly early to prep the front face

    await diceControls.start({
      x: [0, 60, 0],
      y: [0, -150, 0],
      scale: [0.75, 1.3, 1],
      rotateX: [20, 360, 720, 0],
      rotateY: [30, 720, 1440, 0],
      rotateZ: [10, 360, 720, 0],
      transition: {
        duration: 1.0,
        ease: "easeOut",
        times: [0, 0.4, 1]
      }
    });

    setIsRolling(false);

    // Win logic
    const isWin = prediction === 'over' ? result > targetNumber : result < targetNumber;

    if (isWin) {
      const won = betAmount * multiplier;
      updateBalance(won);
      addTransaction(won, 'win');
      playSound('win');

      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#ffffff']
      });
    } else {
      addTransaction(betAmount, 'loss');
      playSound('loss');
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] items-center bg-[#0a0a0f] text-white overflow-hidden safe-area-inset-top">
      {/* Header */}
      <div className="w-full flex justify-between items-center p-4 z-50">
        <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-emerald-400" />
        </button>
        <div className="text-center">
          <h1 className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-400/50">ElevenWin</h1>
          <div className="text-sm font-bold italic tracking-tighter uppercase">OVER / UNDER DICE</div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-emerald-400 font-bold"
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
            <div className="bg-[#0c0c14] border border-emerald-500/20 p-8 rounded-[2.5rem] space-y-6 max-w-xs text-left">
              <h2 className="text-xl font-black text-emerald-400 uppercase italic">Dice Rules</h2>
              <p className="text-[10px] font-bold uppercase text-white/50 leading-loose">
                Predict if the next roll will be OVER or UNDER your target number.
                <br /><br />
                Correct guesses double your stake (1.98x).
                <br /><br />
                Range: 1 to 100.
              </p>
              <button onClick={() => setShowInfo(false)} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Back to Casino</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 3D Game Area */}
      <div className="bg-gradient-to-br from-slate-900 to-black border-4 border-slate-800 rounded-[2.5rem] p-4 shadow-[inset_0_20px_40px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col items-center justify-center flex-grow w-full max-w-md min-h-[300px]">

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.1)_0%,transparent_60%)] z-0" />

        <div className="text-center space-y-2 absolute top-4 z-10 w-full px-6 flex justify-between">
          <div className="bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30 shadow-[0_4px_15px_rgba(16,185,129,0.2)]">
            <div className="text-[8px] text-emerald-400 uppercase tracking-wider font-bold mb-1">Multiplier</div>
            <div className="text-xl font-display font-black text-emerald-300">{multiplier}x</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700">
            <div className="text-[8px] text-slate-400 uppercase tracking-wider font-bold mb-1">Win Chance</div>
            <div className="text-sm font-bold text-slate-300">49%</div>
          </div>
        </div>

        {/* 3D Dice Stage */}
        <div className="relative w-full h-40 mt-[40px] perspective-[1200px] flex items-center justify-center pointer-events-none scale-90">

          {/* Floor Shadow for Depth */}
          <div className="absolute bottom-0 w-36 h-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.8)_0%,transparent_70%)] rounded-full blur-md" />



          {/* CSS 3D Cube Dice centered in its cell */}
          <motion.div
            initial={{ rotateX: 20, rotateY: 30, x: 0, y: 0, scale: 1 }}
            animate={diceControls}
            style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
            className="absolute left-1/2 top-1/2 -ml-[40px] -mt-[40px] w-20 h-20 z-[50]"
          >
            {/* Front Face (Win Condition displays here) */}
            <div className={FACE_CLASS} style={{ transform: "rotateY(0deg) translateZ(40px)", backfaceVisibility: "hidden" }}>
              {isRolling ? '?' : lastRoll ?? '?'}
            </div>
            {/* Back */}
            <div className={FACE_CLASS} style={{ transform: "rotateY(180deg) translateZ(40px)", backfaceVisibility: "hidden" }}>?</div>
            {/* Right */}
            <div className={FACE_CLASS} style={{ transform: "rotateY(90deg) translateZ(40px)", backfaceVisibility: "hidden" }}>?</div>
            {/* Left */}
            <div className={FACE_CLASS} style={{ transform: "rotateY(-90deg) translateZ(40px)", backfaceVisibility: "hidden" }}>?</div>
            {/* Top */}
            <div className={FACE_CLASS} style={{ transform: "rotateX(90deg) translateZ(40px)", backfaceVisibility: "hidden" }}>?</div>
            {/* Bottom */}
            <div className={FACE_CLASS} style={{ transform: "rotateX(-90deg) translateZ(40px)", backfaceVisibility: "hidden" }}>?</div>
          </motion.div>



        </div>

        {/* Win/Loss Glowing Overlay */}
        <AnimatePresence>
          {!isRolling && lastRoll !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute inset-0 pointer-events-none z-0 border-4 rounded-[2.5rem] ${(prediction === 'over' && lastRoll > targetNumber) || (prediction === 'under' && lastRoll < targetNumber)
                ? 'border-emerald-500 shadow-[inset_0_0_50px_rgba(16,185,129,0.3)]'
                : 'border-rose-500 shadow-[inset_0_0_50px_rgba(244,63,94,0.3)]'
                }`}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Target Controls Container */}
      <div className="w-full max-w-md bg-card border-2 border-border/50 rounded-3xl p-3 material-shadow relative z-20">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Target: <span className="text-foreground">{targetNumber}</span></span>
          <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Spread: <span className="text-foreground">1-100</span></span>
        </div>

        <div className="flex gap-2 p-1 bg-secondary/80 rounded-2xl shadow-inner">
          <button
            onClick={() => setPrediction('under')}
            disabled={isRolling}
            className={`flex-1 py-3 rounded-xl font-black transition-all text-xs flex flex-col items-center gap-1 overflow-hidden relative ${prediction === 'under'
              ? 'bg-gradient-to-b from-white to-gray-200 text-black shadow-[0_5px_15px_rgba(0,0,0,0.2)] scale-[1.02]'
              : 'text-muted-foreground hover:bg-black/5 active:scale-95'
              }`}
          >
            <span className="relative z-10 uppercase">UNDER {targetNumber}</span>
            {prediction === 'under' && <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 rounded-full mx-6" />}
          </button>
          <button
            onClick={() => setPrediction('over')}
            disabled={isRolling}
            className={`flex-1 py-3 rounded-xl font-black transition-all text-xs flex flex-col items-center gap-1 overflow-hidden relative ${prediction === 'over'
              ? 'bg-gradient-to-b from-white to-gray-200 text-black shadow-[0_5px_15px_rgba(0,0,0,0.2)] scale-[1.02]'
              : 'text-muted-foreground hover:bg-black/5 active:scale-95'
              }`}
          >
            <span className="relative z-10 uppercase">OVER {targetNumber}</span>
            {prediction === 'over' && <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 rounded-full mx-6" />}
          </button>
        </div>
      </div>

      {/* Bet Controls */}
      <div className="w-full max-w-md bg-card rounded-t-3xl p-4 border-2 border-border/50 material-shadow space-y-4 relative z-20">
        <div className="flex justify-between items-center text-xs font-medium">
          <span className="text-muted-foreground">Bet Amount</span>
          <div className="flex items-center gap-1 text-primary">
            <Coins className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-lg">₱{betAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {betPresets.map((amt) => (
            <button
              key={amt}
              onClick={() => setBetAmount(amt)}
              disabled={isRolling}
              className={`py-2 rounded-xl font-bold text-xs transition-all active:scale-95 ${betAmount === amt
                ? 'bg-emerald-500 text-white shadow-[0_5px_15px_rgba(16,185,129,0.4)]'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
            >
              ₱{amt}
            </button>
          ))}
        </div>

        {balance < betAmount && (
          <div className="flex items-center gap-2 text-rose-500 text-[10px] justify-center font-bold bg-rose-500/10 py-1 rounded-lg">
            <AlertCircle className="w-3 h-3" />
            <span>Insufficient balance</span>
          </div>
        )}

        <button
          onClick={rollDice}
          disabled={isRolling || balance < betAmount}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-slate-900 font-display font-black text-xl uppercase tracking-widest shadow-[0_10px_20px_rgba(16,185,129,0.4),inset_0_-4px_0_rgba(4,120,87,0.8)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] active:shadow-[0_0_0_transparent,inset_0_4px_0_rgba(4,120,87,0.8)] active:translate-y-1 transition-all relative overflow-hidden"
        >
          {isRolling ? 'ROLLING...' : 'ROLL DICE'}
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] animate-[shine_2s_infinite]" />
        </button>
      </div>
    </div >
  );
}