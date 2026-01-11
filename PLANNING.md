# Onion headlines archive: OnionHistory.com

## Purpose
Create a small, public-facing site that treats *The Onion* as a cultural archive rather than a joke generator. The tone is deadpan and respectful. The humor emerges from scale, repetition, and history.

This is for fans: a place to browse, reflect on, and marvel at 30+ years of Onion headlines.

---

## Guiding principles

- **Archive first, toy second**: Everything should feel grounded in real history.
- **Deadpan tone**: No wink-wink UI copy. Let the headlines do the work.
- **Dataset-led**: Features should exist because the data supports them.
- **Simple tech**: Static-first Next.js app, deployed on Vercel.
- **Low maintenance**: No moderation, no auth, minimal dependencies.

---

## Dataset snapshot

- Total headlines: 63,677
- Date range: 1993–2026
- Categories: 65
- Dominant tags:
  - Local
  - American Voices
  - News

This gives the project three strengths:
- Longitudinal history
- Repeatable archetypes
- Consistent voice

---

## Core sections

### 1. On this day in Onion history (spine of the site)

**What it is**  
A chronological list of Onion headlines published on the current calendar date across all years.

**Why it matters**  
- Encourages repeat visits
- Highlights longevity and timelessness
- Feels archival rather than gimmicky

**Display**  
- Today’s date
- List grouped by year:
  - Year
  - Headline
  - Category

**Optional highlights**  
- Earliest headline on this day
- Most recent headline
- One marked as “Still feels current” (simple heuristic or manual)

---

### 2. Voices & archetypes

**What it is**  
A study of recurring Onion headline characters and constructs.

**Examples**  
- Area Man / Area Woman
- Nation
- Experts
- Local Teen
- American Voters

**What to show**  
- First appearance
- Peak years
- Dominant categories
- Total headline count

**Tone**  
Treat these like long-running correspondents or literary devices.

---

### 3. The Onion style engine

**What it is**  
A mad-libs–style headline generator built entirely from historical patterns in the dataset.

**Important framing**  
This is not positioned as creativity or AI.

> “A statistical distillation of 30 years of Onion headlines.”

**How it works (high level)**  
- Extract common headline templates from real headlines
- Replace nouns and entities with slots
- Fill slots using word banks drawn from the same categories and eras

**UX details**  
- Generate headline button
- Optional constraints:
  - Category (Local, Politics, American Voices)
  - Era (1990s, 2000s, 2010s)

**Critical addition**  
Show provenance:
- Number of real headlines contributing to the template
- Typical years and categories

This turns a toy into an educational artifact.

---

### 4. Guided randomness (discovery tools)

**What it is**  
Controlled exploration of the archive, not pure randomness.

**Examples**  
- Random Local headline
- Random headline from a specific year
- Random American Voices entry

**Purpose**  
Encourage wandering without chaos.

---

## What is intentionally excluded (for v1)

- Paste-a-news-URL → AI headline generation
- Freeform LLM-driven joke writing
- Social features or accounts

These dilute the archival focus and add unnecessary complexity.

---

## Technical approach

- **Framework**: Next.js
- **Deployment**: Vercel
- **Data**: Preprocessed JSON files
- **Rendering**:
  - Static generation for daily views
  - Lightweight client-side filtering

**Key goals**  
- Fast loads
- Cacheable pages
- Minimal runtime logic

---

## Tone and design

- Neutral typography
- Sparse color
- No jokes in headings or UI copy
- Methodology written like a serious research note

The implicit joke:
> This is being taken far too seriously.

---

## Success criteria

The project succeeds if:
- Fans enjoy browsing without needing explanation
- Headlines feel fresh even when decades old
- The site feels respectful, not derivative
- It can quietly exist at a stable URL for years

---

## One-sentence north star

**Build a place that assumes the reader already loves The Onion and wants to understand how it works.**
