import { useAppStore } from "@/lib/store";
import { LogOut, Settings, Shield, HelpCircle, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const { user, loginAsGuest } = useAppStore();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 pt-20">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-4xl border-2 border-primary border-dashed">
          👤
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-display font-bold">Welcome to Spin & Win</h2>
          <p className="text-muted-foreground">Log in to track your wins and compete on the leaderboard.</p>
        </div>
        
        <div className="w-full space-y-3 mt-8">
          <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold active:scale-95 transition-transform">
            Sign In
          </button>
          <button 
            onClick={loginAsGuest}
            className="w-full py-4 rounded-xl bg-secondary text-secondary-foreground font-bold active:scale-95 transition-transform"
          >
            Play as Guest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold">Profile</h2>

      <div className="bg-card rounded-3xl p-6 border border-border/50 material-shadow flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <img 
            src={user.avatar} 
            alt="Avatar" 
            className="w-24 h-24 rounded-full bg-secondary border-4 border-background shadow-lg"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-background rounded-full" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-display">{user.name}</h3>
          <p className="text-sm text-muted-foreground">ID: {user.id}</p>
        </div>
        
        <div className="flex gap-2 w-full pt-2">
          <div className="flex-1 bg-secondary/50 rounded-xl p-3">
            <div className="text-xs text-muted-foreground mb-1">VIP Level</div>
            <div className="font-bold text-primary flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4" /> Bronze
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-sm text-muted-foreground px-2">Settings & Security</h3>
        
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <ProfileMenuItem icon={Settings} label="Account Settings" />
          <div className="h-[1px] bg-border/50" />
          <ProfileMenuItem icon={Shield} label="Security & Verification" />
          <div className="h-[1px] bg-border/50" />
          <ProfileMenuItem icon={HelpCircle} label="Help & Support" />
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-destructive font-bold bg-destructive/10 active:bg-destructive/20 transition-colors">
        <LogOut className="w-5 h-5" /> Sign Out
      </button>

      <div className="text-center text-xs text-muted-foreground opacity-50 pt-4">
        App Version 1.0.0 (MVP)
      </div>
    </div>
  );
}

function ProfileMenuItem({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center justify-between p-4 active:bg-secondary/50 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-muted-foreground text-xl">›</div>
    </div>
  );
}