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
  const winChance = prediction === 'over' ? 100 - targetNumber : targetNumber;
  const multiplier = Math.max(1.01, Number((99 / winChance).toFixed(2)));

  const rollDice = async () => {
    if (balance < betAmount || isRolling) return;

    setIsRolling(true);
    setLastRoll(null);
    updateBalance(-betAmount);

    await diceControls.start({ x: 0, y: 0, scale: 0.75, rotateX: 20, rotateY: 30, rotateZ: 10, transition: { type: "spring", bounce: 0.4 } });

    playSound('roll');
    if (navigator.vibrate) navigator.vibrate([20, 20]);

    await diceControls.start({ x: [0, -15, 15, -10, 0], y: [0, 10, -5, 10, 0], rotateX: [20, 90, -40, 60, 20], rotateY: [30, -60, 90, -30, 30], transition: { duration: 0.5, ease: "easeInOut" } });

    const result = Math.floor(Math.random() * 100) + 1;
    setLastRoll(result);

    await diceControls.start({
      x: [0, 60, 0],
      y: [0, -100, 0],
      scale: [0.75, 1.3, 1],
      rotateX: [20, 360, 720, 0],
      rotateY: [30, 720, 1440, 0],
      rotateZ: [10, 360, 720, 0],
      transition: { duration: 1.0, ease: "easeOut", times: [0, 0.4, 1] }
    });

    setIsRolling(false);

    const isWin = prediction === 'over' ? result > targetNumber : result < targetNumber;

    if (isWin) {
      const won = betAmount * multiplier;
      updateBalance(won);
      addTransaction(won, 'win');
      playSound('win');
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors: ['#10B981', '#34D399', '#ffffff'] });
    } else {
      addTransaction(betAmount, 'loss');
      playSound('loss');
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 shrink-0">
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <div className="bg-[#0c0c14] border border-emerald-500/20 p-8 rounded-[2.5rem] space-y-6 max-w-xs text-left">
              <h2 className="text-xl font-black text-emerald-400 uppercase italic">Dice Rules</h2>
              <p className="text-[10px] font-bold uppercase text-white/50 leading-loose">
                Drag the slider to set your target number. Predict if the roll lands OVER or UNDER.
                <br /><br />
                Lower win chance = Higher multiplier (up to 49.5x!)
                <br /><br />
                Range: 1 to 100. House edge: 1%.
              </p>
              <button onClick={() => setShowInfo(false)} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Got It</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Dice Game Area - takes remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4 min-h-0">
        <div className="bg-gradient-to-br from-slate-900 to-black border-2 border-slate-800 rounded-3xl p-4 shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col items-center justify-center w-full max-w-md aspect-square max-h-[45vh]">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.1)_0%,transparent_60%)] z-0" />

          {/* Stats overlay */}
          <div className="absolute top-3 z-10 w-full px-4 flex justify-between">
            <div className="bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <div className="text-[8px] text-emerald-400 uppercase tracking-wider font-bold mb-0.5">Multiplier</div>
              <div className="text-lg font-display font-black text-emerald-300">{multiplier}x</div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700">
              <div className="text-[8px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Win Chance</div>
              <div className="text-sm font-bold text-slate-300">{winChance}%</div>
            </div>
          </div>

          {/* 3D Dice */}
          <div className="relative w-full h-32 perspective-[1200px] flex items-center justify-center pointer-events-none">
            <div className="absolute bottom-0 w-28 h-8 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.8)_0%,transparent_70%)] rounded-full blur-md" />
            <motion.div
              initial={{ rotateX: 20, rotateY: 30, x: 0, y: 0, scale: 1 }}
              animate={diceControls}
              style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
              className="absolute left-1/2 top-1/2 -ml-[35px] -mt-[35px] w-[70px] h-[70px] z-[50]"
            >
              <div className={FACE_CLASS} style={{ transform: "rotateY(0deg) translateZ(35px)", backfaceVisibility: "hidden" }}>
                {isRolling ? '?' : lastRoll ?? '?'}
              </div>
              <div className={FACE_CLASS} style={{ transform: "rotateY(180deg) translateZ(35px)", backfaceVisibility: "hidden" }}>?</div>
              <div className={FACE_CLASS} style={{ transform: "rotateY(90deg) translateZ(35px)", backfaceVisibility: "hidden" }}>?</div>
              <div className={FACE_CLASS} style={{ transform: "rotateY(-90deg) translateZ(35px)", backfaceVisibility: "hidden" }}>?</div>
              <div className={FACE_CLASS} style={{ transform: "rotateX(90deg) translateZ(35px)", backfaceVisibility: "hidden" }}>?</div>
              <div className={FACE_CLASS} style={{ transform: "rotateX(-90deg) translateZ(35px)", backfaceVisibility: "hidden" }}>?</div>
            </motion.div>
          </div>

          {/* Win/Loss Overlay */}
          <AnimatePresence>
            {!isRolling && lastRoll !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute inset-0 pointer-events-none z-0 border-4 rounded-3xl ${(prediction === 'over' && lastRoll > targetNumber) || (prediction === 'under' && lastRoll < targetNumber)
                  ? 'border-emerald-500 shadow-[inset_0_0_50px_rgba(16,185,129,0.3)]'
                  : 'border-rose-500 shadow-[inset_0_0_50px_rgba(244,63,94,0.3)]'
                  }`}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls - fixed to bottom, compact */}
      <div className="shrink-0 px-4 pb-4 space-y-3">
        {/* Slider */}
        <div className="relative h-10 flex items-center select-none touch-none">
          <div className="absolute inset-x-0 h-[3px] bg-white/10 rounded-full overflow-hidden">
            <div
              className={`absolute h-full transition-all duration-200 ${prediction === 'under' ? 'bg-emerald-500/40 left-0' : 'bg-emerald-500/40 right-0'}`}
              style={{ width: `${prediction === 'under' ? targetNumber : 100 - targetNumber}%` }}
            />
          </div>
          <input
            type="range"
            min="2"
            max="98"
            step="1"
            value={targetNumber}
            onChange={(e) => setTargetNumber(parseInt(e.target.value))}
            className="absolute inset-x-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
          <motion.div
            className="absolute w-6 h-6 pointer-events-none z-10 flex items-center justify-center"
            animate={{ left: `calc(${((targetNumber - 2) / 96) * 100}% - 12px)` }}
            transition={{ type: "spring", stiffness: 600, damping: 40 }}
          >
            <div className="w-1 h-7 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
            <div className="absolute -top-7 bg-emerald-500 text-black font-black px-2 py-0.5 rounded text-[10px]">
              {targetNumber}
            </div>
          </motion.div>
        </div>

        {/* Over/Under Toggle */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
          <button
            onClick={() => setPrediction('under')}
            disabled={isRolling}
            className={`flex-1 py-2.5 rounded-xl font-black transition-all text-xs uppercase ${prediction === 'under'
              ? 'bg-white text-black shadow-lg scale-[1.02]'
              : 'text-white/40 active:scale-95'
              }`}
          >
            UNDER {targetNumber}
          </button>
          <button
            onClick={() => setPrediction('over')}
            disabled={isRolling}
            className={`flex-1 py-2.5 rounded-xl font-black transition-all text-xs uppercase ${prediction === 'over'
              ? 'bg-white text-black shadow-lg scale-[1.02]'
              : 'text-white/40 active:scale-95'
              }`}
          >
            OVER {targetNumber}
          </button>
        </div>

        {/* Bet Amount + Roll */}
        <div className="flex items-center gap-2">
          {betPresets.map((amt) => (
            <button
              key={amt}
              onClick={() => setBetAmount(amt)}
              disabled={isRolling}
              className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 ${betAmount === amt
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
            >
              ₱{amt}
            </button>
          ))}
        </div>

        <button
          onClick={rollDice}
          disabled={isRolling || balance < betAmount}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-slate-900 font-display font-black text-lg uppercase tracking-widest shadow-[0_8px_16px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all relative overflow-hidden"
        >
          {isRolling ? 'ROLLING...' : 'ROLL DICE'}
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] animate-[shine_2s_infinite]" />
        </button>
      </div>
    </div>
  );
}