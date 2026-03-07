import { Header } from "./Header";
import { useLocation } from "wouter";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [location] = useLocation();
  const isGamePage = location.startsWith("/games/");

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] relative overflow-hidden">
      {!isGamePage && <Header />}
      <main className={`flex-1 overflow-y-auto hide-scrollbar ${isGamePage ? '' : ''}`}>
        {children}
      </main>
    </div>
  );
}