import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { MobileLayout } from "./components/layout/MobileLayout";
import Home from "./pages/Home";
import Slots from "./pages/games/Slots";
import Dice from "./pages/games/Dice";
import Plinko from "./pages/games/Plinko";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";

function Router() {
  return (
    <MobileLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/games" component={Home} /> {/* List of games is on home */}
        <Route path="/games/slots" component={Slots} />
        <Route path="/games/dice" component={Dice} />
        <Route path="/games/plinko" component={Plinko} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </MobileLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;