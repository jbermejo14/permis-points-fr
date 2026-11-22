'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, ShieldAlert, Award } from 'lucide-react';
import { SECTION_NAME } from '@/lib/site';

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('ododex-theme', next);
    } catch {
      // Ignorer si localStorage inaccessible
    }
  };

  return (
    <header className="border-b border-line bg-surface/85 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <a href="/fr" className="font-extrabold text-lg tracking-tight text-fg hover:text-accent transition-colors">
            Ododex
          </a>
          <span className="text-line font-light">/</span>
          <Link href="/" className="font-semibold text-sm text-secondary hover:text-fg transition-colors flex items-center gap-1.5">
            <Award className="w-4 h-4 text-accent" />
            <span>{SECTION_NAME}</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-secondary">
          <Link href="/" className="hover:text-fg transition-colors">
            Simulateur
          </Link>
          <Link href="/infractions" className="hover:text-fg transition-colors">
            Barème des infractions
          </Link>
          <a href="#stages" className="hover:text-fg transition-colors">
            Stages agréés (+4 pts)
          </a>
          <a href="#guides" className="hover:text-fg transition-colors">
            Guides & MesPointsPermis
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#stages"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Sauver mes points</span>
          </a>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Changer le thème"
            className="p-2 rounded-lg text-secondary hover:text-fg hover:bg-elevated transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-warning" />}
          </button>
        </div>
      </div>
    </header>
  );
}
