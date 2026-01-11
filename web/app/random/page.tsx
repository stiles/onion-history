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

  // Add 4 random wrong years
  while (choices.size < 5) {
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
  const [score, setScore] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  const newHeadline = useCallback(() => {
    const h = getRandomHeadline();
    setHeadline(h);
    setChoices(generateChoices(h.year));
    setSelected(null);
  }, []);

  useEffect(() => {
    newHeadline();
  }, [newHeadline]);

  const handleSelect = (year: number) => {
    if (selected !== null || !headline) return;
    setSelected(year);
    if (year === headline.year) {
      setScore((s) => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setScore((s) => ({ ...s, total: s.total + 1 }));
    }
  };

  if (!headline) return null;

  const isRevealed = selected !== null;
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
            Can you guess when The Onion published this headline?
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
        <section className="mb-8">
          <div className="grid grid-cols-5 gap-2">
            {choices.map((year) => {
              let className =
                "py-3 font-mono text-sm border-2 transition-all cursor-pointer ";

              if (!isRevealed) {
                className += "border-ink hover:bg-highlight hover:text-cream hover:border-highlight";
              } else if (year === headline.year) {
                className += "bg-highlight text-cream border-highlight";
              } else if (year === selected) {
                className += "bg-ink text-cream border-ink";
              } else {
                className += "border-rule text-muted";
              }

              return (
                <button
                  key={year}
                  onClick={() => handleSelect(year)}
                  disabled={isRevealed}
                  className={className}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </section>

        {/* Result */}
        {isRevealed && (
          <section className="mb-8">
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
