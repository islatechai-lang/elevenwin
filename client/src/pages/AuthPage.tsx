import { motion } from "framer-motion";
import { LogIn, Zap, Shield, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
    const { login } = useAuth();

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-display">
            {/* Animated Sacred Geometry Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-500/10 rounded-full"
                />
                <motion.div
                    animate={{
                        rotate: -360,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-cyan-400/20 rounded-[30%70%70%30%/30%30%70%70%]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
            </div>

            {/* Content */}
            <div className="z-10 w-full max-w-sm flex flex-col items-center space-y-12">
                {/* Logo Section */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center space-y-4"
                >
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/40 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                        <span className="text-4xl font-black text-primary italic">11</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic">
                        ELEVEN<span className="text-primary italic">WIN</span>
                    </h1>
                    <p className="text-cyan-500/60 uppercase tracking-[0.3em] text-[10px] font-black">
                        The Digital Sanctuary of Luck
                    </p>
                </motion.div>

                {/* Feature Highlights */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 gap-4 w-full"
                >
                    <FeatureItem
                        icon={Zap}
                        title="Quantum Resonance"
                        desc="Experience games tuned to master frequencies."
                    />
                    <FeatureItem
                        icon={Shield}
                        title="Secured Ledger"
                        desc="Your gains are eternally persisted in the cloud."
                    />
                    <FeatureItem
                        icon={Trophy}
                        title="Master Status"
                        desc="Compete for divine placement in the matrix."
                    />
                </motion.div>

                {/* Action Section */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="w-full space-y-4 pt-8"
                >
                    <button
                        onClick={login}
                        className="group relative w-full py-5 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
                    >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                        <LogIn className="w-5 h-5" />
                        Continue with Google
                    </button>
                    <p className="text-center text-[10px] text-white/30 uppercase font-bold tracking-[0.1em]">
                        By continuing, you align with the sacred protocol
                    </p>
                </motion.div>

                {/* Footer Version */}
                <div className="absolute bottom-10 text-[10px] font-black opacity-20 tracking-[0.4em] uppercase">
                    Protocol Version 1.11.0
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest">{title}</h3>
                <p className="text-[10px] text-white/50 font-medium">{desc}</p>
            </div>
        </div>
    );
}
