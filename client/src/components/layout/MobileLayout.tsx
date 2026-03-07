import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20 pt-4 px-4 hide-scrollbar">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}