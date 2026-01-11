"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTodaySlug } from "@/lib/dates";

export function Header() {
  const [todaySlug, setTodaySlug] = useState<string | null>(null);

  useEffect(() => {
    setTodaySlug(getTodaySlug());
  }, []);

  return (
    <header className="border-b border-rule">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl font-black tracking-tight hover:text-highlight transition-colors"
        >
          ONION <span className="italic font-normal">History</span>
        </Link>
        <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
          {todaySlug && (
            <Link
              href={`/${todaySlug}`}
              className="text-muted hover:text-ink transition-colors"
            >
              Today
            </Link>
          )}
          <Link
            href="/random"
            className="text-muted hover:text-ink transition-colors"
          >
            Random
          </Link>
          <Link
            href="/about"
            className="text-muted hover:text-ink transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
