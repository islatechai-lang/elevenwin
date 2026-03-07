import { motion } from "framer-motion";
import { Coins } from "lucide-react";
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

                {/* login button centered and simple */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-full pt-4 flex justify-center"
                >
                    <button
                        onClick={login}
                        className="flex items-center gap-4 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all active:scale-95 border border-slate-200"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        <span className="text-base font-semibold">
                            Continue with Google
                        </span>
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
