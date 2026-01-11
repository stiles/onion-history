"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import byDayData from "@/data/by-day.json";

interface Headline {
  headline: string;
  url: string;
  tag: string;
  year: number;
}

type ByDayData = Record<string, { headlines: Headline[]; years: number[]; count: number }>;

const data = byDayData as ByDayData;

// Flatten all headlines into one array
const allHeadlines: Headline[] = Object.values(data).flatMap((d) => d.headlines);

// Get year range
const allYears = [...new Set(allHeadlines.map((h) => h.year))].sort((a, b) => a - b);
const minYear = allYears[0];
const maxYear = allYears[allYears.length - 1];

function getRandomHeadline(): Headline {
  return allHeadlines[Math.floor(Math.random() * allHeadlines.length)];
}

export default function RandomPage() {
  const [headline, setHeadline] = useState<Headline | null>(null);
  const [guess, setGuess] = useState<number>(2010);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  const newHeadline = useCallback(() => {
    setHeadline(getRandomHeadline());
    setGuess(2010);
    setRevealed(false);
  }, []);

  useEffect(() => {
    newHeadline();
  }, [newHeadline]);

  const handleGuess = () => {
    if (!headline) return;
    setRevealed(true);
    const diff = Math.abs(guess - headline.year);
    if (diff <= 2) {
      setScore((s) => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setScore((s) => ({ ...s, total: s.total + 1 }));
    }
  };

  const getDiffMessage = () => {
    if (!headline) return "";
    const diff = headline.year - guess;
    if (diff === 0) return "Exactly right!";
    if (Math.abs(diff) <= 2) return `Close! Just ${Math.abs(diff)} year${Math.abs(diff) > 1 ? "s" : ""} off.`;
    if (diff > 0) return `${Math.abs(diff)} years too early.`;
    return `${Math.abs(diff)} years too late.`;
  };

  if (!headline) return null;

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        <header className="mb-12">
          <p className="font-mono text-xs tracking-wide text-muted mb-4">
            Random headline
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight mb-4">
            Guess the Year
          </h1>
          <p className="font-mono text-sm text-muted">
            When was this headline published?
          </p>
        </header>

        {/* Headline */}
        <section className="mb-12">
          <blockquote className="text-2xl md:text-3xl font-serif leading-tight mb-4">
            "{headline.headline}"
          </blockquote>
          <p className="font-mono text-sm text-muted">{headline.tag}</p>
        </section>

        {/* Guess UI */}
        {!revealed ? (
          <section className="mb-12">
            <label className="block font-mono text-sm text-muted mb-4">
              Your guess: <span className="text-ink font-bold text-lg">{guess}</span>
            </label>
            <input
              type="range"
              min={minYear}
              max={maxYear}
              value={guess}
              onChange={(e) => setGuess(parseInt(e.target.value))}
              className="w-full h-2 bg-rule rounded-lg appearance-none cursor-pointer accent-highlight mb-6"
            />
            <div className="flex justify-between font-mono text-xs text-muted mb-8">
              <span>{minYear}</span>
              <span>{maxYear}</span>
            </div>
            <button onClick={handleGuess} className="btn-primary w-full">
              Submit Guess
            </button>
          </section>
        ) : (
          <section className="mb-12">
            <div className={`p-6 -mx-4 mb-6 ${Math.abs(guess - headline.year) <= 2 ? "bg-highlight text-cream" : "bg-ink text-cream"}`}>
              <p className="font-mono text-sm mb-2">{getDiffMessage()}</p>
              <p className="text-4xl font-serif font-black">
                {headline.year}
              </p>
            </div>
            
            <div className="flex gap-4">
              <button onClick={newHeadline} className="btn-primary flex-1">
                Next Headline →
              </button>
              <a
                href={headline.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm underline underline-offset-4 decoration-highlight hover:decoration-ink px-4 py-3"
              >
                Read article
              </a>
            </div>
          </section>
        )}

        {/* Score */}
        {score.total > 0 && (
          <section className="border-t border-rule pt-8">
            <p className="font-mono text-sm text-muted">
              Score: <span className="text-ink">{score.correct}</span> / {score.total} within 2 years
            </p>
          </section>
        )}
      </main>
    </>
  );
}
