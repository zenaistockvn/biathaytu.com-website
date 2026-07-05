# Inject Four Articles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Inject 4 new SEO/GEO-optimized articles of at least 700 words each into `src/data/articles.json`, run link & GEO footer optimizations, synchronize with Neon DB, audit, and build the Next.js site to produce 103 static pages.

**Architecture:** A custom Node.js script `scripts/inject_four_articles.js` will programmatically insert 4 new articles into the local `src/data/articles.json` file. Then, internal link injection (`scripts/inject_internal_links.js`) is run locally. The updated JSON is synced to Neon Database via `npm run sync-db`. Then, the GEO footer injection script (`scripts/inject_geo_footer.js`) is run against the Neon DB to add local shipping and contact information to all articles. Finally, `dump_data.js` runs as part of the build to pull the updated articles back into local `src/data/articles.json` to pass the local detailed SEO/GEO audit.

**Tech Stack:** Node.js, Next.js, PostgreSQL (pg client), Git.

## Global Constraints
- Each article must be > 700 words.
- Each article must have proper H2, H3 headings.
- Each article must contain GEO terms (Hà Nội, Sài Gòn/TP.HCM, Tây Hồ, Lạc Long Quân, ship hỏa tốc).
- The total static pages after Next.js build must be exactly 103 (100 existing + 4 new articles - wait, let's double check if there are 99 existing or 103 total, the brief says "producing 103 static pages").
- Maintain documentation integrity.

---

### Task 1: Create and Run Injection Script
Create `scripts/inject_four_articles.js` containing the content of the 4 new articles and logic to unshift/add them to `src/data/articles.json`.

**Files:**
- Create: `scripts/inject_four_articles.js`
- Modify: `src/data/articles.json`

**Interfaces:**
- Produces: 4 new articles in `src/data/articles.json` with ids:
  1. `top-5-dong-bia-bi-nhap-khau-duoc-ua-chuong-nhat`
  2. `gia-bia-chimay-xanh-do-vang-chinh-hang`
  3. `so-sanh-bia-duc-va-bia-bi-gu-thuong-thuc`
  4. `hop-qua-tang-bia-bi-bia-duc-nhap-khau-sang-trong`

- [ ] **Step 1: Write `scripts/inject_four_articles.js`**
  Write a script that reads `src/data/articles.json`, constructs 4 articles with > 700 words each, including proper SEO H2/H3 headings and GEO terms (Hà Nội, Sài Gòn/TP.HCM, Tây Hồ, Lạc Long Quân, ship hỏa tốc), and inserts them if they do not already exist.
- [ ] **Step 2: Run the injection script**
  Run: `node scripts/inject_four_articles.js`
  Expected: "Successfully injected 4 new articles into src/data/articles.json"
- [ ] **Step 3: Verify word counts and format**
  Verify that the word counts of all four new articles are greater than 700 words.

---

### Task 2: Run Link Injection and GEO Footer Scripts
Run `scripts/inject_internal_links.js` on local files and `scripts/inject_geo_footer.js` on the database (after syncing).

**Files:**
- Modify: `src/data/articles.json`
- Modify: Database (`seo_articles` table)

- [ ] **Step 1: Run local internal link injection**
  Run: `node scripts/inject_internal_links.js`
  Expected: "Successfully updated X articles in local articles.json" (with the new articles being linked).
- [ ] **Step 2: Synchronize with Neon DB**
  Run: `npm run sync-db`
  Expected: Articles synchronized successfully.
- [ ] **Step 3: Run GEO footer injection**
  Run: `node scripts/inject_geo_footer.js`
  Expected: "Successfully updated Brand & GEO Local Shipping footer in X articles in DB."
- [ ] **Step 4: Dump database back to local json to pull the GEO footers**
  Run: `node scripts/dump_data.js`
  Expected: Fetch articles and overwrite local `src/data/articles.json` with DB data including the footer.

---

### Task 3: Audit, Build and Verify
Run the SEO auditor and Next.js build to verify everything is warning-free and compiles to 103 pages.

**Files:**
- Modify: `src/data/articles.json` (verified via audit)
- Modify: `task-6-report.md`

- [ ] **Step 1: Run SEO/GEO detailed audit**
  Run: `npm run audit-detailed`
  Expected: No warnings or errors for the newly added articles.
- [ ] **Step 2: Run build**
  Run: `npm run build`
  Expected: Next.js builds successfully and outputs 103 static HTML files / routes.
- [ ] **Step 3: Write report**
  Write report details to `file:///c:/Users/QuangTran/Downloads/Full%20d%E1%BB%B1%20%C3%A1n/biathaytu-web/.superpowers/sdd/task-6-report.md`
- [ ] **Step 4: Commit and report**
  Commit the changes using git and reply with status DONE, change list, and commit hash.
