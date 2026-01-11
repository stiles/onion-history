"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { generateHeadlineSlug, parseHeadlineSlug } from "@/lib/slug";
import byDayData from "@/data/by-day.json";

interface Headline {
  headline: string;
  url: string;
  tag: string;
  year: number;
}

type ByDayData = Record<
  string,
  { headlines: Headline[]; years: number[]; count: number }
>;

const data = byDayData as ByDayData;

// Flatten all headlines into one array
const allHeadlines: Headline[] = Object.values(data).flatMap(
  (d) => d.headlines
);

// Get unique years
const allYears = [...new Set(allHeadlines.map((h) => h.year))].sort(
  (a, b) => a - b
);

function getRandomIndex(): number {
  return Math.floor(Math.random() * allHeadlines.length);
}

function generateChoices(correctYear: number): number[] {
  const choices = new Set<number>([correctYear]);

  // Add 2 random wrong years (3 total)
  while (choices.size < 3) {
    const randomYear = allYears[Math.floor(Math.random() * allYears.length)];
    choices.add(randomYear);
  }

  // Shuffle
  return [...choices].sort(() => Math.random() - 0.5);
}

type Mode = "browse" | "game";

export default function RandomPage() {
  const [mode, setMode] = useState<Mode>("browse");
  const [headlineIndex, setHeadlineIndex] = useState<number | null>(null);
  const [choices, setChoices] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  const loadHeadline = useCallback((index: number) => {
    setHeadlineIndex(index);
    setChoices(generateChoices(allHeadlines[index].year));
    setSelected(null);
    setCopied(false);
    // Update URL hash with semantic slug
    const slug = generateHeadlineSlug(allHeadlines[index].headline, index);
    window.history.replaceState(null, "", `/random#${slug}`);
  }, []);

  const newHeadline = useCallback(() => {
    loadHeadline(getRandomIndex());
  }, [loadHeadline]);

  useEffect(() => {
    // Check for hash on load
    const hash = window.location.hash.slice(1);
    if (hash) {
      const index = parseHeadlineSlug(hash);
      if (index !== null && index >= 0 && index < allHeadlines.length) {
        loadHeadline(index);
        return;
      }
    }
    newHeadline();
  }, [loadHeadline, newHeadline]);

  const handleSelect = (year: number) => {
    if (selected !== null || headlineIndex === null) return;
    setSelected(year);
    const headline = allHeadlines[headlineIndex];
    if (year === headline.year) {
      setScore((s) => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setScore((s) => ({ ...s, total: s.total + 1 }));
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setScore({ correct: 0, total: 0 });
    setSelected(null);
  };

  if (headlineIndex === null) return null;

  const headline = allHeadlines[headlineIndex];
  const isCorrect = selected === headline.year;

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        {/* Mode Toggle */}
        <div className="mb-8 max-w-[200px]">
          <p className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
            Mode
          </p>
          <div className="flex border-2 border-ink">
            <button
              onClick={() => switchMode("browse")}
              className={`flex-1 px-4 py-2 font-mono text-sm transition-colors ${
                mode === "browse"
                  ? "bg-ink text-cream"
                  : "bg-cream text-ink hover:bg-rule"
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => switchMode("game")}
              className={`flex-1 px-4 py-2 font-mono text-sm border-l-2 border-ink transition-colors ${
                mode === "game"
                  ? "bg-ink text-cream"
                  : "bg-cream text-ink hover:bg-rule"
              }`}
            >
              Game
            </button>
          </div>
        </div>

        {/* Tag */}
        <p className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
          {headline.tag}
        </p>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-serif leading-tight mb-2">
          {headline.headline}
        </h1>

        {/* BROWSE MODE */}
        {mode === "browse" && (
          <>
            <p className="font-mono text-sm text-muted mb-8">
              {headline.year}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button onClick={newHeadline} className="btn-primary">
                Next →
              </button>
              <a
                href={headline.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm underline underline-offset-4 decoration-highlight hover:decoration-ink"
              >
                Read article
              </a>
              <button
                onClick={handleCopyLink}
                className="font-mono text-sm text-muted hover:text-ink transition-colors"
              >
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
          </>
        )}

        {/* GAME MODE */}
        {mode === "game" && (
          <>
            {selected === null ? (
              <>
                <p className="font-mono text-sm text-muted mb-6">
                  When was this published?
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {choices.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleSelect(year)}
                      className="py-3 font-mono text-sm border-2 border-ink hover:bg-highlight hover:text-cream hover:border-highlight transition-all cursor-pointer"
                    >
                      {year}
                    </button>
                  ))}
                </div>
                <button
                  onClick={newHeadline}
                  className="font-mono text-sm text-muted hover:text-ink transition-colors"
                >
                  Skip →
                </button>
              </>
            ) : (
              <>
                <p className="font-mono text-sm mb-6">
                  {isCorrect ? (
                    <span className="text-highlight font-bold">
                      Correct! It was {headline.year}.
                    </span>
                  ) : (
                    <span>
                      Nope — it was{" "}
                      <span className="font-bold">{headline.year}</span>
                    </span>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button onClick={newHeadline} className="btn-primary">
                    Next →
                  </button>
                  <a
                    href={headline.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm underline underline-offset-4 decoration-highlight hover:decoration-ink"
                  >
                    Read article
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="font-mono text-sm text-muted hover:text-ink transition-colors"
                  >
                    {copied ? "Copied!" : "Share"}
                  </button>
                </div>
              </>
            )}

            {/* Score */}
            {score.total > 0 && (
              <div className="border-t border-rule pt-6 mt-8">
                <p className="font-mono text-sm text-muted">
                  Score: <span className="text-ink font-bold">{score.correct}</span>{" "}
                  / {score.total}
                </p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
