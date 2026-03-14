"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/barge", label: "Dashboard", icon: LayoutDashboard },
  { href: "/barge/usage", label: "Usage", icon: TrendingDown },
  { href: "/barge/prices", label: "Prices", icon: BarChart3 },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/barge");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              isActive ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}
