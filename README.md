# Onion History

A cultural archive of *The Onion* headlines, browsable by calendar date. See what absurdities were manufactured on any given day across 30+ years.

## The site

The web app lives in `/web` — a static Next.js site.

```bash
cd web
npm install
npm run dev
```

This runs the preprocessing script and starts the dev server at `http://localhost:3000`.

### Building for production

```bash
npm run build
```

Outputs static files to `web/out/`, ready for deployment to Vercel or any static host.

## Data pipeline

### Scraping headlines

```bash
uv run python fetch.py                    # Scrape all sections, resume from last run
uv run python fetch.py --section news     # Scrape just news section
uv run python fetch.py --fresh            # Start fresh, ignore existing data
uv run python fetch.py --workers 8        # More parallel workers (default: 4)
```

Scrapes headlines from The Onion's section news pages: news, local, politics, latest (not sports, opinion, entertainment, etc.). Uses parallel fetching, saves every 1000 articles, resumes per-section if interrupted.

### Fetching dates

```bash
uv run python fetch_dates.py
```

Adds publication dates to headlines by visiting each article URL.

### Filtering data

```bash
uv run python optimize.py --dry-run  # Preview
uv run python optimize.py            # Apply
```

Removes non-headline content (American Voices, Horoscopes, Editorial Cartoons, etc.) from the dataset.

### Regenerating web data

After modifying `data/headlines.json`, regenerate the web app's data:

```bash
cd web && npm run preprocess
```

## Project structure

```
.
├── data/
│   └── headlines.json       # Raw scraped data
├── web/
│   ├── app/                 # Next.js pages
│   ├── components/          # React components
│   ├── data/
│   │   └── by-day.json      # Preprocessed data (grouped by date)
│   └── scripts/
│       └── preprocess.ts    # Data transformation script
├── fetch.py                 # Headline scraper
├── fetch_dates.py           # Date fetcher
├── optimize.py              # Data filter
└── pyproject.toml           # Python dependencies
```

## Data format

Each headline in `data/headlines.json` (about 35,000 headlines):

```json
{
  "headline": "Area Man Passionate Defender Of What He Imagines Constitution To Be",
  "url": "https://theonion.com/...",
  "tag": "News",
  "section": "latest",
  "page": 42,
  "date": "2009-11-14T00:00:00-06:00"
}
```

The web app groups these by calendar date (MM-DD) for the "On This Day" view.

## Credits

All headlines from [The Onion](https://theonion.com). This is an unofficial fan project.
