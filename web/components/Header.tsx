import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-rule">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl font-black tracking-tight hover:text-highlight transition-colors"
        >
          ONION <span className="italic font-normal">History</span>
        </Link>
        <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
          <Link
            href="/random"
            className="text-muted hover:text-ink transition-colors"
          >
            Random
          </Link>
          <Link
            href="/about"
            className="text-muted hover:text-ink transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
