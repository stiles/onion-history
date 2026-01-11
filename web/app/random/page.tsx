"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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

function getRandomHeadline(): Headline {
  return allHeadlines[Math.floor(Math.random() * allHeadlines.length)];
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

export default function RandomPage() {
  const [headline, setHeadline] = useState<Headline | null>(null);
  const [choices, setChoices] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  const newHeadline = useCallback(() => {
    const h = getRandomHeadline();
    setHeadline(h);
    setChoices(generateChoices(h.year));
    setSelected(null);
    setSkipped(false);
  }, []);

  useEffect(() => {
    newHeadline();
  }, [newHeadline]);

  const handleSelect = (year: number) => {
    if (selected !== null || skipped || !headline) return;
    setSelected(year);
    if (year === headline.year) {
      setScore((s) => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setScore((s) => ({ ...s, total: s.total + 1 }));
    }
  };

  const handleSkip = () => {
    if (selected !== null || skipped) return;
    setSkipped(true);
  };

  if (!headline) return null;

  const isRevealed = selected !== null || skipped;
  const isCorrect = selected === headline.year;

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight mb-4">
            Random headline
          </h1>
          <p className="font-mono text-sm text-muted">
            Guess the year, or skip to just browse.
          </p>
        </header>

        {/* Headline */}
        <section className="mb-8">
          <blockquote className="text-2xl md:text-3xl font-serif leading-tight mb-4">
            "{headline.headline}"
          </blockquote>
          <p className="font-mono text-sm text-muted">{headline.tag}</p>
        </section>

        {/* Choices */}
        {!isRevealed && (
          <section className="mb-8">
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
              onClick={handleSkip}
              className="font-mono text-sm text-muted hover:text-ink transition-colors"
            >
              Skip →
            </button>
          </section>
        )}

        {/* Result */}
        {isRevealed && (
          <section className="mb-8">
            {skipped ? (
              <p className="font-mono text-sm text-muted mb-6">
                Published in <span className="text-ink font-bold">{headline.year}</span>
              </p>
            ) : (
              <p className="font-mono text-sm mb-6">
                {isCorrect ? (
                  <span className="text-highlight font-bold">Correct!</span>
                ) : (
                  <span>
                    Nope — it was{" "}
                    <span className="font-bold">{headline.year}</span>
                  </span>
                )}
              </p>
            )}

            <div className="flex gap-4">
              <button onClick={newHeadline} className="btn-primary">
                Next →
              </button>
              <a
                href={headline.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm underline underline-offset-4 decoration-highlight hover:decoration-ink py-3"
              >
                Read article
              </a>
            </div>
          </section>
        )}

        {/* Score */}
        {score.total > 0 && (
          <section className="border-t border-rule pt-6">
            <p className="font-mono text-sm text-muted">
              Score: <span className="text-ink font-bold">{score.correct}</span>{" "}
              / {score.total}
            </p>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
