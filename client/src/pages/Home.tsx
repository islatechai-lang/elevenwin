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
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-xl font-display tracking-tight uppercase italic text-primary">Earn Your Chips</h3>
          <Link href="/">
            <span className="text-xs font-bold text-primary flex items-center cursor-pointer uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all">
              See All <ChevronRight className="w-4 h-4 ml-0.5" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {GAMES.map((game, i) => (
            <Link key={game.id} href={game.path}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-[2rem] aspect-[4/5] sm:aspect-[16/9] shadow-2xl border border-white/10 material-shadow"
              >
                {/* Game Image */}
                <img
                  src={game.image}
                  alt={game.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge (Hot) */}
                {game.badge && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="text-[10px] font-black px-3 py-1 rounded-full bg-rose-500 text-white uppercase tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                      {game.badge}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 z-10">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-black font-display text-xl sm:text-2xl uppercase italic tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {game.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] sm:text-xs text-white/70 font-medium uppercase tracking-widest">{game.description}</p>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                        <span className="text-[10px] text-white/90 font-bold">{game.players}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simple hover indicator */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}