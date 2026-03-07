import { Switch, Route } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { MobileLayout } from "@/components/layout/MobileLayout";
import Home from "@/pages/Home";
import Slots from "@/pages/games/Slots";
import Dice from "@/pages/games/Dice";
import Plinko from "@/pages/games/Plinko";
import HarmonicWheel from "@/pages/games/HarmonicWheel";
import Wallet from "@/pages/Wallet";
import Profile from "@/pages/Profile";

import { useAppStore } from "@/lib/store";
import AuthPage from "@/pages/AuthPage";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  return (
    <MobileLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/games" component={Home} />
        <Route path="/games/slots" component={Slots} />
        <Route path="/games/dice" component={Dice} />
        <Route path="/games/plinko" component={Plinko} />
        <Route path="/games/harmonic-wheel" component={HarmonicWheel} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </MobileLayout>
  );
}

function App() {
  useAuth();
  const { user, isAuthLoading } = useAppStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {isAuthLoading ? (
          <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : !user ? (
          <AuthPage />
        ) : (
          <Router />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;