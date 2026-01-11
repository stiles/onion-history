/**
 * Generate a shareable slug from a headline and its index.
 * Format: "first-few-words-of-headline-12345"
 */
export function generateHeadlineSlug(headline: string, index: number): string {
  const slug = headline
    .toLowerCase()
    .replace(/['']/g, "") // Remove apostrophes
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .trim()
    .split(/\s+/)
    .slice(0, 6) // First 6 words
    .join("-")
    .slice(0, 50); // Max 50 chars

  return `${slug}-${index}`;
}

/**
 * Parse index from a headline slug.
 * Returns null if invalid.
 */
export function parseHeadlineSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  if (!match) return null;
  const index = parseInt(match[1], 10);
  return isNaN(index) ? null : index;
}
