export const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

export type MonthName = (typeof MONTHS)[number];

export function monthNameToNumber(name: MonthName): number {
  return MONTHS.indexOf(name) + 1;
}

export function monthNumberToName(num: number): MonthName {
  return MONTHS[num - 1];
}

export function formatMonthDay(month: number, day: number): string {
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseSlug(slug: string): { month: number; day: number } | null {
  const match = slug.match(/^([a-z]+)-(\d+)$/);
  if (!match) return null;

  const monthName = match[1] as MonthName;
  const monthIndex = MONTHS.indexOf(monthName);
  if (monthIndex === -1) return null;

  const day = parseInt(match[2], 10);
  if (day < 1 || day > 31) return null;

  return { month: monthIndex + 1, day };
}

export function toSlug(month: number, day: number): string {
  return `${MONTHS[month - 1]}-${day}`;
}

export function formatDisplayDate(month: number, day: number): string {
  const monthName = MONTHS[month - 1];
  const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  return `${capitalized} ${day}`;
}

// Generate all valid date slugs (366 for leap years)
export function getAllDateSlugs(): string[] {
  const slugs: string[] = [];
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= daysInMonth[month - 1]; day++) {
      slugs.push(toSlug(month, day));
    }
  }

  return slugs;
}

export function getTodaySlug(): string {
  const now = new Date();
  return toSlug(now.getMonth() + 1, now.getDate());
}
