import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random — Onion History",
  description: "Browse random Onion headlines or play the year-guessing game",
  openGraph: {
    title: "Random — Onion History",
    description: "Browse random Onion headlines or play the year-guessing game",
    url: "https://onionhistory.com/random",
  },
  twitter: {
    title: "Random — Onion History",
    description: "Browse random Onion headlines or play the year-guessing game",
  },
};

export default function RandomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
