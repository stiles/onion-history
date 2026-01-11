import Link from "next/link";
import { toSlug, formatDisplayDate } from "@/lib/dates";

interface DayNavProps {
  month: number;
  day: number;
}

function getPrevDay(month: number, day: number): { month: number; day: number } {
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (day > 1) {
    return { month, day: day - 1 };
  }

  const prevMonth = month === 1 ? 12 : month - 1;
  return { month: prevMonth, day: daysInMonth[prevMonth - 1] };
}

function getNextDay(month: number, day: number): { month: number; day: number } {
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (day < daysInMonth[month - 1]) {
    return { month, day: day + 1 };
  }

  const nextMonth = month === 12 ? 1 : month + 1;
  return { month: nextMonth, day: 1 };
}

export function DayNav({ month, day }: DayNavProps) {
  const prev = getPrevDay(month, day);
  const next = getNextDay(month, day);

  return (
    <nav className="flex items-center justify-between py-6 mt-12 -mx-4 px-4">
      <Link
        href={`/${toSlug(prev.month, prev.day)}`}
        className="font-mono text-sm hover:bg-highlight hover:text-cream px-3 py-2 -ml-3 transition-colors"
      >
        ← {formatDisplayDate(prev.month, prev.day)}
      </Link>
      <Link
        href={`/${toSlug(next.month, next.day)}`}
        className="font-mono text-sm hover:bg-highlight hover:text-cream px-3 py-2 -mr-3 transition-colors"
      >
        {formatDisplayDate(next.month, next.day)} →
      </Link>
    </nav>
  );
}
