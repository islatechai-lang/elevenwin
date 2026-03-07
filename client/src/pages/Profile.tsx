import { useAppStore } from "@/lib/store";
import { LogOut, Settings, Shield, HelpCircle, Trophy, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export default function Profile() {
  const { user } = useAppStore();
  const { login, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 pt-20 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-4xl border-2 border-primary/30 border-dashed"
        >
          👤
        </motion.div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-display font-bold">Sacred Profile</h2>
          <p className="text-muted-foreground text-sm">Sign in to sync your chips and track your path to 11.</p>
        </div>

        <div className="w-full space-y-3 mt-8">
          <button
            onClick={login}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-primary/20"
          >
            <LogIn className="w-5 h-5" />
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-display font-bold">Your Profile</h2>

      <div className="bg-card rounded-[2.5rem] p-8 border border-border/50 shadow-xl flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <img
            src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
            alt="Avatar"
            className="w-24 h-24 rounded-full bg-secondary border-4 border-background shadow-2xl"
          />
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-card rounded-full" />
        </div>
        <div>
          <h3 className="text-2xl font-bold font-display tracking-tight">{user.displayName || 'Seeker'}</h3>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest opacity-50 mt-1">UID: {user.uid.substring(0, 12)}...</p>
        </div>

        <div className="flex gap-2 w-full pt-4">
          <div className="flex-1 bg-secondary/30 rounded-2xl p-4 border border-border/50">
            <div className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground mb-1">Rank</div>
            <div className="font-bold text-primary flex items-center justify-center gap-1.5 italic">
              <Trophy className="w-4 h-4" /> MASTER 11
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground px-4">Temple Settings</h3>

        <div className="bg-card rounded-[2rem] border border-border/50 overflow-hidden shadow-lg">
          <ProfileMenuItem icon={Settings} label="Governance" />
          <div className="h-[1px] bg-border/50 mx-4" />
          <ProfileMenuItem icon={Shield} label="Security Protocol" />
          <div className="h-[1px] bg-border/50 mx-4" />
          <ProfileMenuItem icon={HelpCircle} label="Sanctuary Support" />
          <div className="h-[1px] bg-border/50 mx-4" />
          <div
            onClick={logout}
            className="flex items-center justify-between p-5 active:bg-destructive/10 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <span className="font-bold text-sm text-destructive">Sign Out</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-30 pt-4">
        ElevenWin Protocol v1.11.0
      </div>
    </div>
  );
}

function ProfileMenuItem({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center justify-between p-5 active:bg-secondary/30 transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <span className="font-bold text-sm">{label}</span>
      </div>
      <div className="text-muted-foreground/30 text-xl font-light group-hover:text-primary transition-colors">›</div>
    </div>
  );
}