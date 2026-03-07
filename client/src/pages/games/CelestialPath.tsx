import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Coins, AlertCircle, Stars, ArrowUpCircle } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import confetti from "canvas-confetti";

const LEVELS = [
    { id: 1, multiplier: 1.2, hazard: 0.1 },
    { id: 2, multiplier: 1.5, hazard: 0.15 },
    { id: 3, multiplier: 2.0, hazard: 0.2 },
    { id: 4, multiplier: 3.5, hazard: 0.25 },
    { id: 5, multiplier: 7.0, hazard: 0.3 },
    { id: 6, multiplier: 11.0, hazard: 0.4 },
];

export default function CelestialPath() {
    const { balance, updateBalance, addTransaction } = useAppStore();
    const { playSound } = useAudio();
    const [betAmount, setBetAmount] = useState(50);
    const [currentLevel, setCurrentLevel] = useState(0); // 0 = not started
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const betPresets = [10, 50, 100, 500];

    const startGame = () => {
        if (balance < betAmount) return;
        updateBalance(-betAmount);
        setIsPlaying(true);
        setCurrentLevel(1);
        setIsGameOver(false);
        playSound('drop');
    };

    const ascend = () => {
        if (!isPlaying || isGameOver) return;

        const level = LEVELS[currentLevel - 1];
        const failed = Math.random() < level.hazard;

        if (failed) {
            setIsGameOver(true);
            addTransaction(betAmount, 'loss');
            playSound('loss');
        } else {
            if (currentLevel === LEVELS.length) {
                cashOut();
            } else {
                setCurrentLevel(prev => prev + 1);
                playSound('click');
            }
        }
    };

    const cashOut = () => {
        if (!isPlaying || isGameOver || currentLevel === 0) return;

        const multiplier = LEVELS[currentLevel - 1].multiplier;
        const won = betAmount * multiplier;

        updateBalance(won);
        addTransaction(won, 'win');
        playSound('win');

        if (multiplier >= 3.5) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#818CF8', '#C084FC', '#E879F9']
            });
        }

        resetGame();
    };

    const resetGame = () => {
        setIsPlaying(false);
        setCurrentLevel(0);
        setIsGameOver(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] items-center bg-[#050510] text-white overflow-hidden safe-area-inset-top">
            {/* Header */}
            <div className="w-full flex justify-between items-center p-4 z-50">
                <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <ArrowLeft className="w-5 h-5 text-indigo-400" />
                </button>
                <h1 className="text-xs font-black tracking-widest uppercase italic text-indigo-400/80">Celestial Path</h1>
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-indigo-400 font-bold"
                >
                    ?
                </button>
            </div>

            {/* Star Map Area */}
            <div className="relative flex-grow w-full overflow-y-auto px-4 py-8 pb-32">
                {/* Constellation Lines (Static) */}
                <svg className="absolute inset-x-0 top-0 h-full w-full opacity-10 pointer-events-none">
                    <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="white" strokeWidth="1" strokeDasharray="8 8" />
                </svg>

                <div className="relative z-10 flex flex-col-reverse items-center gap-4 w-full max-w-xs mx-auto mb-10">
                    {LEVELS.map((level, index) => {
                        const isCurrent = currentLevel === index + 1;
                        const isPassed = currentLevel > index + 1;

                        return (
                            <motion.div
                                key={level.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                    opacity: isPassed ? 0.3 : 1,
                                    scale: isCurrent ? 1.05 : 1,
                                    y: 0
                                }}
                                className={`relative w-full p-4 rounded-[1.5rem] border transition-all duration-500 ${isCurrent
                                    ? 'bg-indigo-600/30 border-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.4)]'
                                    : isPassed
                                        ? 'bg-emerald-500/5 border-emerald-500/20'
                                        : 'bg-white/[0.03] border-white/10'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCurrent ? 'bg-indigo-400 text-white shadow-[0_0_15px_rgba(129,140,248,0.5)]' : 'bg-white/5 text-white/20'
                                            }`}>
                                            <Trophy className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${isCurrent ? 'text-indigo-300' : 'text-white/20'}`}>
                                                VIP Level
                                            </span>
                                            <span className={`text-sm font-bold ${isCurrent ? 'text-white' : 'text-white/30'}`}>
                                                Floor {level.id}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`text-2xl font-black italic tracking-tighter ${isCurrent ? 'text-white' : 'text-white/10'}`}>
                                        {level.multiplier}x
                                    </div>
                                </div>
                                {isCurrent && (
                                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-400 rounded-full shadow-[0_0_10px_indigo]" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Game Over Overlay */}
                <AnimatePresence>
                    {isGameOver && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-8"
                        >
                            <div className="text-center space-y-6">
                                <div className="text-5xl font-black text-rose-500 uppercase italic tracking-tighter leading-none">BANKRUPT<br />BUSTED</div>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] max-w-[180px] mx-auto">The house always wins in the end.</p>
                                <button
                                    onClick={resetGame}
                                    className="w-full px-8 py-4 bg-white text-black font-black rounded-2xl uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 transition-transform"
                                >
                                    Try Again
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {showInfo && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
                        >
                            <div className="bg-[#0a0a1f] border border-indigo-500/30 p-8 rounded-[2rem] space-y-4 max-w-xs text-left">
                                <h2 className="text-xl font-black text-indigo-400 uppercase italic">VIP Climb Guide</h2>
                                <p className="text-[10px] uppercase font-bold text-white/50 leading-loose">
                                    Climb through the 6 Floors of the VIP tower. Each floor increases your payout but higher floors carry greater risk of "Bankrupt".
                                </p>
                                <div className="space-y-2">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
                                        <span className="text-[9px] font-bold uppercase text-white/40">Jackpot Multiplier</span>
                                        <span className="text-lg font-black italic">11x</span>
                                    </div>
                                </div>
                                <button onClick={() => setShowInfo(false)} className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Close</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Persistent Controls at Bottom */}
            <div className="w-full max-w-md bg-white/[0.02] backdrop-blur-3xl rounded-t-[3rem] p-8 border-t border-white/10 space-y-6 pb-12 z-40">
                {!isPlaying ? (
                    <>
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Game Stake</span>
                            <div className="flex items-center gap-1 text-yellow-400">
                                <Coins className="w-4 h-4" />
                                <span className="font-bold">₱{betAmount}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {betPresets.map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => setBetAmount(amt)}
                                    className={`py-2.5 rounded-xl font-bold text-xs transition-all ${betAmount === amt ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-white/5 text-white/60'
                                        }`}
                                >
                                    ₱{amt}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={startGame}
                            disabled={balance < betAmount}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-display font-black text-lg uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
                        >
                            Start the Climb
                        </button>
                    </>
                ) : (
                    <div className="flex gap-4">
                        <button
                            onClick={cashOut}
                            disabled={isGameOver}
                            className="flex-1 py-4 rounded-xl bg-emerald-600 text-white font-display font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                        >
                            Cash Out (₱{(betAmount * LEVELS[currentLevel - 1].multiplier).toFixed(0)})
                        </button>
                        <button
                            onClick={ascend}
                            disabled={isGameOver}
                            className="flex-1 py-4 rounded-xl bg-indigo-600 text-white font-display font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Climb Up <ArrowUpCircle className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
