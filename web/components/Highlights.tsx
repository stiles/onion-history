import type { Headline } from "@/lib/types";

interface HighlightsProps {
  newest: Headline;
  oldest: Headline;
  fromTheArchive: Headline[];
}

function HeadlineCard({
  headline,
  label,
  featured = false,
}: {
  headline: Headline;
  label: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`py-6 border-b border-rule last:border-b-0 ${
        featured ? "bg-highlight text-cream -mx-4 px-4 border-b-0 mb-6" : ""
      }`}
    >
      <span className={`font-mono text-xs tracking-wide ${featured ? "text-cream/70" : "text-muted"}`}>{label}</span>
      <h3
        className={`font-serif mt-2 mb-3 leading-tight ${
          featured ? "text-2xl md:text-3xl font-bold" : "text-xl md:text-2xl"
        }`}
      >
        <a
          href={headline.url}
          target="_blank"
          rel="noopener noreferrer"
          className={featured ? "hover:underline" : "headline-link"}
        >
          {headline.headline}
        </a>
      </h3>
      <div className={`font-mono text-xs flex items-center gap-3 ${featured ? "text-cream/70" : "text-muted"}`}>
        <span className={`px-2 py-0.5 ${featured ? "bg-cream text-highlight" : "bg-ink text-cream"}`}>{headline.year}</span>
        <span>{headline.tag}</span>
      </div>
    </article>
  );
}

export function Highlights({
  newest,
  oldest,
  fromTheArchive,
}: HighlightsProps) {
  return (
    <section className="mb-12">
      <HeadlineCard headline={newest} label="Most recent" featured />

      {fromTheArchive.map((h) => {
        const decade = Math.floor(h.year / 10) * 10;
        return (
          <HeadlineCard
            key={h.url}
            headline={h}
            label={`From the ${decade}s`}
          />
        );
      })}

      {oldest.year !== newest.year && (
        <HeadlineCard headline={oldest} label="Earliest on this day" />
      )}
    </section>
  );
}
