"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, TrendingDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const navItems = [
  { href: "/barge", label: "Dashboard", icon: LayoutDashboard },
  { href: "/barge/usage", label: "Usage Reports", icon: TrendingDown },
  { href: "/barge/prices", label: "Prices & Margins", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col w-64 h-full bg-zinc-950 border-r border-white/5 p-4">
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
        </div>
        <span className="font-bold text-lg tracking-tight text-zinc-100">Barge Stats</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
                isActive
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          onClick={() => {
            logout();
            window.location.href = "/barge/login";
          }}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium group"
        >
          <LogOut className="w-5 h-5 text-zinc-500 group-hover:text-red-400" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
