import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Coins, AlertCircle, Zap } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import confetti from "canvas-confetti";

export default function Quantum11() {
    const { balance, updateBalance, addTransaction } = useAppStore();
    const { playSound } = useAudio();
    const [betAmount, setBetAmount] = useState(50);
    const [isPulsing, setIsPulsing] = useState(false);
    const [pulseValue, setPulseValue] = useState<number | null>(null);
    const [isMasterWin, setIsMasterWin] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const betPresets = [10, 50, 100, 500];
    const MASTER_NUMBERS = [11, 22, 33];

    const startPulse = () => {
        if (balance < betAmount || isPulsing) return;

        updateBalance(-betAmount);
        setIsPulsing(true);
        setPulseValue(null);
        setIsMasterWin(false);
        playSound('drop'); // Initial pulse sound

        // Visual build-up duration
        setTimeout(() => {
            const result = Math.floor(Math.random() * 33) + 1;
            setPulseValue(result);
            setIsPulsing(false);

            const isMaster = MASTER_NUMBERS.includes(result);
            setIsMasterWin(isMaster);

            let multiplier = 0;
            if (isMaster) {
                multiplier = 11; // Master Number 11x
            } else if (result % 11 === 0 || result === 7) {
                multiplier = 2; // Subtle numerology wins
            } else if (result > 20) {
                multiplier = 1.2;
            }

            const won = betAmount * multiplier;
            if (won > 0) {
                updateBalance(won);
                addTransaction(won, 'win');
                playSound('win');

                if (isMaster) {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#3B82F6', '#22D3EE', '#FDE047']
                    });
                }
            } else {
                addTransaction(betAmount, 'loss');
                playSound('loss');
            }
        }, 2000);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-between bg-slate-950 text-white overflow-hidden safe-area-inset-top">
            {/* Header with Info */}
            <div className="w-full flex justify-between items-center p-4 z-50">
                <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-cyan-400 rotate-180" />
                </button>
                <h1 className="text-sm font-black tracking-widest uppercase italic text-cyan-500/80">Quantum 11</h1>
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-cyan-400 font-bold"
                >
                    ?
                </button>
            </div>

            {/* Quantum Field */}
            <div className="relative flex-grow w-full flex items-center justify-center overflow-hidden -mt-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)]" />

                <AnimatePresence mode="wait">
                    {showInfo ? (
                        <motion.div
                            key="info"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="z-50 bg-slate-900/90 backdrop-blur-xl p-8 rounded-[2rem] border border-cyan-500/30 max-w-[85%] text-left space-y-4"
                        >
                            <h2 className="text-xl font-black text-cyan-400 uppercase italic">How to Win</h2>
                            <p className="text-xs leading-relaxed text-white/70 font-medium">
                                Hit the Quantum Field to trigger High Voltage Jackpots.
                            </p>
                            <ul className="space-y-2 text-[10px] font-bold uppercase tracking-wider">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> Master Numbers (11, 22, 33) = <span className="text-yellow-400">11x Multiplier</span></li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Divisible by 11 or Lucky 7 = <span className="text-cyan-400">2x Multiplier</span></li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/40" /> Frequency 20-33 = <span className="text-white">1.2x Multiplier</span></li>
                            </ul>
                            <button
                                onClick={() => setShowInfo(false)}
                                className="w-full py-3 bg-cyan-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px]"
                            >
                                Let's Roll
                            </button>
                        </motion.div>
                    ) : isPulsing ? (
                        <motion.div
                            key="pulsing"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: 1,
                            }}
                            className="relative"
                        >
                            {/* Spinning Rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-48 h-48 rounded-full border-t-2 border-cyan-400"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-2 rounded-full border-b-2 border-cyan-500/50"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Zap className="w-12 h-12 text-cyan-300 animate-pulse" />
                            </div>
                        </motion.div>
                    ) : pulseValue ? (
                        <motion.div
                            key="result"
                            initial={{ scale: 0.5, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <div className={`text-9xl font-black font-display mb-2 drop-shadow-[0_0_30px_rgba(34,211,238,0.4)] ${isMasterWin ? 'text-yellow-400' : 'text-cyan-400'}`}>
                                {pulseValue}
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-xs tracking-[0.3em] uppercase font-black text-white/50"
                            >
                                {isMasterWin ? "JACKPOT ALIGNMENT" : "STAKE LOCKED"}
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[ping_3s_infinite]" />
                                <div className="w-24 h-24 rounded-full border border-cyan-500/40 flex items-center justify-center">
                                    <Zap className="w-10 h-10 text-cyan-500/40" />
                                </div>
                            </div>
                            <p className="mt-8 text-[10px] text-cyan-500/40 uppercase font-black tracking-[0.4em]">Ready to Win</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Ambient Ring */}
                <div className="absolute w-[300px] h-[300px] rounded-full border border-white/5 pointer-events-none" />
            </div>

            {/* Controls Container with extra bottom padding for mobile safari etc */}
            <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl rounded-t-[3rem] p-8 border-t border-white/10 space-y-6 pb-12">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-500/80">Quantum Stake</span>
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Coins className="w-4 h-4" />
                        <span className="font-bold">₱{betAmount}</span>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {betPresets.map((amt) => (
                        <button
                            key={amt}
                            onClick={() => setBetAmount(amt)}
                            disabled={isPulsing}
                            className={`py-3 rounded-2xl font-bold text-xs transition-all ${betAmount === amt
                                ? "bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                : "bg-white/5 text-white/60 hover:bg-white/10"
                                }`}
                        >
                            ₱{amt}
                        </button>
                    ))}
                </div>

                <button
                    onClick={startPulse}
                    disabled={balance < betAmount || isPulsing}
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-display font-black text-xl uppercase tracking-[0.2em] shadow-xl disabled:opacity-50 active:scale-95 transition-all"
                >
                    {isPulsing ? "Pulsing..." : "Pulse Now"}
                </button>

                {balance < betAmount && (
                    <div className="flex items-center gap-2 text-rose-500 text-[10px] justify-center uppercase font-bold tracking-widest">
                        <AlertCircle className="w-3 h-3" />
                        <span>Insufficient Funds</span>
                    </div>
                )}
            </div>
        </div>
    );
}
