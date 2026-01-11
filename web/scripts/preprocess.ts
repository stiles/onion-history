import * as fs from "fs";
import * as path from "path";

interface RawHeadline {
  headline: string;
  url: string;
  tag: string;
  date?: string;
}

interface ProcessedHeadline {
  headline: string;
  url: string;
  tag: string;
  year: number;
}

interface DayData {
  headlines: ProcessedHeadline[];
  years: number[];
  count: number;
}

type ByDayData = Record<string, DayData>;

const INPUT_PATH = path.join(__dirname, "../../data/headlines.json");
const OUTPUT_PATH = path.join(__dirname, "../data/by-day.json");

function main() {
  console.log("Reading headlines...");
  const raw = fs.readFileSync(INPUT_PATH, "utf-8");
  const headlines: RawHeadline[] = JSON.parse(raw);

  console.log(`Total headlines: ${headlines.length}`);

  // Filter to only headlines with dates
  const withDates = headlines.filter((h) => h.date);
  console.log(`Headlines with dates: ${withDates.length}`);

  // Group by MM-DD
  const byDay: ByDayData = {};

  for (const h of withDates) {
    const date = new Date(h.date!);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const key = `${month}-${day}`;
    const year = date.getFullYear();

    if (!byDay[key]) {
      byDay[key] = { headlines: [], years: [], count: 0 };
    }

    byDay[key].headlines.push({
      headline: h.headline,
      url: h.url,
      tag: h.tag || "Uncategorized",
      year,
    });
  }

  // Sort each day's headlines by year descending, dedupe years
  for (const key of Object.keys(byDay)) {
    const data = byDay[key];
    data.headlines.sort((a, b) => b.year - a.year);
    data.years = [...new Set(data.headlines.map((h) => h.year))].sort(
      (a, b) => b - a
    );
    data.count = data.headlines.length;
  }

  // Stats
  const totalDays = Object.keys(byDay).length;
  const avgPerDay = Math.round(withDates.length / totalDays);
  const maxDay = Object.entries(byDay).reduce((max, [key, data]) =>
    data.count > max.count ? { key, count: data.count } : max,
    { key: "", count: 0 }
  );

  console.log(`\nStats:`);
  console.log(`  Days with headlines: ${totalDays}`);
  console.log(`  Average per day: ${avgPerDay}`);
  console.log(`  Most headlines: ${maxDay.key} (${maxDay.count})`);

  // Write output
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(byDay, null, 2));
  console.log(`\nWrote ${OUTPUT_PATH}`);
}

main();
