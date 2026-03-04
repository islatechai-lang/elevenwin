import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Gamepad2, Coins, TrendingUp } from "lucide-react";

const GAMES = [
  {
    id: "slots",
    name: "Classic Slots",
    description: "Spin to win big multipliers",
    image: "/images/slots-cover.png",
    color: "from-purple-500/20 to-indigo-600/20",
    path: "/games/slots",
    players: "1.2k"
  },
  {
    id: "dice",
    name: "Over / Under",
    description: "Predict the dice roll",
    image: "/images/dice-cover.png",
    color: "from-emerald-500/20 to-teal-600/20",
    path: "/games/dice",
    players: "850"
  },
  {
    id: "plinko",
    name: "Plinko Drop",
    description: "Watch the ball fall",
    image: "/images/plinko-cover.png",
    color: "from-rose-500/20 to-pink-600/20",
    path: "/games/plinko",
    players: "2.1k",
    badge: "Hot"
  }
];

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/80 to-primary text-primary-foreground p-6 shadow-xl"
      >
        <div className="relative z-10">
          <h2 className="text-2xl font-display font-bold mb-1 italic">JACKPOT SEASON!</h2>
          <p className="text-sm opacity-90 mb-5 max-w-[200px]">Get up to ₱5,000 on your first deposit today.</p>
          <button className="bg-background text-foreground px-6 py-2.5 rounded-full text-sm font-bold shadow-lg active:scale-95 transition-transform">
            Claim Bonus
          </button>
        </div>
        <div className="absolute right-0 bottom-0 text-8xl opacity-20 -mb-4 -mr-4 transform rotate-12">
          💰
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3 material-shadow">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Total Won</div>
            <div className="font-bold text-lg">₱12.4M</div>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3 material-shadow">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Online</div>
            <div className="font-bold text-lg">4,281</div>
          </div>
        </div>
      </div>

      {/* Game Selection */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-xl font-display tracking-tight">Featured Games</h3>
          <Link href="/games">
            <span className="text-xs font-bold text-primary flex items-center cursor-pointer uppercase tracking-widest">
              View All <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        <div className="space-y-6">
          {GAMES.map((game, i) => (
            <Link key={game.id} href={game.path}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-[2rem] border border-border/50 shadow-lg active:scale-[0.97] transition-all cursor-pointer relative overflow-hidden group"
              >
                {/* Game Image Header */}
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={game.image} 
                    alt={game.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  
                  {game.badge && (
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-black px-3 py-1 rounded-full bg-destructive text-destructive-foreground uppercase tracking-widest shadow-lg">
                        {game.badge}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <h4 className="font-black font-display text-2xl uppercase italic tracking-tighter text-white drop-shadow-md">
                        {game.name}
                      </h4>
                      <p className="text-xs text-white/80 font-medium drop-shadow-sm">{game.description}</p>
                    </div>
                    <div className="bg-emerald-500/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-lg border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span className="text-[10px] text-white font-bold">{game.players}</span>
                    </div>
                  </div>
                </div>

                {/* Footer simple arrow */}
                <div className="px-6 py-3 flex justify-end items-center text-primary">
                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="w-5 h-5" />
                   </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}