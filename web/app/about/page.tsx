import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
          <p className="section-label mb-4">What's going on here?</p>
          <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight">
            About
          </h1>
        </header>

        <div className="space-y-6 font-serif text-lg leading-relaxed">
          <p>
            <em>The Onion</em> has been publishing satirical news since 1988.
            This project collects their headlines by calendar date, so you can see
            what absurdities were manufactured on any given day across three
            decades. The earliest headline is from 1993.
          </p>
          <p>
            The patterns are part of the fun. Area Man shows up reliably. The Nation
            reacts predictably. Local teens remain confounding. Headlines from
            1998 feel like they were written yesterday, which is either funny or
            depressing.
          </p>

          <h2 className="text-2xl font-serif font-bold pt-6">Some caveats...</h2>
          <p>
            This archive is pulled from The Onion's news, politics, local and latest sections and therefore incomplete. Some categories — such as American Voices, horoscopes, editorial cartoons and video content — are excluded on purpose. In addition, only dated articles appear on the calendar pages.
          </p>
          <p>
            There&apos;s no official API or comprehensive data source, so this
            represents a best-effort scrape and likely represents <span className="italic">most</span> of The Onion's content since the mid-1990s. If your favorite headline is
            missing, it&apos;s probably one of the undated ones. Sorry about that.
          </p>

          <p className="font-mono text-sm text-muted border-l-4 border-highlight pl-4">
            This is an unofficial fan project. All headlines link back to their
            original source at <a href="https://theonion.com">theonion.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
