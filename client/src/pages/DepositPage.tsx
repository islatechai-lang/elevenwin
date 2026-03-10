import { useState } from "react";
import { ArrowLeft, Sparkles, CreditCard, Smartphone, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { WhopCheckoutEmbed } from "@whop/checkout/react";
import { useAppStore } from "@/lib/store";

interface DepositOption {
    id: string;
    label: string;
    amount: number;
    planId: string;
    isFree?: boolean;
    badge?: string;
}

const DEPOSIT_OPTIONS: DepositOption[] = [
    {
        id: "free",
        label: "Free Bonus",
        amount: 2,
        planId: "plan_RpIYauIasMLZl",
        isFree: true,
        badge: "FREE",
    },
    {
        id: "100",
        label: "₱100",
        amount: 100,
        planId: "plan_rxegn4dloqzX2",
    },
    {
        id: "200",
        label: "₱200",
        amount: 200,
        planId: "plan_gMjF0sRz65Zua",
    },
    {
        id: "500",
        label: "₱500",
        amount: 500,
        planId: "plan_u6cDJvhH4Avm7",
        badge: "POPULAR",
    },
    {
        id: "1000",
        label: "₱1,000",
        amount: 1000,
        planId: "plan_wT7FHxVoPw7Dq",
        badge: "BEST VALUE",
    },
];

export default function DepositPage() {
    const [selectedOption, setSelectedOption] = useState<DepositOption | null>(null);
    const [, navigate] = useLocation();
    const { updateBalance, addTransaction, user } = useAppStore();

    const handleComplete = async (planId: string, receiptId: string) => {
        const option = DEPOSIT_OPTIONS.find((o) => o.planId === planId);
        if (option) {
            await updateBalance(option.amount);
            await addTransaction(option.amount, "deposit");
        }
        navigate("/wallet");
    };

    return (
        <div className="min-h-screen px-4 pt-4 pb-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                {selectedOption ? (
                    <button
                        onClick={() => setSelectedOption(null)}
                        className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium">Back</span>
                    </button>
                ) : (
                    <Link href="/wallet">
                        <button className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="font-medium">Wallet</span>
                        </button>
                    </Link>
                )}
                <h2 className="text-2xl font-display font-bold">
                    {selectedOption ? "Checkout" : "Deposit"}
                </h2>
            </div>

            <AnimatePresence mode="wait">
                {!selectedOption ? (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Whop Payment Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <CreditCard className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                                    Whop Payment
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {DEPOSIT_OPTIONS.map((option, i) => (
                                    <motion.button
                                        key={option.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        onClick={() => setSelectedOption(option)}
                                        className={`relative group rounded-2xl p-4 text-left transition-all duration-200 active:scale-95 border overflow-hidden ${option.isFree
                                                ? "col-span-2 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border-emerald-500/30 hover:border-emerald-400/50"
                                                : "bg-card border-border/50 hover:border-primary/40 hover:bg-card/80"
                                            }`}
                                    >
                                        {/* Glow effect on hover */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${option.isFree
                                                ? "bg-gradient-to-br from-emerald-500/5 to-transparent"
                                                : "bg-gradient-to-br from-primary/5 to-transparent"
                                            }`} />

                                        <div className="relative z-10">
                                            {option.badge && (
                                                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${option.isFree
                                                        ? "bg-emerald-500/20 text-emerald-400"
                                                        : option.badge === "BEST VALUE"
                                                            ? "bg-primary/20 text-primary"
                                                            : "bg-blue-500/20 text-blue-400"
                                                    }`}>
                                                    {option.badge}
                                                </span>
                                            )}
                                            <div className={`text-2xl font-display font-bold ${option.isFree ? "text-emerald-400" : "text-white"
                                                }`}>
                                                {option.isFree ? "FREE" : option.label}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {option.isFree ? (
                                                    <>
                                                        <Sparkles className="w-3 h-3 inline mr-1 text-emerald-400" />
                                                        Get ₱{option.amount} bonus credits
                                                    </>
                                                ) : (
                                                    `Add ₱${option.amount.toLocaleString()} to balance`
                                                )}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* GCash Section - Coming Soon */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <Smartphone className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                                    GCash
                                </span>
                            </div>

                            <div className="relative rounded-2xl p-5 bg-card border border-border/50 overflow-hidden opacity-50">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <div className="text-lg font-display font-bold text-white/50">
                                            GCash
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            Direct GCash payments
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-full">
                                        <Lock className="w-3 h-3 text-blue-400" />
                                        <span className="text-xs font-semibold text-blue-400">Coming Soon</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security note */}
                        <div className="text-center pt-2">
                            <p className="text-[11px] text-muted-foreground/60">
                                🔒 All payments are securely processed by Whop
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="checkout"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        {/* Selected amount summary */}
                        <div className="bg-card rounded-2xl p-4 border border-border/50 flex items-center justify-between">
                            <div>
                                <div className="text-xs text-muted-foreground">Depositing</div>
                                <div className="text-xl font-display font-bold">
                                    {selectedOption.isFree ? "Free Bonus" : selectedOption.label}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground">Credits</div>
                                <div className="text-xl font-display font-bold text-emerald-400">
                                    +₱{selectedOption.amount.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Whop Checkout Embed */}
                        <div className="rounded-2xl overflow-hidden border border-border/50 bg-card">
                            <WhopCheckoutEmbed
                                planId={selectedOption.planId}
                                theme="dark"
                                onComplete={handleComplete}
                                prefill={user?.email ? { email: user.email } : undefined}
                                styles={{ container: { paddingX: 16, paddingY: 16 } }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
