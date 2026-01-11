import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onion History",
  description: "35,000 headlines. Zero facts. Lots of laughs. A cultural archive of The Onion headlines since 1988.",
  metadataBase: new URL("https://onionhistory.com"),
  openGraph: {
    title: "Onion History",
    description: "35,000 headlines. Zero facts. Lots of laughs.",
    url: "https://onionhistory.com",
    siteName: "Onion History",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://onionhistory.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Onion History - An archive of The Onion headlines",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Onion History",
    description: "35,000 headlines. Zero facts. Lots of laughs.",
    images: ["https://onionhistory.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3GEMN2RQZ8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3GEMN2RQZ8');
          `}
        </Script>
      </head>
      <body className="min-h-screen font-serif antialiased">
        {children}
      </body>
    </html>
  );
}
