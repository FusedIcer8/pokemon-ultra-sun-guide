'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Search, Menu, X, Heart, BookOpen, Map, Backpack, Lightbulb, HelpCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NAV_LINKS = [
  { href: '/story', label: 'Story', icon: BookOpen },
  { href: '/pokemon', label: 'Pokemon', icon: Star },
  { href: '/routes', label: 'Routes', icon: Map },
  { href: '/items', label: 'Items', icon: Backpack },
  { href: '/tips', label: 'Tips', icon: Lightbulb },
  { href: '/unstuck', label: 'Help', icon: HelpCircle },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[var(--nav-height)] bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0 hover:opacity-80 transition-opacity">
          <span className="text-2xl">☀️</span>
          <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Ultra Sun Guide
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname.startsWith(href)
                  ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/search">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
              <Search size={14} />
              <span className="hidden sm:inline text-xs text-gray-400">Search...</span>
              <kbd className="hidden lg:inline text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </kbd>
            </Button>
          </Link>
          <Link href="/favorites">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart size={16} />
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                {open ? <X size={18} /> : <Menu size={18} />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      pathname.startsWith(href)
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                ))}
                <Link
                  href="/favorites"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50"
                >
                  <Heart size={18} />
                  Favorites
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
