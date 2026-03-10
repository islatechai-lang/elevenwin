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
  },
  {
    id: "harmonic",
    name: "Imperial Wheel",
    description: "Imperial Multipliers",
    image: "/images/harmonic-cover.png",
    color: "from-amber-500/20 to-orange-600/20",
    path: "/games/harmonic-wheel",
    players: "1.2k"
  }
];

export default function Home() {
  return (
    <div className="space-y-6 px-4 pt-4 pb-8">
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
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-lg font-display tracking-tight text-primary">Earn Your Chips</h3>
          <Link href="/">
            <span className="text-xs font-bold text-primary flex items-center cursor-pointer uppercase tracking-wider hover:underline decoration-2 underline-offset-4 transition-all">
              See All <ChevronRight className="w-4 h-4 ml-0.5" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {GAMES.map((game, i) => (
            <Link key={game.id} href={game.path}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-xl border border-white/10"
              >
                {/* Game Image */}
                <img
                  src={game.image}
                  alt={game.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10" />

                {/* Badge (Hot) */}
                {game.badge && (
                  <div className="absolute top-3 left-3 z-20">
                    <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-rose-500 text-white uppercase tracking-wider shadow-[0_0_12px_rgba(244,63,94,0.5)]">
                      {game.badge}
                    </span>
                  </div>
                )}

                {/* Live players badge */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
                  <span className="text-[9px] text-white/80 font-bold">{game.players}</span>
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 z-10">
                  <h4 className="font-bold font-display text-sm text-white leading-tight mb-0.5">
                    {game.name}
                  </h4>
                  <p className="text-[10px] text-white/50 font-medium leading-tight">
                    {game.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}