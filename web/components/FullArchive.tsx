"use client";

import { useState } from "react";
import type { Headline } from "@/lib/types";
import { groupByYear } from "@/lib/data";

interface FullArchiveProps {
  headlines: Headline[];
  years: number[];
}

function YearSection({
  year,
  headlines,
}: {
  year: number;
  headlines: Headline[];
}) {
  return (
    <div className="mb-8">
      <h4 className="font-mono text-sm mb-4 pb-2 border-b-2 border-ink flex items-center gap-3">
        <span className="bg-ink text-cream px-2 py-0.5">{year}</span>
        <span className="text-muted">{headlines.length} headlines</span>
      </h4>
      <ul className="space-y-4">
        {headlines.map((h) => (
          <li key={h.url}>
            <a
              href={h.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <span className="font-serif text-lg leading-snug headline-link">
                {h.headline}
              </span>
              <span className="font-mono text-xs text-muted ml-2">
                {h.tag}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FullArchive({ headlines, years }: FullArchiveProps) {
  const [isOpen, setIsOpen] = useState(false);
  const grouped = groupByYear(headlines);
  const sortedYears = [...years].sort((a, b) => a - b);

  return (
    <section>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 border-t border-rule flex items-center justify-between group cursor-pointer hover:bg-highlight hover:text-cream transition-colors -mx-4 px-4"
      >
        <h2 className="font-mono text-sm uppercase tracking-wider">
          Full archive
          <span className="ml-2 text-muted normal-case tracking-normal">
            ({headlines.length})
          </span>
        </h2>
        <span className="font-mono text-2xl" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {isOpen && (
        <div className="pt-8">
          {sortedYears.map((year) => (
            <YearSection
              key={year}
              year={year}
              headlines={grouped[year] || []}
            />
          ))}
        </div>
      )}
    </section>
  );
}
