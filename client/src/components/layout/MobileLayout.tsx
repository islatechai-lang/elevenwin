import { Header } from "./Header";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] relative overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto hide-scrollbar">
        {children}
      </main>
    </div>
  );
}