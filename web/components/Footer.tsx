import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-cream mt-16">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Project info */}
          <div className="max-w-md">
            <h3 className="font-serif text-xl font-bold mb-3">Onion History</h3>
            <p className="text-cream/70 text-sm leading-relaxed mb-4">
              A cultural archive of <em>The Onion</em> headlines, browsable by
              calendar date. See what absurdities were manufactured on any given
              day across 30+ years.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/stiles/onion-history"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 hover:text-cream transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/stiles"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 hover:text-cream transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-8 font-mono text-sm">
            <div>
              <h4 className="text-cream/50 uppercase tracking-wider text-xs mb-3">
                Site
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/random"
                    className="text-cream/70 hover:text-cream transition-colors"
                  >
                    Random
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-cream/70 hover:text-cream transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/stiles/onion-history"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/70 hover:text-cream transition-colors"
                  >
                    Code
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-cream/50 uppercase tracking-wider text-xs mb-3">
                Author
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://mattstiles.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/70 hover:text-cream transition-colors"
                  >
                    Matt Stiles
                  </a>
                </li>
                <li>
                  <a
                    href="https://buymeacoffee.com/mattstiles"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-highlight hover:text-cream transition-colors"
                  >
                    Buy me coffee?
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-cream/10 mt-8 pt-8 text-center">
          <p className="text-cream/50 text-xs">
            All headlines from{" "}
            <a
              href="https://theonion.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-cream"
            >
              The Onion
            </a>
            . This is an unofficial fan project.
          </p>
        </div>
      </div>
    </footer>
  );
}
