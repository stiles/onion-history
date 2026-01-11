import byDayData from "@/data/by-day.json";
import type { ByDayData, DayData, Headline } from "./types";

const data = byDayData as ByDayData;

export function getDayData(monthDay: string): DayData | null {
  return data[monthDay] || null;
}

export function getHighlights(dayData: DayData): {
  newest: Headline;
  oldest: Headline;
  fromTheArchive: Headline[];
} {
  const { headlines, years } = dayData;

  // Newest is first (already sorted desc by year)
  const newest = headlines[0];

  // Oldest is last
  const oldest = headlines[headlines.length - 1];

  // Pick headlines from different decades for variety
  const grouped = groupByYear(headlines);
  const decades = new Map<number, Headline[]>();

  for (const year of years) {
    const decade = Math.floor(year / 10) * 10;
    if (!decades.has(decade)) {
      decades.set(decade, []);
    }
    decades.get(decade)!.push(...grouped[year]);
  }

  // Get sorted decades (oldest first for archive feel)
  const sortedDecades = [...decades.keys()].sort((a, b) => a - b);

  // Exclude decades of newest and oldest to avoid duplication
  const newestDecade = Math.floor(newest.year / 10) * 10;
  const oldestDecade = Math.floor(oldest.year / 10) * 10;

  const availableDecades = sortedDecades.filter(
    (d) => d !== newestDecade && d !== oldestDecade
  );

  // Pick one headline from each available decade (up to 3)
  const fromTheArchive: Headline[] = [];
  const seed = dayData.count; // deterministic

  for (let i = 0; i < Math.min(3, availableDecades.length); i++) {
    const decade = availableDecades[i];
    const decadeHeadlines = decades.get(decade)!;
    const pickIndex = (seed * (i + 1)) % decadeHeadlines.length;
    fromTheArchive.push(decadeHeadlines[pickIndex]);
  }

  // If we don't have enough decades, fill from middle years
  if (fromTheArchive.length < 2 && headlines.length > 2) {
    const middle = headlines.slice(1, -1);
    const existingYears = new Set([
      newest.year,
      oldest.year,
      ...fromTheArchive.map((h) => h.year),
    ]);

    for (const h of middle) {
      if (!existingYears.has(h.year) && fromTheArchive.length < 3) {
        fromTheArchive.push(h);
        existingYears.add(h.year);
      }
    }
  }

  return { newest, oldest, fromTheArchive };
}

export function groupByYear(headlines: Headline[]): Record<number, Headline[]> {
  const groups: Record<number, Headline[]> = {};

  for (const h of headlines) {
    if (!groups[h.year]) {
      groups[h.year] = [];
    }
    groups[h.year].push(h);
  }

  return groups;
}

export function getAllMonthDays(): string[] {
  return Object.keys(data);
}
