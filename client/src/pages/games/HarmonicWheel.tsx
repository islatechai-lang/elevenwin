import { useState, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Coins, AlertCircle, ArrowLeft, Activity, Zap } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import confetti from "canvas-confetti";

const SECTIONS = [
    { multiplier: 0, color: "bg-slate-800", label: "Mute" },
    { multiplier: 2, color: "bg-indigo-500", label: "Minor Win" },
    { multiplier: 0.5, color: "bg-slate-700", label: "Flat" },
    { multiplier: 11, color: "bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]", label: "GRAND JACKPOT" },
    { multiplier: 1.5, color: "bg-blue-500", label: "Standard Win" },
    { multiplier: 0.2, color: "bg-slate-900", label: "DUD" },
    { multiplier: 5, color: "bg-purple-500", label: "MEGA WIN" },
    { multiplier: 1.2, color: "bg-cyan-500", label: "Lucky Hit" },
];

export default function HarmonicWheel() {
    const { balance, updateBalance, addTransaction } = useAppStore();
    const { playSound } = useAudio();
    const [betAmount, setBetAmount] = useState(50);
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<typeof SECTIONS[0] | null>(null);
    const controls = useAnimation();
    const [rotation, setRotation] = useState(0);
    const [showInfo, setShowInfo] = useState(false);

    const betPresets = [10, 50, 100, 500];

    const spin = async () => {
        if (balance < betAmount || isSpinning) return;

        updateBalance(-betAmount);
        setIsSpinning(true);
        setResult(null);
        playSound('drop');

        const randomDegree = Math.floor(Math.random() * 360);
        const totalRotation = rotation + (360 * 5) + randomDegree;
        setRotation(totalRotation);

        await controls.start({
            rotate: totalRotation,
            transition: { duration: 4, ease: [0.15, 0, 0.15, 1] }
        });

        // Calculate result
        const normalizedDegree = 360 - (totalRotation % 360);
        const sectionIndex = Math.floor(normalizedDegree / (360 / SECTIONS.length));
        const winSection = SECTIONS[sectionIndex];

        setResult(winSection);
        setIsSpinning(false);

        const won = betAmount * winSection.multiplier;
        if (won > 0) {
            updateBalance(won);
            addTransaction(won, 'win');
            playSound('win');

            if (winSection.multiplier >= 5) {
                confetti({
                    particleCount: 80,
                    spread: 50,
                    origin: { y: 0.6 },
                    colors: ['#EAB308', '#A855F7', '#3B82F6']
                });
            }
        } else {
            addTransaction(betAmount, 'loss');
            playSound('loss');
        }
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] items-center bg-[#0a0a0f] text-white safe-area-inset-top">
            {/* Header */}
            <div className="w-full flex justify-between items-center p-4 z-50">
                <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <ArrowLeft className="w-5 h-5 text-indigo-400" />
                </button>
                <div className="text-center">
                    <h1 className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-500/50">ElevenWin</h1>
                    <div className="text-sm font-bold italic tracking-tighter uppercase">GOLDEN WHEEL</div>
                </div>
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-indigo-400 font-bold"
                >
                    ?
                </button>
            </div>

            {/* Visualizer Area */}
            <div className="relative flex-grow w-full flex items-center justify-center px-4 -mt-8">
                {/* Glow behind wheel */}
                <div className="absolute w-64 h-64 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

                {/* The Wheel */}
                <div className="relative w-72 h-72 sm:w-80 sm:h-80">
                    {/* Static Pointer */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-12 z-20 flex flex-col items-center">
                        <div className="w-1.5 h-10 bg-white rounded-full shadow-[0_0_20px_white]" />
                        <div className="w-4 h-4 rounded-full bg-white mt-1 animate-pulse shadow-[0_0_10px_white]" />
                    </div>

                    <motion.div
                        animate={controls}
                        className="w-full h-full rounded-full border-[10px] border-white/5 relative overflow-hidden bg-white/[0.02] backdrop-blur-2xl shadow-2xl"
                    >
                        {SECTIONS.map((section, i) => (
                            <div
                                key={i}
                                className={`absolute top-0 left-1/2 w-1/2 h-full origin-left ${section.color}`}
                                style={{
                                    transform: `rotate(${i * (360 / SECTIONS.length)}deg) skewY(${-90 + (360 / SECTIONS.length)}deg)`,
                                    opacity: 0.9
                                }}
                            >
                                <div className="absolute bottom-10 right-10 text-[6px] font-black rotate-45 select-none opacity-20">
                                    {section.multiplier}x
                                </div>
                            </div>
                        ))}

                        {/* Center Cap */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-black/90 border-4 border-white/10 flex items-center justify-center shadow-2xl z-10">
                                <Zap className="w-8 h-8 text-indigo-400" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Dynamic Label */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-6 text-center z-30"
                        >
                            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-2">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Big Win Incoming</span>
                            </div>
                            <div className="text-4xl font-black italic uppercase tracking-tighter text-indigo-400 drop-shadow-[0_0_20px_rgba(129,140,248,0.5)]">
                                {result.label} ({result.multiplier}x)
                            </div>
                        </motion.div>
                    )}

                    {showInfo && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                        >
                            <div className="bg-[#0c0c14] border border-indigo-500/20 p-8 rounded-[2.5rem] space-y-6 max-w-xs text-left">
                                <h2 className="text-xl font-black text-indigo-400 uppercase italic">Imperial Rules</h2>
                                <p className="text-[10px] font-bold uppercase text-white/50 leading-loose">
                                    Spin the imperial wheel to hit huge multipliers. Land on the gold sections to trigger the Grand Jackpot.
                                </p>
                                <div className="space-y-2">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
                                        <span className="text-[9px] font-black tracking-widest text-indigo-400 uppercase">Grand Jackpot</span>
                                        <span className="text-lg font-black italic">11x</span>
                                    </div>
                                </div>
                                <button onClick={() => setShowInfo(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Back to Wheel</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls Container */}
            <div className="w-full max-w-md bg-card rounded-t-3xl p-4 border border-border/50 material-shadow space-y-4 relative z-20">
                <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-muted-foreground">Bet Amount</span>
                    <div className="flex items-center gap-1 text-primary">
                        <Coins className="w-4 h-4 text-indigo-400" />
                        <span className="font-bold text-lg">₱{betAmount.toLocaleString()}</span>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {betPresets.map((amt) => (
                        <button
                            key={amt}
                            onClick={() => setBetAmount(amt)}
                            disabled={isSpinning}
                            className={`py-2 rounded-xl font-bold text-xs transition-all active:scale-95 ${betAmount === amt
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                }`}
                        >
                            ₱{amt}
                        </button>
                    ))}
                </div>

                <button
                    onClick={spin}
                    disabled={balance < betAmount || isSpinning}
                    className="w-full py-5 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 text-white font-display font-black text-xl uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(99,102,241,0.3)] hover:shadow-indigo-500/50 disabled:opacity-50 active:translate-y-1 transition-all flex items-center justify-center gap-3 overflow-hidden relative"
                >
                    {isSpinning ? "Spinning for Gold..." : "Spin Wheel"}
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shine_3s_infinite]" />
                </button>

                {balance < betAmount && (
                    <div className="flex items-center gap-2 text-rose-500 text-[10px] justify-center uppercase font-black tracking-widest animate-pulse">
                        <AlertCircle className="w-3 h-3" />
                        <span>Insufficient Funds</span>
                    </div>
                )}
            </div>
        </div>
    );
}
