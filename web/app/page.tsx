import Link from "next/link";
import { getTodaySlug, formatDisplayDate } from "@/lib/dates";
import byDayData from "@/data/by-day.json";

export default function Home() {
  const todaySlug = getTodaySlug();
  const now = new Date();
  const todayDisplay = formatDisplayDate(now.getMonth() + 1, now.getDate());
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
    <main className="min-h-screen">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-8">
          {yearSpan}+ years of online satire, indexed
        </p>
        
        <h1 className="font-serif text-6xl md:text-8xl font-black mb-8 leading-none tracking-tight">
          ONION<br />
          <span className="italic font-normal">History</span>
        </h1>
        
        <p className="font-mono text-sm text-muted mb-12 max-w-md">
          Browse {totalHeadlines.toLocaleString()} headlines by date.<br />
          Every day is a good day to remember what didn't happen.
        </p>

        <Link href={`/${todaySlug}`} className="btn-primary">
          {todayDisplay} →
        </Link>

        <p className="font-mono text-xs text-muted mt-6">
          (That's today)
        </p>
      </section>
    </main>
  );
}
