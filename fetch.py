import requests
from bs4 import BeautifulSoup
import json
import time
import argparse
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

SECTIONS = ['news', 'local', 'politics', 'latest']


def scrape_page(section, page_num):
    """Scrape a single page and return list of articles."""
    url = f"https://theonion.com/{section}/page/{page_num}/"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        articles = []
        post_items = soup.find_all('li', class_='wp-block-post')
        
        for item in post_items:
            article = {}
            
            title_elem = item.find('h3', class_='wp-block-post-title')
            if title_elem:
                link = title_elem.find('a')
                if link:
                    article['headline'] = link.get_text(strip=True)
                    article['url'] = link.get('href', '')
            
            tag_elem = item.find('div', class_='taxonomy-category')
            if tag_elem:
                tag_link = tag_elem.find('a')
                if tag_link:
                    article['tag'] = tag_link.get_text(strip=True)
            
            article['section'] = section
            article['page'] = page_num
            
            if article.get('headline') and article.get('url') and article.get('tag'):
                articles.append(article)
        
        return articles
    
    except requests.RequestException as e:
        print(f"  Error fetching {section} page {page_num}: {e}")
        return []
    except Exception as e:
        print(f"  Error parsing {section} page {page_num}: {e}")
        return []


def load_existing_articles(output_file):
    """Load existing articles from JSON file if it exists."""
    if output_file.exists():
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                articles = json.load(f)
            return articles
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error loading existing file: {e}. Starting fresh.")
            return []
    return []


def get_last_scraped_page(articles, section=None):
    """Find the highest page number in existing articles, optionally filtered by section."""
    if not articles:
        return 0
    if section:
        section_articles = [a for a in articles if a.get('section') == section]
        if not section_articles:
            return 0
        return max(a.get('page', 0) for a in section_articles)
    return max(article.get('page', 0) for article in articles)


def get_existing_urls(articles):
    """Get set of existing URLs to avoid duplicates."""
    return {article.get('url') for article in articles if article.get('url')}


def save_articles(articles, output_file):
    """Save articles to JSON file."""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)


def scrape_pages_batch(section, pages, workers=4):
    """Scrape multiple pages in parallel, return all articles."""
    all_results = []
    
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {executor.submit(scrape_page, section, p): p for p in pages}
        
        for future in as_completed(futures):
            page_num = futures[future]
            try:
                articles = future.result()
                all_results.append((page_num, articles))
            except Exception as e:
                print(f"  Error on {section} page {page_num}: {e}")
                all_results.append((page_num, []))
    
    # Sort by page number to maintain order
    all_results.sort(key=lambda x: x[0])
    return all_results


def scrape_section(section, start_page=1, max_pages=None, workers=4, batch_size=10, 
                   batch_delay=2, existing_urls=None, verbose=False):
    """Scrape a single section with parallel fetching.
    
    Returns:
        tuple: (new_articles, total_duplicates, last_page_scraped)
    """
    if existing_urls is None:
        existing_urls = set()
    
    new_articles = []
    total_duplicates = 0
    page_num = start_page
    empty_pages = 0
    
    print(f"[{section}] Starting from page {start_page}")
    
    while True:
        # Determine batch range
        if max_pages:
            end_page = min(page_num + batch_size, max_pages + 1)
        else:
            end_page = page_num + batch_size
        
        pages_to_fetch = list(range(page_num, end_page))
        if not pages_to_fetch:
            break
        
        # Fetch batch in parallel
        results = scrape_pages_batch(section, pages_to_fetch, workers)
        
        batch_new = 0
        batch_dupes = 0
        last_valid_page = page_num - 1
        
        for pg, articles in results:
            if not articles:
                empty_pages += 1
                if empty_pages >= 3:
                    print(f"[{section}] No more pages after {last_valid_page}")
                    return new_articles, total_duplicates, last_valid_page
                continue
            
            empty_pages = 0
            last_valid_page = pg
            
            # Filter duplicates
            unique = [a for a in articles if a.get('url') not in existing_urls]
            dupes = len(articles) - len(unique)
            
            batch_dupes += dupes
            batch_new += len(unique)
            
            for a in unique:
                existing_urls.add(a.get('url'))
                new_articles.append(a)
        
        total_duplicates += batch_dupes
        
        # Compact progress output
        total = len(new_articles)
        print(f"[{section}] Pages {page_num}-{end_page - 1}: +{batch_new:,} articles (total: {total:,})")
        
        # Check if we've hit max pages
        if max_pages and end_page > max_pages:
            break
        
        # Check if we got empty results for all pages in batch
        if batch_new == 0 and batch_dupes == 0:
            print(f"[{section}] No more content found")
            break
        
        page_num = end_page
        time.sleep(batch_delay)
    
    return new_articles, total_duplicates, page_num - 1


def scrape_all_sections(sections=None, start_page=1, max_pages=None, workers=4, 
                        batch_size=10, batch_delay=2, save_interval=1000, 
                        output_file=None, fresh=False):
    """Scrape multiple sections with parallel fetching and incremental saving.
    
    Args:
        sections: List of sections to scrape, or None for all
        save_interval: Save every N new articles (default: 1000)
        fresh: If True, ignore any existing file and start from scratch
    """
    if sections is None:
        sections = SECTIONS
    
    if output_file is None:
        data_dir = Path('data')
        data_dir.mkdir(exist_ok=True)
        output_file = data_dir / 'headlines.json'
    
    # Load existing articles
    if fresh:
        print("Starting fresh fetch (ignoring any existing data)...")
        all_articles = []
    else:
        all_articles = load_existing_articles(output_file)
        if all_articles:
            print(f"Loaded {len(all_articles):,} existing articles")
    
    existing_urls = get_existing_urls(all_articles)
    initial_count = len(all_articles)
    articles_since_save = 0
    total_duplicates = 0
    
    for section in sections:
        # Determine starting page for this section
        if fresh:
            section_start = start_page
        else:
            last_page = get_last_scraped_page(all_articles, section)
            section_start = max(start_page, last_page + 1) if last_page > 0 else start_page
        
        new_articles, dupes, last_page = scrape_section(
            section=section,
            start_page=section_start,
            max_pages=max_pages,
            workers=workers,
            batch_size=batch_size,
            batch_delay=batch_delay,
            existing_urls=existing_urls,
        )
        
        total_duplicates += dupes
        
        if new_articles:
            all_articles.extend(new_articles)
            articles_since_save += len(new_articles)
            
            # Save periodically
            if articles_since_save >= save_interval:
                print(f"Saving progress ({len(all_articles):,} articles)...")
                save_articles(all_articles, output_file)
                articles_since_save = 0
        
        print(f"[{section}] Complete: {len(new_articles):,} new, {dupes:,} duplicates skipped\n")
    
    # Final save
    save_articles(all_articles, output_file)
    
    new_total = len(all_articles) - initial_count
    print(f"Done! Added {new_total:,} new articles ({len(all_articles):,} total)")
    print(f"Skipped {total_duplicates:,} duplicates (sidebar/cross-section overlap)")
    print(f"Saved to {output_file}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Scrape The Onion headlines')
    parser.add_argument('--section', type=str, default='all',
                        help=f'Section to scrape: {", ".join(SECTIONS)}, or "all" (default: all)')
    parser.add_argument('--fresh', action='store_true', 
                        help='Start fresh, ignoring any existing data file')
    parser.add_argument('--start-page', type=int, default=1, 
                        help='Starting page number (default: 1)')
    parser.add_argument('--max-pages', type=int, default=None, 
                        help='Maximum pages per section')
    parser.add_argument('--workers', type=int, default=4, 
                        help='Number of parallel workers (default: 4)')
    parser.add_argument('--batch-size', type=int, default=10, 
                        help='Pages per batch (default: 10)')
    parser.add_argument('--batch-delay', type=float, default=2, 
                        help='Delay between batches in seconds (default: 2)')
    parser.add_argument('--save-interval', type=int, default=1000, 
                        help='Save every N new articles (default: 1000)')
    parser.add_argument('--output', type=str, default=None, 
                        help='Output file path (default: data/headlines.json)')
    
    args = parser.parse_args()
    
    # Parse sections
    if args.section == 'all':
        sections = SECTIONS
    elif args.section in SECTIONS:
        sections = [args.section]
    else:
        parser.error(f"Invalid section: {args.section}. Choose from: {', '.join(SECTIONS)}, or 'all'")
    
    output_file = Path(args.output) if args.output else None
    
    scrape_all_sections(
        sections=sections,
        start_page=args.start_page,
        max_pages=args.max_pages,
        workers=args.workers,
        batch_size=args.batch_size,
        batch_delay=args.batch_delay,
        save_interval=args.save_interval,
        output_file=output_file,
        fresh=args.fresh
    )
