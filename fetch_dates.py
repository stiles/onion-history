import requests
from bs4 import BeautifulSoup
import json
import time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock

def extract_date_from_url(url):
    """Extract date from an article URL."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look for time element with datetime attribute
        time_elem = soup.find('time', {'datetime': True})
        if time_elem:
            datetime_attr = time_elem.get('datetime', '')
            return datetime_attr
        
        return None
    
    except requests.RequestException as e:
        print(f"  Error fetching {url}: {e}")
        return None
    except Exception as e:
        print(f"  Error parsing {url}: {e}")
        return None

def process_article(article, url_to_index, lock, save_counter, save_interval, all_articles, output_file):
    """Process a single article to fetch its date."""
    url = article.get('url')
    
    # Skip if already has a date
    if article.get('date'):
        return None
    
    if not url:
        return None
    
    date = extract_date_from_url(url)
    
    if date:
        with lock:
            # Update the article using index lookup (faster and thread-safe)
            idx = url_to_index.get(url)
            if idx is not None:
                all_articles[idx]['date'] = date
            
            save_counter[0] += 1
            
            # Incremental save
            if save_counter[0] % save_interval == 0:
                print(f"Saving progress ({save_counter[0]} dates fetched)...")
                save_articles(all_articles, output_file)
        
        return date
    
    return None

def save_articles(articles, output_file):
    """Save articles to JSON file."""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

def fetch_dates_for_articles(input_file=None, output_file=None, max_workers=10, save_interval=100, delay=0.1, max_articles=None):
    """Fetch dates for all articles using concurrent requests.
    
    Args:
        input_file: Path to input JSON file (default: data/headlines.json)
        output_file: Path to output JSON file (default: same as input_file)
        max_workers: Number of concurrent requests
        save_interval: Save progress every N articles processed
        delay: Delay between requests (seconds)
        max_articles: Limit number of articles to process (for testing)
    """
    if input_file is None:
        input_file = Path('data') / 'headlines.json'
    else:
        input_file = Path(input_file)
    
    if output_file is None:
        output_file = input_file
    else:
        output_file = Path(output_file)
    
    # Load articles
    print(f"Loading articles from {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        articles = json.load(f)
    
    # Filter articles that need dates
    articles_needing_dates = [a for a in articles if not a.get('date')]
    
    # Limit for testing if specified
    if max_articles:
        articles_needing_dates = articles_needing_dates[:max_articles]
        print(f"TEST MODE: Processing only first {max_articles} articles")
    
    total_needing_dates = len(articles_needing_dates)
    total_articles = len(articles)
    
    print(f"Found {total_articles} total articles")
    print(f"{total_needing_dates} articles need dates")
    
    if total_needing_dates == 0:
        print("All articles already have dates!")
        return
    
    # Create URL to index mapping for fast lookup
    url_to_index = {a.get('url'): i for i, a in enumerate(articles)}
    
    # Thread-safe counter and lock
    save_counter = [0]
    lock = Lock()
    
    print(f"Starting to fetch dates with {max_workers} concurrent workers...")
    print(f"Saving progress every {save_interval} articles...")
    
    # Process articles concurrently
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = []
        
        for article in articles_needing_dates:
            future = executor.submit(
                process_article,
                article,
                url_to_index,
                lock,
                save_counter,
                save_interval,
                articles,
                output_file
            )
            futures.append(future)
            time.sleep(delay)  # Rate limiting
        
        # Process results as they complete
        completed = 0
        for future in as_completed(futures):
            completed += 1
            if completed % 50 == 0:
                print(f"Processed {completed}/{total_needing_dates} articles...")
    
    # Final save
    print("Saving final results...")
    save_articles(articles, output_file)
    
    # Count how many got dates
    articles_with_dates = sum(1 for a in articles if a.get('date'))
    print(f"\nCompleted!")
    print(f"Articles with dates: {articles_with_dates}/{total_articles}")
    print(f"Saved to {output_file}")

if __name__ == "__main__":
    import sys
    
    # Check for test mode
    test_mode = '--test' in sys.argv
    max_articles = 10 if test_mode else None
    
    if test_mode:
        print("=" * 60)
        print("TEST MODE: Processing only 10 articles")
        print("Remove --test flag to process all articles")
        print("=" * 60)
        print()
    
    fetch_dates_for_articles(
        max_workers=10,      # Adjust based on your needs (more = faster but more server load)
        save_interval=100,   # Save every 100 dates fetched
        delay=0,           # 100ms delay between requests
        max_articles=max_articles
    )
