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
import Quantum11 from "@/pages/games/Quantum11";
import CelestialPath from "@/pages/games/CelestialPath";
import HarmonicWheel from "@/pages/games/HarmonicWheel";
import LifePathMatrix from "@/pages/games/LifePathMatrix";
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
        <Route path="/games/quantum11" component={Quantum11} />
        <Route path="/games/celestial-path" component={CelestialPath} />
        <Route path="/games/harmonic-wheel" component={HarmonicWheel} />
        <Route path="/games/matrix" component={LifePathMatrix} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </MobileLayout>
  );
}

function App() {
  useAuth();
  const { user } = useAppStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {!user ? <AuthPage /> : <Router />}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;