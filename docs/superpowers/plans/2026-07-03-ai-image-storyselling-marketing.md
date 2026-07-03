# AI Image Storyselling Marketing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a practical production system for Bia Thay Tu AI-assisted storyselling images using the approved "Nguon Goc -> Chiec Ly" direction.

**Architecture:** This is a documentation and asset-production workflow, not an app feature. The plan creates a small marketing production hub under `docs/marketing/ai-image-storyselling/`, a final asset folder under `public/images/marketing/storyselling/2026-07/`, and a reviewable first batch plan for images that use AI backgrounds plus official product compositing.

**Tech Stack:** Markdown, CSV, existing official product image assets under `public/images/products/official/`, external image generation/compositing tools chosen at execution time, Git for versioned deliverables.

---

## File Structure

- Create: `docs/marketing/ai-image-storyselling/README.md`
  - Production overview, approved creative direction, workflow, folder map, and publishing guardrails.
- Create: `docs/marketing/ai-image-storyselling/prompt-library.md`
  - Reusable prompt blocks and ready-to-run prompts for the four content pillars.
- Create: `docs/marketing/ai-image-storyselling/production-board.csv`
  - Thirty-day content production board with pillar, story hook, product, format, CTA, and output ratios.
- Create: `docs/marketing/ai-image-storyselling/qa-checklist.md`
  - Checklist for label accuracy, legal/safety, brand fit, export quality, and publishing metadata.
- Create: `docs/marketing/ai-image-storyselling/first-batch.md`
  - Four-image pilot batch with exact briefs, product assets, prompts, copy spine, and acceptance criteria.
- Create: `public/images/marketing/storyselling/2026-07/.gitkeep`
  - Keeps the final asset export directory in git before images are produced.
- Modify only if missing: `.gitignore`
  - Keep `.superpowers/` ignored so visual companion sessions do not enter git.

## Source References

- Approved spec: `docs/superpowers/specs/2026-07-03-ai-image-storyselling-marketing-design.md`
- Product source data: `src/data/products.json`
- Official product assets:
  - `public/images/products/official/benediktiner/`
  - `public/images/products/official/bitburger/`
  - `public/images/products/official/rappenhof/`
  - `public/images/products/official/thorle/`
- Existing generated marketing images:
  - `public/images/products/`
  - `public/images/products/amc_assets/`
  - `public/images/marketing/social/`
  - `public/images/facebook/`

## Task 1: Create The Marketing Production Hub

**Files:**
- Create: `docs/marketing/ai-image-storyselling/README.md`
- Create: `public/images/marketing/storyselling/2026-07/.gitkeep`

- [ ] **Step 1: Create folders**

Run:

```powershell
New-Item -ItemType Directory -Force -Path `
  "docs\marketing\ai-image-storyselling", `
  "public\images\marketing\storyselling\2026-07" | Out-Null
```

Expected: folders exist.

- [ ] **Step 2: Add the asset folder marker**

Create `public/images/marketing/storyselling/2026-07/.gitkeep` with this exact content:

```text

```

- [ ] **Step 3: Write the production hub README**

Create `docs/marketing/ai-image-storyselling/README.md` with this exact content:

```markdown
# AI Image Storyselling Production Hub

This folder contains the working system for producing Bia Thay Tu marketing images using the approved storyselling direction: **Nguon Goc -> Chiec Ly**.

## Creative Principle

Each image should move through a small story:

1. Origin: German heritage, monastery tradition, Reinheitsgebot, Bavaria, Eifel, or official import trust.
2. Sensory bridge: pour, foam, glassware, amber color, hops, malt, serving temperature, or food pairing.
3. Vietnam moment: home table, hosting, gifting, weekend dinner, or learning to drink better.
4. Product reason: which Bia Thay Tu product fits the moment.
5. CTA: save, inbox, order set, ask for pairing, or read the article.

## Production Rule

Use AI for backgrounds, atmospheres, macro scenes, table settings, and editorial mood. Use official product assets for bottles, cans, kegs, labels, and packaging. Do not publish AI-generated fake labels.

## Output Folder

Final exported assets for the first month go here:

```text
public/images/marketing/storyselling/2026-07/
```

## Naming Convention

```text
YYYY-MM-DD_pillar_product_channel_ratio_variant.ext
```

Example:

```text
2026-07-08_heritage-benediktiner-facebook-4x5-v1.webp
```

## Working Files

- `prompt-library.md`: reusable prompts and negative constraints.
- `production-board.csv`: 30-day production queue.
- `qa-checklist.md`: review checklist before publishing.
- `first-batch.md`: the first four image briefs to validate the system.
```

- [ ] **Step 4: Verify Task 1**

Run:

```powershell
Test-Path "docs\marketing\ai-image-storyselling\README.md"
Test-Path "public\images\marketing\storyselling\2026-07\.gitkeep"
```

Expected:

```text
True
True
```

- [ ] **Step 5: Commit Task 1**

Run:

```powershell
git add docs\marketing\ai-image-storyselling\README.md public\images\marketing\storyselling\2026-07\.gitkeep
git commit -m "docs: add AI image storyselling production hub"
```

Expected: commit succeeds.

## Task 2: Create The Prompt Library

**Files:**
- Create: `docs/marketing/ai-image-storyselling/prompt-library.md`

- [ ] **Step 1: Create prompt library**

Create `docs/marketing/ai-image-storyselling/prompt-library.md` with this exact content:

```markdown
# AI Image Storyselling Prompt Library

## Global Prompt Frame

Use this for every background generation:

```text
Premium cinematic product background for imported German beer marketing.
Scene: {scene_type}.
Mood: deep navy, warm gold, dark wood, refined, realistic, quiet luxury.
Composition: leave clean negative space for official product compositing on {product_position}.
Lighting: warm side light, natural reflections, realistic shadows.
Camera: 85mm editorial product photography, shallow depth of field.
Details: amber beer, cream foam, clean glassware, subtle German heritage cues.
Constraints: no readable text, no fake brand labels, no logo, no people under 30, no drunk behavior, no driving, no fantasy style.
```

## Global Negative Prompt

```text
fake label, unreadable text, distorted product, fantasy castle, medieval costume, crowded beer party, nightclub, drunk behavior, car driving, underage person, plastic cup, cheap bar, oversaturated colors, cartoon style, low resolution, extra fingers, malformed hands, watermark, stock photo look
```

## Prompt 1: Heritage To Glass - Benediktiner

Use for hero visuals, Facebook covers, and SEO covers about Benediktiner or German beer heritage.

```text
Premium cinematic background for imported German wheat beer marketing, inspired by a Bavarian monastery cellar but realistic and restrained. Dark wood table in the foreground, subtle stone arch in the distance, warm gold side light, deep navy shadows, amber beer glow, clean negative space on the right for official Benediktiner bottle and Weizen glass compositing, editorial product photography, 85mm lens, shallow depth of field, realistic reflections, no readable text, no fake labels, no people, no fantasy style.
```

Product compositing source:

```text
public/images/products/official/benediktiner/
```

## Prompt 2: Heritage To Glass - Bitburger

Use for Bitburger premium Pilsner origin and trust posts.

```text
Premium cinematic background for imported German pilsner marketing, refined Eifel-inspired mood, deep navy and dark green shadows, warm gold highlight on a clean beer glass area, polished dark wood surface, subtle map-like texture in the background without readable text, clean negative space on the left for official Bitburger bottle or can compositing, realistic editorial product photography, 85mm lens, shallow depth of field, no readable text, no fake labels, no people, no party scene.
```

Product compositing source:

```text
public/images/products/official/bitburger/
```

## Prompt 3: Ritual Of Pouring

Use for educational posts about foam, glassware, and serving ritual.

```text
Close-up cinematic beer pouring scene, tall wheat beer glass with dense cream foam, amber cloudy beer, warm gold light, deep navy background, clean dark wood surface, macro editorial photography, realistic foam texture and condensation, leave clean space on the left for official product image, no readable text, no fake label, no hands, no distorted fingers.
```

## Prompt 4: Host Knows What To Serve

Use for hosting, gifting, partner meeting, and conversion posts.

```text
Premium Vietnamese home hosting table for 4 adults, dark wood dining table, warm evening light, refined cold cuts and grilled food, empty clean space in the foreground for official German beer bottle and glass compositing, quiet luxury mood, deep navy and warm gold accents, realistic food photography, no visible faces, no readable text, no fake labels, no chaotic party scene.
```

## Prompt 5: Germany Meets Vietnamese Food - Weissbier

Use for seafood, grilled chicken, and lighter food-pairing content.

```text
Refined Vietnamese seafood dinner table with warm evening light, grilled prawns and squid, clean ceramic plates, dark wood table, deep navy cloth accent, premium quiet mood, realistic food photography, clean negative space on the right for official Benediktiner Weissbier product and tall glass compositing, no readable text, no fake labels, no people, no messy party scene.
```

## Prompt 6: Germany Meets Vietnamese Food - Dunkel

Use for BBQ, beef, pork ribs, roasted meat, and rich evening meals.

```text
Premium dark wood dinner table with grilled pork ribs and roasted beef, warm amber light, deep navy shadows, subtle gold highlights, refined home hosting mood, clean negative space in the foreground for official Benediktiner Dunkel product and glass compositing, realistic food photography, no readable text, no fake labels, no people, no chaotic beer party.
```

## Prompt 7: Conversion Gift Set

Use for gift-set and partner-gifting visuals.

```text
Premium gift set scene for imported German beer, deep navy wrapping paper, warm gold ribbon, dark wood table, refined corporate gifting mood, clean negative space for official beer bottles, glassware, and opener compositing, realistic studio product photography, warm side light, no readable text, no fake labels, no people, no luxury cliche, no fantasy style.
```

## Prompt 8: Bitburger 0.0 Lifestyle

Use for alcohol-free Bitburger 0.0 content. Keep claims about lifestyle and choice, not health outcomes.

```text
Refined alcohol-free beer lifestyle background, bright but premium afternoon light, clean modern dining table, mineral water glass, citrus slice, deep green and warm gold accents, calm adult lifestyle mood, clean space for official Bitburger 0.0 product compositing, realistic editorial photography, no readable text, no fake labels, no gym performance claim, no driving scene, no medical or health symbolism.
```
```

- [ ] **Step 2: Verify prompt library has no forbidden placeholder words**

Run:

```powershell
$markers = @(
  ('T' + 'BD'),
  ('TO' + 'DO'),
  ('FIX' + 'ME'),
  ('implement' + ' later'),
  ('fill in' + ' details')
)
Select-String -Path docs\marketing\ai-image-storyselling\prompt-library.md -Pattern $markers -SimpleMatch
```

Expected: no output.

- [ ] **Step 3: Commit Task 2**

Run:

```powershell
git add docs\marketing\ai-image-storyselling\prompt-library.md
git commit -m "docs: add storyselling image prompt library"
```

Expected: commit succeeds.

## Task 3: Create The 30-Day Production Board

**Files:**
- Create: `docs/marketing/ai-image-storyselling/production-board.csv`

- [ ] **Step 1: Create production board**

Create `docs/marketing/ai-image-storyselling/production-board.csv` with this exact content:

```csv
day,date,pillar,asset_type,story_hook,product,primary_channel,ratios,cta,status
1,2026-07-04,Heritage To Glass,feed_post,Tu tu vien 400 nam den chiec ly toi nay,Benediktiner Naturtrub,Facebook main,"4:5;1:1",Save de hieu hon ve bia Duc,planned
2,2026-07-05,Heritage To Glass,carousel_cover,Reinheitsgebot 1516 trong mot chai bia Duc,Benediktiner Naturtrub,Sanh Bia Duc,"4:5;1:1",Doc tiep bai viet,planned
3,2026-07-06,Heritage To Glass,seo_cover,Bia Duc nhap khau chinh hang khac gi bia pho thong,Bitburger Premium Pils,Website SEO,"16:9",Xem danh muc bia Duc,planned
4,2026-07-07,Ritual Of Pouring,feed_post,Bot bia khong phai loi ma la linh hon,Weissbier glass,Facebook main,"4:5;9:16",Save de rot dung,planned
5,2026-07-08,Ritual Of Pouring,carousel_cover,3 buoc rot Weissbier dung chuan,Benediktiner Naturtrub,Sanh Bia Duc,"4:5;1:1",Luu lai khi rot bia,planned
6,2026-07-09,Ritual Of Pouring,seo_cover,Huong dan rot bia lua mi chuan chuyen gia,Benediktiner Naturtrub,Website SEO,"16:9",Doc huong dan day du,planned
7,2026-07-10,Host Knows What To Serve,feed_post,Chu nha biet chon khach biet minh duoc tran trong,Benediktiner Mix 2 Vi,Facebook main,"4:5;1:1",Inbox tu van set tiep khach,planned
8,2026-07-11,Host Knows What To Serve,conversion_image,Set tiep khach 4-6 nguoi can gi,Benediktiner + Bitburger,Facebook main,"4:5;9:16",Inbox TIỆC,planned
9,2026-07-12,Germany Meets Vietnamese Food,feed_post,Hai san nuong gap Weissbier vi sao hop,Benediktiner Naturtrub,Bia & Am Thuc,"4:5;1:1",Ask for pairing,planned
10,2026-07-13,Germany Meets Vietnamese Food,feed_post,BBQ va Dunkel buoi toi cuoi tuan,Benediktiner Dunkel,Bia & Am Thuc,"4:5;1:1",Save combo nay,planned
11,2026-07-14,Heritage To Glass,feed_post,Bitte ein Bit va gu Pilsner Duc,Bitburger Premium Pils,Bitburger Vietnam,"4:5;1:1",Inbox Bitburger,planned
12,2026-07-15,Host Knows What To Serve,conversion_image,Qua bieu bia Duc khac gi wine pho thong,Benediktiner gift set,Facebook main,"4:5;1:1",Inbox QUA,planned
13,2026-07-16,Ritual Of Pouring,feed_post,Nhiet do 6-8C lam Weissbier ngon hon,Benediktiner Naturtrub,Sanh Bia Duc,"4:5;9:16",Save de uop dung,planned
14,2026-07-17,Germany Meets Vietnamese Food,seo_cover,Food pairing bia Duc voi mon Viet,Benediktiner + Bitburger,Website SEO,"16:9",Doc bai pairing,planned
15,2026-07-18,Host Knows What To Serve,feed_post,Khach hoi bia gi day la luc ban chon dung,Benediktiner Dunkel,Tiep Khach Sanh Dieu,"4:5;1:1",Inbox set tiep khach,planned
16,2026-07-19,Heritage To Glass,feed_post,Bia Pilsner so 1 nuoc Duc tren ban tiec Viet,Bitburger Premium Pils,Bitburger Vietnam,"4:5;1:1",Dat ket Bitburger,planned
17,2026-07-20,Ritual Of Pouring,carousel_cover,Phan biet ly Weizen va ly Pilsner,Benediktiner + Bitburger,Sanh Bia Duc,"4:5;1:1",Follow de nang gu,planned
18,2026-07-21,Germany Meets Vietnamese Food,feed_post,Pizza va Pilsner combo kinh dien co ly do,Bitburger Premium Pils,Bia & Am Thuc,"4:5;1:1",Save for weekend,planned
19,2026-07-22,Host Knows What To Serve,conversion_image,Set trai nghiem lan dau cho nguoi moi,Benediktiner Mix + Bitburger,Facebook main,"4:5;9:16",Inbox THU,planned
20,2026-07-23,Heritage To Glass,seo_cover,Qua tang bia Duc cho doi tac,Benediktiner gift set,Website SEO,"16:9",Xem goi qua bieu,planned
21,2026-07-24,Ritual Of Pouring,feed_post,Vi sao nen uong bia Duc bang ly sach,Benediktiner glass,Sanh Bia Duc,"4:5;1:1",Save checklist,planned
22,2026-07-25,Host Knows What To Serve,feed_post,Ban toi dep bat dau tu mot chiec ly sach,Benediktiner Naturtrub,Tiep Khach Sanh Dieu,"4:5;1:1",Inbox TABLE,planned
23,2026-07-26,Germany Meets Vietnamese Food,feed_post,Bo kho va Dunkel vi am sau gap malt rang,Benediktiner Dunkel,Bia & Am Thuc,"4:5;1:1",Ask for pairing,planned
24,2026-07-27,Heritage To Glass,feed_post,Tu Eifel ve Ha Noi mot chai Pilsner dung gu,Bitburger Premium Pils,Bia Duc Ha Noi,"4:5;1:1",Inbox MENU,planned
25,2026-07-28,Host Knows What To Serve,conversion_image,Giao bia Duc nhanh cho buoi tiec toi nay,Benediktiner + Bitburger,Bia Duc Ha Noi,"4:5;9:16",Inbox DAT,planned
26,2026-07-29,Ritual Of Pouring,seo_cover,Nhiet do thuong thuc bia Duc ly tuong,Benediktiner + Bitburger,Website SEO,"16:9",Doc bai chi tiet,planned
27,2026-07-30,Heritage To Glass,feed_post,Official import khong chi la tem ma la niem tin,Assorted products,Facebook main,"4:5;1:1",Xem san pham,planned
28,2026-07-31,Germany Meets Vietnamese Food,feed_post,Com nha cuoi tuan cung Pilsner sach mieng,Bitburger Premium Pils,Bia & Am Thuc,"4:5;1:1",Save combo,planned
29,2026-08-01,Host Knows What To Serve,feed_post,Khi bieu tang thu that su uong duoc,Benediktiner gift set,Tiep Khach Sanh Dieu,"4:5;1:1",Inbox QUA,planned
30,2026-08-02,Heritage To Glass,feed_post,30 ngay uong bia co hieu biet hon,Assorted products,Facebook main,"4:5;1:1",Follow de xem series tiep,planned
```

- [ ] **Step 2: Verify CSV has 30 production rows plus header**

Run:

```powershell
((Import-Csv docs\marketing\ai-image-storyselling\production-board.csv) | Measure-Object).Count
```

Expected:

```text
30
```

- [ ] **Step 3: Verify each row has a planned status**

Run:

```powershell
Import-Csv docs\marketing\ai-image-storyselling\production-board.csv | Where-Object { $_.status -ne 'planned' }
```

Expected: no output.

- [ ] **Step 4: Commit Task 3**

Run:

```powershell
git add docs\marketing\ai-image-storyselling\production-board.csv
git commit -m "docs: add 30-day storyselling image board"
```

Expected: commit succeeds.

## Task 4: Create The QA Checklist

**Files:**
- Create: `docs/marketing/ai-image-storyselling/qa-checklist.md`

- [ ] **Step 1: Create QA checklist**

Create `docs/marketing/ai-image-storyselling/qa-checklist.md` with this exact content:

```markdown
# AI Image Storyselling QA Checklist

Use this checklist before any image is published or added to the website.

## Product Accuracy

- [ ] Bottle, can, keg, box, glassware, and opener come from official assets or are manually verified.
- [ ] No AI-generated fake label text appears on the product.
- [ ] Product shape and scale look plausible.
- [ ] Product shadow and reflection match the generated background.
- [ ] The visible product matches the post copy.

## Brand Fit

- [ ] Image uses the approved premium palette: deep navy, dark wood, warm gold, amber beer, cream foam.
- [ ] Mood feels refined, adult, and story-led.
- [ ] German heritage cues are subtle and realistic.
- [ ] Vietnamese context, if present, feels premium and natural.
- [ ] Image does not look like a cheap beer party, nightclub, or generic stock photo.

## Safety And Compliance

- [ ] No underage-looking people.
- [ ] No drunk behavior.
- [ ] No driving after alcohol.
- [ ] No unsafe drinking challenge, speed drinking, or excessive consumption cue.
- [ ] Alcohol posts include `18+` and responsible drinking note where required.
- [ ] Bitburger 0.0 posts avoid medical, fitness-performance, or health claims.

## Storyselling

- [ ] The image supports at least three story beats: origin, sensory bridge, Vietnam moment, product reason, CTA.
- [ ] The caption hook can be understood in one sentence.
- [ ] The product reason is specific, not generic.
- [ ] CTA is clear: save, inbox, order, ask for pairing, or read article.

## Export Quality

- [ ] Feed export: 4:5.
- [ ] Square fallback: 1:1 when needed.
- [ ] SEO/blog export: 16:9 when needed.
- [ ] Story/reel cover: 9:16 when needed.
- [ ] File name follows `YYYY-MM-DD_pillar_product_channel_ratio_variant.ext`.
- [ ] Web export is compressed to `.webp` unless a platform requires another format.

## Publishing Metadata

- [ ] Alt text describes the actual scene and product.
- [ ] Caption does not overclaim product benefits.
- [ ] Hashtags match the satellite page or campaign.
- [ ] Link or inbox keyword is included when the post is conversion-led.
```

- [ ] **Step 2: Verify checklist has all required sections**

Run:

```powershell
Select-String -Path docs\marketing\ai-image-storyselling\qa-checklist.md -Pattern "Product Accuracy|Brand Fit|Safety And Compliance|Storyselling|Export Quality|Publishing Metadata"
```

Expected: six matching section lines.

- [ ] **Step 3: Commit Task 4**

Run:

```powershell
git add docs\marketing\ai-image-storyselling\qa-checklist.md
git commit -m "docs: add storyselling image QA checklist"
```

Expected: commit succeeds.

## Task 5: Define The First Four Pilot Images

**Files:**
- Create: `docs/marketing/ai-image-storyselling/first-batch.md`

- [ ] **Step 1: Create first batch brief**

Create `docs/marketing/ai-image-storyselling/first-batch.md` with this exact content:

```markdown
# First Batch: AI Image Storyselling Pilot

This pilot validates the approved "Nguon Goc -> Chiec Ly" system before producing the full 30-day board.

## Batch Acceptance Criteria

- Four final images are exported.
- Each image has at least one feed ratio `4:5`.
- SEO image also has `16:9`.
- Every product is composited from official product assets.
- Every image passes `qa-checklist.md`.

## Image 1: Tu Vien 400 Nam Den Chiec Ly Toi Nay

Pillar: Heritage To Glass

Product: Benediktiner Naturtrub

Official asset folder:

```text
public/images/products/official/benediktiner/
```

AI background prompt:

```text
Premium cinematic background for imported German wheat beer marketing, inspired by a Bavarian monastery cellar but realistic and restrained. Dark wood table in the foreground, subtle stone arch in the distance, warm gold side light, deep navy shadows, amber beer glow, clean negative space on the right for official Benediktiner bottle and Weizen glass compositing, editorial product photography, 85mm lens, shallow depth of field, realistic reflections, no readable text, no fake labels, no people, no fantasy style.
```

Copy spine:

```text
Tu vien 400 nam khong nam trong chiec nhan. No nam trong cach ban rot chai bia toi nay: dung ly, dung nhiet do, dung khoanh khac.
```

Output files:

```text
public/images/marketing/storyselling/2026-07/2026-07-04_heritage-benediktiner-facebook-4x5-v1.webp
public/images/marketing/storyselling/2026-07/2026-07-04_heritage-benediktiner-facebook-1x1-v1.webp
```

## Image 2: Bot Bia Khong Phai Loi

Pillar: Ritual Of Pouring

Product: Benediktiner Naturtrub or neutral Weizen glass with official product beside it

Official asset folder:

```text
public/images/products/official/benediktiner/
```

AI background prompt:

```text
Close-up cinematic beer pouring scene, tall wheat beer glass with dense cream foam, amber cloudy beer, warm gold light, deep navy background, clean dark wood surface, macro editorial photography, realistic foam texture and condensation, leave clean space on the left for official product image, no readable text, no fake label, no hands, no distorted fingers.
```

Copy spine:

```text
Bot bia khong phai ke thu. Voi Weissbier, lop bot kem la thu giu huong, giu ga, va lam chiec ly nhin dung chuan hon.
```

Output files:

```text
public/images/marketing/storyselling/2026-07/2026-07-07_ritual-weissbier-facebook-4x5-v1.webp
public/images/marketing/storyselling/2026-07/2026-07-07_ritual-weissbier-story-9x16-v1.webp
```

## Image 3: Chu Nha Biet Chon

Pillar: Host Knows What To Serve

Product: Benediktiner Mix 2 Vi or Benediktiner Naturtrub + Dunkel

Official asset folder:

```text
public/images/products/official/benediktiner/
```

AI background prompt:

```text
Premium Vietnamese home hosting table for 4 adults, dark wood dining table, warm evening light, refined cold cuts and grilled food, empty clean space in the foreground for official German beer bottle and glass compositing, quiet luxury mood, deep navy and warm gold accents, realistic food photography, no visible faces, no readable text, no fake labels, no chaotic party scene.
```

Copy spine:

```text
Chu nha biet chon khong can noi qua nhieu. Mot chiec ly sach, mot chai bia Duc dung gu, va khach tu hieu minh duoc chuan bi can than.
```

Output files:

```text
public/images/marketing/storyselling/2026-07/2026-07-10_hosting-benediktiner-facebook-4x5-v1.webp
public/images/marketing/storyselling/2026-07/2026-07-10_hosting-benediktiner-facebook-1x1-v1.webp
```

## Image 4: Bia Duc Nhap Khau Chinh Hang

Pillar: Heritage To Glass

Product: Bitburger Premium Pils or assorted official import visual

Official asset folder:

```text
public/images/products/official/bitburger/
```

AI background prompt:

```text
Premium cinematic background for imported German pilsner marketing, refined Eifel-inspired mood, deep navy and dark green shadows, warm gold highlight on a clean beer glass area, polished dark wood surface, subtle document and import-stamp inspired texture in the background without readable text, clean negative space on the left for official Bitburger bottle or can compositing, realistic editorial product photography, 85mm lens, shallow depth of field, no readable text, no fake labels, no people, no party scene.
```

Copy spine:

```text
Chinh hang khong chi la tem. Do la nguon goc ro, bao quan dung, va chai bia den ban voi dung tinh than ma nha nau bia muon giu lai.
```

Output files:

```text
public/images/marketing/storyselling/2026-07/2026-07-06_heritage-bitburger-seo-16x9-v1.webp
public/images/marketing/storyselling/2026-07/2026-07-06_heritage-bitburger-facebook-4x5-v1.webp
```
```

- [ ] **Step 2: Verify each pilot image has output files listed**

Run:

```powershell
Select-String -Path docs\marketing\ai-image-storyselling\first-batch.md -Pattern "public/images/marketing/storyselling/2026-07/" | Measure-Object
```

Expected: Count is `9` or greater because the folder path appears in the criteria and output lists.

- [ ] **Step 3: Commit Task 5**

Run:

```powershell
git add docs\marketing\ai-image-storyselling\first-batch.md
git commit -m "docs: define first storyselling image batch"
```

Expected: commit succeeds.

## Task 6: Run Final Documentation Verification

**Files:**
- Verify: `docs/marketing/ai-image-storyselling/README.md`
- Verify: `docs/marketing/ai-image-storyselling/prompt-library.md`
- Verify: `docs/marketing/ai-image-storyselling/production-board.csv`
- Verify: `docs/marketing/ai-image-storyselling/qa-checklist.md`
- Verify: `docs/marketing/ai-image-storyselling/first-batch.md`
- Verify: `public/images/marketing/storyselling/2026-07/.gitkeep`

- [ ] **Step 1: Verify all required files exist**

Run:

```powershell
$required = @(
  "docs\marketing\ai-image-storyselling\README.md",
  "docs\marketing\ai-image-storyselling\prompt-library.md",
  "docs\marketing\ai-image-storyselling\production-board.csv",
  "docs\marketing\ai-image-storyselling\qa-checklist.md",
  "docs\marketing\ai-image-storyselling\first-batch.md",
  "public\images\marketing\storyselling\2026-07\.gitkeep"
)
$required | ForEach-Object { if (-not (Test-Path $_)) { "MISSING $_" } }
```

Expected: no output.

- [ ] **Step 2: Verify there are no placeholder markers**

Run:

```powershell
$markers = @(
  ('T' + 'BD'),
  ('TO' + 'DO'),
  ('FIX' + 'ME'),
  ('implement' + ' later'),
  ('fill in' + ' details')
)
Select-String -Path docs\marketing\ai-image-storyselling\* -Pattern $markers -SimpleMatch
```

Expected: no output.

- [ ] **Step 3: Verify production board count**

Run:

```powershell
((Import-Csv docs\marketing\ai-image-storyselling\production-board.csv) | Measure-Object).Count
```

Expected:

```text
30
```

- [ ] **Step 4: Verify git diff whitespace**

Run:

```powershell
git diff --check
```

Expected: exit code `0`. Line-ending warnings are acceptable on Windows if there are no whitespace error lines.

- [ ] **Step 5: Review final git state**

Run:

```powershell
git status --short
```

Expected: clean working tree after all task commits.

## Task 7: Produce Pilot Images After Documentation Is Approved

**Files:**
- Read: `docs/marketing/ai-image-storyselling/first-batch.md`
- Read: `docs/marketing/ai-image-storyselling/qa-checklist.md`
- Create exported images in: `public/images/marketing/storyselling/2026-07/`

- [ ] **Step 1: Generate AI backgrounds only**

For each of the four pilot briefs in `first-batch.md`, generate a background using the listed AI prompt. Do not ask the image model to render official product labels.

Expected raw backgrounds:

```text
public/images/marketing/storyselling/2026-07/work/2026-07-04_heritage-benediktiner-bg-v1.png
public/images/marketing/storyselling/2026-07/work/2026-07-07_ritual-weissbier-bg-v1.png
public/images/marketing/storyselling/2026-07/work/2026-07-10_hosting-benediktiner-bg-v1.png
public/images/marketing/storyselling/2026-07/work/2026-07-06_heritage-bitburger-bg-v1.png
```

- [ ] **Step 2: Composite official product assets**

Place official product assets from the listed official folders into each background. Adjust scale, shadow, reflection, and color temperature manually.

Expected: product labels remain official and readable where the source asset is readable.

- [ ] **Step 3: Export final files**

Export exactly the file names listed in `first-batch.md`.

- [ ] **Step 4: Run QA**

Open `docs/marketing/ai-image-storyselling/qa-checklist.md` and check every applicable item for each image.

Expected: no unresolved product accuracy or safety issues.

- [ ] **Step 5: Commit pilot images**

Run:

```powershell
git add public\images\marketing\storyselling\2026-07 docs\marketing\ai-image-storyselling\first-batch.md
git commit -m "assets: add first storyselling image pilot"
```

Expected: commit succeeds after images are approved.

## Self-Review

Spec coverage:

- Premium identity: covered by README, prompt library, QA checklist, and first-batch briefs.
- Repeatable social/SEO production: covered by production board and prompt library.
- Hybrid AI background plus official compositing: covered by README, prompt library, first-batch, and Task 7.
- Storyselling formula: covered by README, production board hooks, and first-batch copy spines.
- QA guardrails: covered by QA checklist and final verification tasks.
- Naming and output folders: covered by README, first-batch, and `.gitkeep`.

Placeholder scan:

- The plan intentionally avoids forbidden placeholder markers.
- The scan commands build marker strings dynamically, so the plan does not include those markers verbatim.
- Prompt variables appear only in reusable prompt-frame examples and are concretely instantiated in the ready-to-run prompts.

Scope check:

- This plan is a production-system setup plus one pilot batch.
- Website integration and automated image generation are out of scope until the first image formulas are approved.
