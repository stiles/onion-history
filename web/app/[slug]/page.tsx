import { notFound } from "next/navigation";
import Link from "next/link";
import { getDayData, getHighlights } from "@/lib/data";
import {
  parseSlug,
  formatMonthDay,
  formatDisplayDate,
  getAllDateSlugs,
} from "@/lib/dates";
import { Highlights } from "@/components/Highlights";
import { FullArchive } from "@/components/FullArchive";
import { DayNav } from "@/components/DayNav";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllDateSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: "Not Found" };

  const displayDate = formatDisplayDate(parsed.month, parsed.day);
  const title = `${displayDate} — Onion History`;
  const description = `Browse Onion headlines published on ${displayDate} across 30+ years`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://onionhistory.com/${slug}`,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function DayPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  const monthDay = formatMonthDay(parsed.month, parsed.day);
  const dayData = getDayData(monthDay);
  if (!dayData) notFound();

  const displayDate = formatDisplayDate(parsed.month, parsed.day);
  const highlights = getHighlights(dayData);
  const oldestYear = dayData.years[dayData.years.length - 1];
  const newestYear = dayData.years[0];

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        <header className="mb-12 md:mb-16">
          <p className="section-label mb-4">On this day</p>
          <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight mb-4">
            {displayDate}
          </h1>
          <p className="font-mono text-sm text-muted">
            {dayData.count} headlines · {dayData.years.length} years · {oldestYear}–{newestYear}
          </p>
        </header>

        <Highlights
          newest={highlights.newest}
          oldest={highlights.oldest}
          fromTheArchive={highlights.fromTheArchive}
        />

        <FullArchive headlines={dayData.headlines} years={dayData.years} />

        <DayNav month={parsed.month} day={parsed.day} />
      </main>
      <Footer />
    </>
  );
}
