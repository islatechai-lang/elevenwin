import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Gamepad2, Coins, TrendingUp } from "lucide-react";

const GAMES = [
  {
    id: "slots",
    name: "Classic Slots",
    description: "Spin to win big multipliers",
    icon: "🎰",
    color: "from-purple-500 to-indigo-600",
    path: "/games/slots",
    players: "1.2k"
  },
  {
    id: "dice",
    name: "Over / Under",
    description: "Predict the dice roll",
    icon: "🎲",
    color: "from-emerald-500 to-teal-600",
    path: "/games/dice",
    players: "850"
  },
  {
    id: "plinko",
    name: "Plinko Drop",
    description: "Watch the ball fall",
    icon: "🎯",
    color: "from-rose-500 to-pink-600",
    path: "/games/plinko",
    players: "2.1k",
    badge: "Hot"
  }
];

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/80 to-primary text-primary-foreground p-5 shadow-lg"
      >
        <div className="relative z-10">
          <h2 className="text-2xl font-display font-bold mb-1">Welcome Bonus!</h2>
          <p className="text-sm opacity-90 mb-4">Get up to ₱5,000 on your first deposit.</p>
          <button className="bg-background text-foreground px-4 py-2 rounded-full text-sm font-bold shadow-md active:scale-95 transition-transform">
            Claim Now
          </button>
        </div>
        <div className="absolute right-0 bottom-0 text-7xl opacity-20 -mb-4 -mr-4 transform rotate-12">
          🎁
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-xl p-3 border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total Won</div>
            <div className="font-bold">₱12.4M</div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-3 border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Online Now</div>
            <div className="font-bold">4,281</div>
          </div>
        </div>
      </div>

      {/* Game Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-lg font-display">Featured Games</h3>
          <Link href="/games">
            <span className="text-sm text-primary flex items-center cursor-pointer">
              See all <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        <div className="space-y-3">
          {GAMES.map((game, i) => (
            <Link key={game.id} href={game.path}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-4 border border-border shadow-sm active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-inner`}>
                    {game.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold font-display text-lg">{game.name}</h4>
                      {game.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground">
                          {game.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                  </div>
                </div>
                <div className="absolute right-4 bottom-4 flex items-center gap-1 text-xs text-muted-foreground font-medium z-10">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {game.players}
                </div>
                
                {/* Decorative background element */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}