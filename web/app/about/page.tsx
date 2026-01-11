import { Header } from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Onion History",
  description: "About this unofficial archive of The Onion headlines",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        <header className="mb-12">
          <p className="section-label mb-4">The fine print</p>
          <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight">
            About
          </h1>
        </header>

        <div className="space-y-6 font-serif text-lg leading-relaxed">
          <p>
            <em>The Onion</em> has been publishing satirical news since 1988.
            This site collects their headlines by calendar date, so you can see
            what absurdities were manufactured on any given day across three
            decades.
          </p>
          <p>
            The patterns are the point. Area Man shows up reliably. The Nation
            reacts predictably. Local teens remain confounding. Headlines from
            1998 feel like they were written yesterday, which is either funny or
            depressing.
          </p>
          <p className="font-mono text-sm text-muted border-l-4 border-highlight pl-4">
            This is an unofficial fan project. All headlines link back to their
            original source at theonion.com.
          </p>
        </div>
      </main>

      <footer className="max-w-2xl mx-auto px-4 py-12 text-center font-mono text-xs text-muted border-t border-rule mt-8">
        <p>
          All headlines from{" "}
          <a
            href="https://theonion.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-ink"
          >
            The Onion
          </a>
          . This is an unofficial fan project.
        </p>
      </footer>
    </>
  );
}
