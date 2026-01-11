import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onion History",
  description: "A cultural archive of The Onion headlines since 1988",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-serif antialiased">
        {children}
      </body>
    </html>
  );
}
