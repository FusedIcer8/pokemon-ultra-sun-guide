'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Search, Menu, X, Heart, BookOpen, Map, Backpack, Lightbulb, HelpCircle, Star } from 'lucide-react';

const NAV = [
  { href: '/story', label: 'Story', icon: BookOpen },
  { href: '/pokemon', label: 'Pokemon', icon: Star },
  { href: '/routes', label: 'Routes', icon: Map },
  { href: '/items', label: 'Items', icon: Backpack },
  { href: '/tips', label: 'Tips', icon: Lightbulb },
  { href: '/unstuck', label: 'Help', icon: HelpCircle },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-lg border-b border-[#E5E2DB]">
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <span className="text-xl">☀️</span>
          <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Ultra Sun Guide
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/search"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E2DB] text-sm text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search</span>
          </Link>
          <Link href="/favorites" className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Heart size={16} />
          </Link>
          <button
            className="md:hidden p-2 rounded-full text-gray-500 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-[#E5E2DB] shadow-lg p-4 space-y-1 animate-fadein">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                pathname.startsWith(href) ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
