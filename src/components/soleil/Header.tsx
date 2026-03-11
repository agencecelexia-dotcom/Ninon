"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Chat", icon: "💬" },
  { href: "/explore", label: "Explorer", icon: "🗺️" },
  { href: "/favorites", label: "Favoris", icon: "❤️" },
  { href: "/history", label: "Historique", icon: "🕐" },
  { href: "/settings", label: "Réglages", icon: "⚙️" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-soleil-indigo text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:animate-float">☀️</span>
            <span className="text-xl font-bold tracking-wide">SOLEIL</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile nav */}
          <nav className="md:hidden flex items-center gap-1">
            {NAV_ITEMS.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 rounded-lg text-lg transition-colors ${
                  pathname === item.href
                    ? "bg-white/15"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.icon}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
