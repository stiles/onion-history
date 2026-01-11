import requests
from bs4 import BeautifulSoup
import json
import time
import argparse
from pathlib import Path

def scrape_page(page_num):
    """Scrape a single page and return list of articles."""
    url = f"https://theonion.com/latest/page/{page_num}/"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        articles = []
        # Find all article list items
        post_items = soup.find_all('li', class_='wp-block-post')
        
        for item in post_items:
            article = {}
            
            # Extract headline and URL from h3 > a
            title_elem = item.find('h3', class_='wp-block-post-title')
            if title_elem:
                link = title_elem.find('a')
                if link:
                    article['headline'] = link.get_text(strip=True)
                    article['url'] = link.get('href', '')
            
            # Extract tag/category from taxonomy-category div
            tag_elem = item.find('div', class_='taxonomy-category')
            if tag_elem:
                tag_link = tag_elem.find('a')
                if tag_link:
                    article['tag'] = tag_link.get_text(strip=True)
            
            # Add page number for tracking
            article['page'] = page_num
            
            # Only add if we have all required fields
            if article.get('headline') and article.get('url') and article.get('tag'):
                articles.append(article)
        
        return articles
    
    except requests.RequestException as e:
        print(f"Error fetching page {page_num}: {e}")
        return []
    except Exception as e:
        print(f"Error parsing page {page_num}: {e}")
        return []

def load_existing_articles(output_file):
    """Load existing articles from JSON file if it exists."""
    if output_file.exists():
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                articles = json.load(f)
            print(f"Loaded {len(articles)} existing articles from {output_file}")
            return articles
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error loading existing file: {e}. Starting fresh.")
            return []
    return []

def get_last_scraped_page(articles):
    """Find the highest page number in existing articles."""
    if not articles:
        return 0
    return max(article.get('page', 0) for article in articles)

def get_existing_urls(articles):
    """Get set of existing URLs to avoid duplicates."""
    return {article.get('url') for article in articles if article.get('url')}

def save_articles(articles, output_file):
    """Save articles to JSON file."""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

def scrape_all_pages(start_page=1, max_pages=None, delay=1, save_interval=10, output_file=None, check_page_one=True, fresh=False):
    """Scrape multiple pages with pagination, incremental saving, and resume capability.
    
    Since The Onion paginates in reverse chronological order (page 1 = newest),
    this function will:
    1. Check page 1 for new articles if resuming (since new content appears there)
    2. Continue from the highest page number to get older articles
    
    Args:
        fresh: If True, ignore any existing file and start from scratch
    """
    if output_file is None:
        data_dir = Path('data')
        data_dir.mkdir(exist_ok=True)
        output_file = data_dir / 'headlines.json'
    
    # Load existing articles and determine starting page
    if fresh:
        print("Starting fresh fetch (ignoring any existing data)...")
        all_articles = []
    else:
        all_articles = load_existing_articles(output_file)
    existing_urls = get_existing_urls(all_articles)
    last_page = get_last_scraped_page(all_articles)
    
    pages_since_save = 0
    
    # If resuming and we have existing articles, check page 1 first for new content
    if check_page_one and existing_urls and last_page > 1:
        print("Checking page 1 for new articles (most recent content)...")
        articles = scrape_page(1)
        if articles:
            new_articles = [a for a in articles if a.get('url') not in existing_urls]
            duplicates = len(articles) - len(new_articles)
            
            if duplicates > 0:
                print(f"  Skipped {duplicates} duplicate(s) already scraped in this run")
            
            if new_articles:
                all_articles.extend(new_articles)
                existing_urls.update(a.get('url') for a in new_articles)
                pages_since_save += 1
                print(f"Found {len(new_articles)} new articles on page 1 (total: {len(all_articles)})")
            else:
                print("No new articles on page 1")
        
        time.sleep(delay)
    
    # Determine starting page for older content
    if last_page > 0:
        start_page = last_page + 1
        print(f"Continuing to scrape older articles from page {start_page} (last scraped: page {last_page})")
    else:
        print(f"Starting fresh from page {start_page}")
        if existing_urls and not check_page_one:
            print(f"Found {len(existing_urls)} existing articles (may be from previous version without page tracking)")
    
    page_num = start_page
    
    while True:
        print(f"Scraping page {page_num}...")
        articles = scrape_page(page_num)
        
        if not articles:
            print(f"No articles found on page {page_num}. Stopping.")
            break
        
        # Filter out duplicates by URL
        new_articles = [a for a in articles if a.get('url') not in existing_urls]
        duplicates = len(articles) - len(new_articles)
        
        if duplicates > 0:
            print(f"  Skipped {duplicates} duplicate(s) already scraped in this run")
        
        if new_articles:
            all_articles.extend(new_articles)
            existing_urls.update(a.get('url') for a in new_articles)
            pages_since_save += 1
            print(f"Found {len(new_articles)} new articles on page {page_num} (total: {len(all_articles)})")
        else:
            print(f"No new articles on page {page_num} (all duplicates)")
        
        # Incremental save every save_interval pages
        if pages_since_save >= save_interval:
            print(f"Saving progress ({len(all_articles)} articles)...")
            save_articles(all_articles, output_file)
            pages_since_save = 0
        
        if max_pages and page_num >= max_pages:
            break
        
        page_num += 1
        time.sleep(delay)  # Be respectful with rate limiting
    
    # Final save
    print(f"Saving final results...")
    save_articles(all_articles, output_file)
    print(f"\nSaved {len(all_articles)} articles to {output_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Scrape The Onion headlines')
    parser.add_argument('--fresh', action='store_true', help='Start fresh, ignoring any existing data file')
    parser.add_argument('--start-page', type=int, default=1, help='Starting page number (default: 1)')
    parser.add_argument('--max-pages', type=int, default=None, help='Maximum number of pages to scrape')
    parser.add_argument('--delay', type=float, default=1, help='Delay between requests in seconds (default: 1)')
    parser.add_argument('--save-interval', type=int, default=10, help='Save progress every N pages (default: 10)')
    parser.add_argument('--output', type=str, default=None, help='Output file path (default: data/headlines.json)')
    
    args = parser.parse_args()
    
    output_file = Path(args.output) if args.output else None
    scrape_all_pages(
        start_page=args.start_page,
        max_pages=args.max_pages,
        delay=args.delay,
        save_interval=args.save_interval,
        output_file=output_file,
        fresh=args.fresh
    )