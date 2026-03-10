import { useState } from "react";
import { ArrowLeft, Sparkles, CreditCard, Smartphone, Lock, ChevronRight } from "lucide-react";
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

type Step = "method" | "amount" | "checkout";

export default function DepositPage() {
    const [step, setStep] = useState<Step>("method");
    const [selectedOption, setSelectedOption] = useState<DepositOption | null>(null);
    const [, navigate] = useLocation();
    const { updateBalance, addTransaction, user } = useAppStore();

    const handleComplete = async (planId: string) => {
        const option = DEPOSIT_OPTIONS.find((o) => o.planId === planId);
        if (option) {
            await updateBalance(option.amount);
            await addTransaction(option.amount, "deposit");
        }
        navigate("/wallet");
    };

    const handleBack = () => {
        if (step === "checkout") {
            setStep("amount");
            setSelectedOption(null);
        } else if (step === "amount") {
            setStep("method");
        }
    };

    return (
        <div className="min-h-screen px-4 pt-4 pb-8 space-y-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between">
                {step !== "method" ? (
                    <button
                        onClick={handleBack}
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
                    {step === "checkout" ? "Checkout" : step === "amount" ? "Select Amount" : "Add Funds"}
                </h2>
            </div>

            <div className="flex-1 relative">
                {/* Method Selection Step */}
                <AnimatePresence mode="sync">
                    {step === "method" && (
                        <motion.div
                            key="method"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4 absolute inset-0"
                        >
                            <div className="text-sm text-muted-foreground mb-2">Choose your way to play</div>

                            {/* Whop/Card Option */}
                            <button
                                onClick={() => setStep("amount")}
                                className="w-full relative group rounded-2xl p-5 text-left transition-all duration-200 active:scale-95 border border-border/50 bg-card hover:border-primary/40 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <CreditCard className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-display font-bold text-lg text-white">Credit or Debit Card</h3>
                                            <p className="text-xs text-muted-foreground mt-0.5">Instant secure deposit</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </div>
                            </button>

                            {/* GCash Option */}
                            <div className="w-full relative rounded-2xl p-5 text-left border border-border/50 bg-card opacity-50 cursor-not-allowed overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                            <Smartphone className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-display font-bold text-lg text-white/50">GCash</h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <Lock className="w-3 h-3 text-blue-400" />
                                                <span className="text-xs font-semibold text-blue-400">Coming Soon</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Amount Selection Step */}
                <AnimatePresence mode="sync">
                    {step === "amount" && (
                        <motion.div
                            key="amount"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 absolute inset-0"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                {DEPOSIT_OPTIONS.map((option, i) => (
                                    <motion.button
                                        key={option.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => {
                                            setSelectedOption(option);
                                            setStep("checkout");
                                        }}
                                        className={`relative group rounded-2xl p-4 text-left transition-all duration-200 active:scale-95 border overflow-hidden ${option.isFree
                                            ? "col-span-2 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border-emerald-500/30 hover:border-emerald-400/50"
                                            : "bg-card border-border/50 hover:border-primary/40 hover:bg-card/80"
                                            }`}
                                    >
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
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Checkout Step - Removed from AnimatePresence completely to avoid z-index/remount issues with the iframe */}
                <div
                    className={`space-y-4 transition-all duration-300 ${step === "checkout" ? "opacity-100 pointer-events-auto relative z-10 block" : "opacity-0 pointer-events-none absolute inset-0 hidden"}`}
                >
                    {selectedOption && (
                        <>
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
                            <div className="rounded-2xl overflow-hidden border border-border/50 bg-card relative z-50">
                                <WhopCheckoutEmbed
                                    planId={selectedOption.planId}
                                    theme="dark"
                                    onComplete={handleComplete}
                                    prefill={user?.email ? { email: user.email } : undefined}
                                    styles={{ container: { paddingX: 16, paddingY: 16 } }}
                                />
                            </div>

                            {/* Security note */}
                            <div className="text-center pt-2">
                                <p className="text-[11px] text-muted-foreground/60">
                                    🔒 All payments are securely processed by Whop
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
