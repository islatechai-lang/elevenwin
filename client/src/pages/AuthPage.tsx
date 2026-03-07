import { motion } from "framer-motion";
import { LogIn, Coins, Trophy, Star, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
    const { login } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_70%)]" />

                {/* Floating "Gold Sparkles" */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            opacity: 0,
                            y: Math.random() * 1000,
                            x: Math.random() * 1000
                        }}
                        animate={{
                            opacity: [0, 0.5, 0],
                            y: [null, Math.random() * -100],
                            transition: {
                                duration: 5 + Math.random() * 5,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }
                        }}
                        className="absolute w-1 h-1 bg-yellow-500 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>

            <div className="z-10 w-full max-w-sm flex flex-col items-center text-center space-y-12">
                {/* Luxury Logo Section */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-700 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(234,179,8,0.3)] border border-yellow-300/50 rotate-3">
                        <Coins className="w-12 h-12 text-black" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-5xl font-black tracking-tight uppercase">
                            ELEVEN<span className="text-yellow-500">WIN</span>
                        </h1>
                        <p className="text-yellow-500 font-bold tracking-[0.4em] text-[10px] uppercase">
                            The High Roller Casino
                        </p>
                    </div>
                </motion.div>

                {/* Casino Features */}
                <div className="grid grid-cols-1 gap-3 w-full">
                    <CasinoFeature
                        icon={TrendingUp}
                        title="High Stakes"
                        desc="Join the elite players in the VIP matrix."
                    />
                    <CasinoFeature
                        icon={Star}
                        title="Luxury Games"
                        desc="7 premium games with exclusive jackpots."
                    />
                    <CasinoFeature
                        icon={Trophy}
                        title="Instant Payouts"
                        desc="Your winnings are secured and ready to roll."
                    />
                </div>

                {/* login button centered and simple */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-full pt-4"
                >
                    <button
                        onClick={login}
                        className="w-full group relative py-5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:shadow-[0_15px_40px_rgba(234,179,8,0.4)]"
                    >
                        <LogIn className="w-6 h-6 text-black" />
                        <span className="text-black font-black uppercase tracking-widest text-base">
                            Continue with Google
                        </span>
                    </button>
                    <p className="mt-6 text-[11px] text-white/40 font-bold uppercase tracking-widest">
                        Welcome to the inner circle
                    </p>
                </motion.div>
            </div>

            {/* Luxury Version tag */}
            <div className="absolute bottom-8 text-[11px] font-bold text-yellow-500/20 uppercase tracking-[0.5em]">
                VIP PROXY v1.11.0
            </div>
        </div>
    );
}

function CasinoFeature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
    return (
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                <Icon className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-yellow-500">{title}</h3>
                <p className="text-[11px] text-white/60 font-medium leading-tight">{desc}</p>
            </div>
        </div>
    );
}
