"""
Clean and optimize headlines data for the web app.
Run this before the web preprocessing step.

Usage:
    uv run python optimize.py
    uv run python optimize.py --dry-run  # Preview changes without saving
"""

import json
import argparse
from pathlib import Path

DATA_PATH = Path("data/headlines.json")

# Filters to apply
EXCLUDED_TAGS = {
    "American Voices",
    "Cartoons",
    "Commentary",
    "Video"
}

EXCLUDED_PATTERNS = [
    "Horoscope",
    "Artist Profile",
    "Editorial Cartoon",
]


def load_data() -> list[dict]:
    with open(DATA_PATH) as f:
        return json.load(f)


def save_data(headlines: list[dict]) -> None:
    with open(DATA_PATH, "w") as f:
        json.dump(headlines, f, indent=2)


def filter_headlines(headlines: list[dict]) -> tuple[list[dict], dict]:
    """Filter headlines and return (kept, stats)."""
    kept = []
    removed = {"by_tag": {}, "by_pattern": {}}

    for h in headlines:
        tag = h.get("tag", "")
        headline = h.get("headline", "")

        # Check tag exclusions
        if tag in EXCLUDED_TAGS:
            removed["by_tag"][tag] = removed["by_tag"].get(tag, 0) + 1
            continue

        # Check pattern exclusions
        excluded = False
        for pattern in EXCLUDED_PATTERNS:
            if pattern in headline:
                removed["by_pattern"][pattern] = removed["by_pattern"].get(pattern, 0) + 1
                excluded = True
                break

        if not excluded:
            kept.append(h)

    return kept, removed


def main():
    parser = argparse.ArgumentParser(description="Clean headlines data")
    parser.add_argument("--dry-run", action="store_true", help="Preview without saving")
    args = parser.parse_args()

    headlines = load_data()
    print(f"Loaded {len(headlines):,} headlines")

    filtered, removed = filter_headlines(headlines)

    print(f"\nRemoved by tag:")
    for tag, count in sorted(removed["by_tag"].items(), key=lambda x: -x[1]):
        print(f"  {tag}: {count:,}")

    print(f"\nRemoved by pattern:")
    for pattern, count in sorted(removed["by_pattern"].items(), key=lambda x: -x[1]):
        print(f"  {pattern}: {count:,}")

    total_removed = sum(removed["by_tag"].values()) + sum(removed["by_pattern"].values())
    print(f"\nTotal: {len(headlines):,} → {len(filtered):,} ({total_removed:,} removed)")

    if args.dry_run:
        print("\n[Dry run — no changes saved]")
    else:
        save_data(filtered)
        print(f"\nSaved to {DATA_PATH}")


if __name__ == "__main__":
    main()
