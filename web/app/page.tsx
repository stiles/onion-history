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
      <main className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-8">
            {yearSpan}+ years of satire, indexed
          </p>

          <h1 className="font-serif text-6xl md:text-8xl font-black mb-8 leading-none tracking-tight">
            ONION
            <br />
            <span className="italic font-normal">History</span>
          </h1>

          <p className="font-mono text-sm text-muted mb-12 max-w-md mx-auto">
            Browse {totalHeadlines.toLocaleString()} headlines by date.
            <br />
            Every day is a good day to remember what didn't happen.
          </p>

          {todaySlug ? (
            <Link href={`/${todaySlug}`} className="btn-primary">
              {todayDisplay} →
            </Link>
          ) : (
            <span className="btn-primary opacity-50">Loading...</span>
          )}

          <p className="font-mono text-xs text-muted mt-6">(That's today)</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
