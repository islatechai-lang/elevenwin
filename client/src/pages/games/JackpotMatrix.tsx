import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Coins, AlertCircle, Grid, Zap } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import confetti from "canvas-confetti";

export default function JackpotMatrix() {
    const { balance, updateBalance, addTransaction } = useAppStore();
    const { playSound } = useAudio();
    const [betAmount, setBetAmount] = useState(50);
    const [grid, setGrid] = useState<number[]>(Array(9).fill(0).map(() => Math.floor(Math.random() * 9) + 1));
    const [isCycled, setIsCycled] = useState(false);
    const [winningIndices, setWinningIndices] = useState<number[]>([]);
    const [showInfo, setShowInfo] = useState(false);

    const betPresets = [10, 50, 100, 500];

    const triggerCycle = () => {
        if (balance < betAmount || isCycled) return;

        updateBalance(-betAmount);
        setIsCycled(true);
        setWinningIndices([]);
        playSound('drop');

        let iterations = 0;
        const interval = setInterval(() => {
            setGrid(prev => prev.map(() => Math.floor(Math.random() * 9) + 1));
            iterations++;
            if (iterations > 15) {
                clearInterval(interval);
                finalizeCycle();
            }
        }, 100);
    };

    const finalizeCycle = () => {
        const finalGrid = Array(9).fill(0).map(() => Math.floor(Math.random() * 9) + 1);
        setGrid(finalGrid);
        setIsCycled(false);

        // Check for sequences (Rows, Cols, Diagonals)
        const combos: number[][] = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        let totalMultiplier = 0;
        const hitIndices: number[] = [];

        combos.forEach(combo => {
            const [a, b, c] = combo;
            const vals = [finalGrid[a], finalGrid[b], finalGrid[c]];

            // Win Condition 1: Three of a kind
            const allSame = vals[0] === vals[1] && vals[1] === vals[2];

            // Win Condition 2: Master Sequence [3, 6, 9] in any order
            const is369 = vals.includes(3) && vals.includes(6) && vals.includes(9);

            if (allSame || is369) {
                totalMultiplier += allSame ? 5 : 11; // 3-6-9 is harder, bigger reward
                hitIndices.push(...combo);
            }
        });

        setWinningIndices(Array.from(new Set(hitIndices)));

        const won = betAmount * totalMultiplier;
        if (won > 0) {
            updateBalance(won);
            addTransaction(won, 'win');
            playSound('win');
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366F1', '#A5B4FC', '#FFFFFF']
            });
        } else {
            addTransaction(betAmount, 'loss');
            playSound('loss');
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-[#050508] text-white overflow-hidden safe-area-inset-top">
            {/* Matrix Header */}
            <div className="w-full flex justify-between items-center p-4 z-50">
                <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Grid className="w-5 h-5 text-indigo-400" />
                </button>
                <div className="text-center">
                    <h1 className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-500/50">Jackpot</h1>
                    <div className="text-sm font-bold italic tracking-tighter">MATRIX V1.3</div>
                </div>
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-indigo-400 font-bold"
                >
                    ?
                </button>
            </div>

            {/* The Matrix Grid */}
            <div className="relative flex-grow flex items-center justify-center px-6 -mt-8">
                <div className="grid grid-cols-3 gap-3 w-full max-w-[320px] aspect-square">
                    {grid.map((num, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: winningIndices.includes(i) ? [1, 1.05, 1] : 1,
                                borderColor: winningIndices.includes(i) ? "rgba(99, 102, 241, 0.8)" : "rgba(255, 255, 255, 0.05)",
                                backgroundColor: winningIndices.includes(i) ? "rgba(99, 102, 241, 0.15)" : "rgba(255, 255, 255, 0.02)"
                            }}
                            transition={{ repeat: winningIndices.includes(i) ? Infinity : 0, duration: 1 }}
                            className="relative flex items-center justify-center rounded-[2rem] border-2 backdrop-blur-3xl shadow-2xl overflow-hidden"
                        >
                            <AnimatePresence mode="popLayout">
                                <motion.span
                                    key={num}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className={`text-6xl font-black font-display tracking-tighter transition-colors ${[3, 6, 9].includes(num) ? 'text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]' : 'text-white/40'
                                        }`}
                                >
                                    {num}
                                </motion.span>
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Info Overlay */}
                <AnimatePresence>
                    {showInfo && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                        >
                            <div className="bg-slate-900 border border-indigo-500/30 p-8 rounded-[2.5rem] space-y-6 max-w-xs text-left">
                                <h2 className="text-xl font-black text-indigo-400 uppercase italic">Matrix Rules</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 mt-0.5">1</div>
                                        <p className="text-[10px] font-bold uppercase text-white/60 tracking-wider">Line of <span className="text-white">Three Matching Numbers</span> = 5x Win.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 mt-0.5">2</div>
                                        <p className="text-[10px] font-bold uppercase text-white/60 tracking-wider">Jackpot Sequence <span className="text-indigo-400">[3, 6, 9]</span> in any line = 11x Win.</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowInfo(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Back to Matrix</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Matrix Controls */}
            <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-3xl rounded-t-[3rem] p-8 pb-12 border-t border-white/10 space-y-6 z-40">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Game Bet</span>
                    <div className="flex items-center gap-1.5 text-yellow-500 font-bold">
                        <Coins className="w-4 h-4" /> ₱{betAmount}
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {betPresets.map((amt) => (
                        <button
                            key={amt}
                            onClick={() => setBetAmount(amt)}
                            disabled={isCycled}
                            className={`py-3 rounded-2xl font-black text-xs transition-all ${betAmount === amt ? 'bg-white text-black scale-105' : 'bg-white/5 text-white/40 border border-white/5'
                                }`}
                        >
                            ₱{amt}
                        </button>
                    ))}
                </div>

                <button
                    onClick={triggerCycle}
                    disabled={balance < betAmount || isCycled}
                    className="w-full py-5 rounded-[2rem] bg-indigo-600 text-white font-display font-black text-2xl uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    {isCycled ? <Zap className="animate-spin" /> : "Spin Matrix"}
                </button>

                {balance < betAmount && (
                    <div className="flex items-center gap-2 text-rose-500 text-[10px] justify-center uppercase font-black tracking-widest">
                        <AlertCircle className="w-3 h-3" />
                        <span>Insufficient Funds</span>
                    </div>
                )}
            </div>
        </div>
    );
}
