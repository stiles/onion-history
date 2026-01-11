"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTodaySlug, formatDisplayDate } from "@/lib/dates";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import byDayData from "@/data/by-day.json";

export default function Home() {
  const [todaySlug, setTodaySlug] = useState<string | null>(null);
  const [todayDisplay, setTodayDisplay] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setTodaySlug(getTodaySlug());
    setTodayDisplay(formatDisplayDate(now.getMonth() + 1, now.getDate()));
  }, []);

  const data = byDayData as Record<string, { count: number; years: number[] }>;

  // Calculate stats
  const totalHeadlines = Object.values(data).reduce(
    (sum, d) => sum + d.count,
    0
  );
  const allYears = new Set<number>();
  Object.values(data).forEach((d) => d.years.forEach((y) => allYears.add(y)));
  const yearSpan = Math.max(...allYears) - Math.min(...allYears);

  return (
    <>
      <Header />
      <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl w-full">
          {/* Hero */}
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-6">
              An archive of <em className="text-highlight italic font-bold">The Onion</em> headlines
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-black mb-6 leading-none tracking-tight">
              ONION
              <br />
              <span className="italic font-normal">History</span>
            </h1>
            <p className="font-mono text-sm text-muted max-w-md mx-auto">
              {totalHeadlines.toLocaleString()} headlines. Zero facts. Lots of laughs.
            </p>
          </div>

          {/* Two choices */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Random */}
            <Link
              href="/random"
              className="block p-8 border-2 border-ink border-l-4 border-l-highlight hover:bg-highlight hover:border-highlight hover:text-cream transition-all group"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-muted group-hover:text-cream/70 mb-3">
                Discovery mode
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
                Random headline
              </h2>
              <p className="font-mono text-sm text-muted group-hover:text-cream/70">
                Guess the year or just browse the archive one headline at a time.
              </p>
            </Link>

            {/* On This Day */}
            {todaySlug ? (
              <Link
                href={`/${todaySlug}`}
                className="block p-8 border-2 border-ink border-l-4 border-l-highlight hover:bg-highlight hover:border-highlight hover:text-cream transition-all group"
              >
                <p className="font-mono text-xs uppercase tracking-wider text-muted group-hover:text-cream/70 mb-3">
                  On this day
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
                  {todayDisplay}
                </h2>
                <p className="font-mono text-sm text-muted group-hover:text-cream/70">
                  See every headline published on today's date across 30+ years.
                </p>
              </Link>
            ) : (
              <div className="block p-8 border-2 border-rule">
                <p className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
                  On this day
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3 text-muted">
                  Loading...
                </h2>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
