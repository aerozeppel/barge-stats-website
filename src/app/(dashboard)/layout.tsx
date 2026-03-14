"use client";

import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { RequireAuth } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="flex h-screen bg-black overflow-hidden selection:bg-indigo-500/30">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-zinc-950/50 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto relative z-10 min-h-full">
            {children}
          </div>
        </main>

        {/* Mobile Nav (Bottom Bar) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950 border-t border-white/5 z-50 flex items-center justify-around px-2 pb-safe">
          <MobileNav />
        </div>
      </div>
    </RequireAuth>
  );
}
