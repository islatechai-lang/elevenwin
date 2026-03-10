import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { ArrowDownToLine, ArrowUpFromLine, Coins, Plus, History, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";

export default function Wallet() {
  const { balance, transactions } = useAppStore();
  const [, navigate] = useLocation();

  return (
    <div className="space-y-6 px-4 pt-4 pb-8">
      <div className="flex items-center justify-between">
        <Link href="/">
          <button className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </button>
        </Link>
        <h2 className="text-2xl font-display font-bold">Wallet</h2>
      </div>

      <div className="bg-gradient-to-br from-primary/90 to-primary rounded-3xl p-6 text-primary-foreground shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-sm font-medium opacity-90 mb-1">Total Balance</div>
          <div className="text-4xl font-display font-bold mb-6 flex items-center gap-2">
            <Coins className="w-8 h-8 opacity-80" />
            ₱{balance.toLocaleString()}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/deposit")}
              className="flex-1 bg-background text-foreground rounded-xl py-3 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" /> Top Up
            </button>
            <button className="flex-1 bg-black/20 text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
              <ArrowUpFromLine className="w-4 h-4" /> Withdraw
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/10 rounded-full blur-xl" />
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg font-display flex items-center gap-2">
          <History className="w-5 h-5 text-muted-foreground" />
          Recent Transactions
        </h3>

        {transactions.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground bg-card rounded-2xl border border-border/50 border-dashed">
            <Coins className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={tx.id}
                className="bg-card p-4 rounded-2xl flex items-center justify-between border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'win' ? 'bg-emerald-500/10 text-emerald-500' :
                    tx.type === 'loss' ? 'bg-destructive/10 text-destructive' :
                      'bg-primary/10 text-primary'
                    }`}>
                    {tx.type === 'win' ? <ArrowDownToLine className="w-5 h-5" /> :
                      tx.type === 'loss' ? <ArrowUpFromLine className="w-5 h-5" /> :
                        <Plus className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold capitalize">{tx.type}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(tx.date?.toDate ? tx.date.toDate() : new Date(tx.date), "MMM d, h:mm a")}
                    </div>
                  </div>
                </div>

                <div className={`font-bold ${tx.type === 'loss' ? 'text-destructive' : 'text-emerald-500'
                  }`}>
                  {tx.type === 'loss' ? '-' : '+'}₱{tx.amount.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}