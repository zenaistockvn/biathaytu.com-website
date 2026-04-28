# Media Prompt Framework — Bia Thay Tu v2.0
## Toi uu cho Nano Banana (anh) + Google VEO 3 (video) — Cap nhat 03/2026

> **Cross-reference:** Prompt library day du → xem `beer-image-prompts` skill
> **Cong thuc chuan:** Spec-Sheet Framework 6 phan (Subject → Camera → Setting → Lighting → Style → Constraints)

---

## PHAN 1: NANO BANANA — Prompt Tao Anh Chan Thuc

### 1.1 Cong Thuc Chuan (BAT BUOC)

```
[Photography Type], [Subject Description], [Action/Pose],
[Setting/Location], [Composition/Camera Angle], [Lens + Aperture],
[Lighting Setup], [Color Palette/Mood], [Texture/Detail Cues],
[Aspect Ratio]. [Negative Prompt if needed].
```

### 1.2 Quy Tac Vang Cho Nano Banana (Cap nhat 2026)

| # | Quy tac | Giai thich |
|---|---------|-----------|
| 1 | **Front-load Subject** | 20 tu dau tien MO TA SAN PHAM — AI chu y nhat phan dau prompt |
| 2 | **Camera realism** | Goi ten camera cu the: "Shot on Hasselblad X2D, 90mm, f/4" → chat luong tang ro ret |
| 3 | **Mo ta light BEHAVIOR** | "warm rim light highlighting glass edges" > "warm lighting" (mo ta anh sang LAM GI) |
| 4 | **Chi dinh lens cu the** | 85mm f/1.4 (portrait) - 50mm f/1.8 (lifestyle) - 100mm macro (detail) - 35mm f/2.8 (wide scene) |
| 5 | **Positive language** | "sharp crisp focus" THAY "no blur". "clean composition" THAY "no mess" |
| 6 | **Texture cue bat buoc** | "natural skin texture", "visible condensation droplets", "fine foam bubbles", "wood grain detail" |
| 7 | **Aspect ratio truoc** | Quyet dinh ratio TRUOC khi viet prompt de framing dung |
| 8 | **Upload reference** | Nano Banana ho tro 8-14 anh ref → brand consistency cao hon text-only 3-5x |
| 9 | **Iterate 1 bien/lan** | Moi lan chi chinh 1 thu (lighting HOAC angle HOAC setting). Khong thay 3 thu cung luc |
| 10 | **Conversational editing** | Dung follow-up: "Keep everything, change background to [X]" — KHONG regenerate tu dau |

### 1.3 Lighting Vocabulary (Chon 1-2 cho moi prompt)

| Lighting | Khi nao dung | Hieu ung |
|----------|-------------|-----------|
| `soft golden hour sunlight streaming through window` | After-work, solo, warm mood | Am ap, intimate |
| `warm candlelight with deep amber shadows` | Dinner, hosting, Dunkel | Sang trong, cozy |
| `three-point studio softbox lighting` | Product hero shot | Sach, professional |
| `dramatic single-source rim lighting` | Brand manifesto, premium | Dramatic, high-end |
| `bright natural daylight, slightly overcast` | Education, pairing, outdoor | Fresh, clean |
| `low-key chiaroscuro lighting, deep shadows` | Dunkel, night, moody | Mysterious, artsy |
| `backlit with lens flare and warm haze` | Lifestyle, outdoor | Dreamy, editorial |

### 1.4 Camera Settings Cheat Sheet

| Muc dich | Lens | Aperture | Effect |
|----------|------|----------|--------|
| **Portrait/Lifestyle** | 85mm | f/1.4 | Bokeh manh, subject noi bat |
| **Product hero** | 50mm | f/2.8 | Can bang sharp + bokeh |
| **Food flat lay** | 35mm | f/4 | Toan canh sac net |
| **Beer detail/foam** | 100mm macro | f/2.8 | Chi tiet bot, giot nuoc cuc ro |
| **Scene/hosting** | 35mm | f/2 | Wide view, boi canh ro |
| **Overhead** | 24mm | f/5.6 | Flat lay toan ban, sac net |

### 1.5 Template Prompt Nano Banana - Theo Occasion

#### Product Hero Shot
```
Commercial product photography of a [ten san pham] [chai/lon] standing
beside a [loai ly] filled with [mo ta mau bia + foam]. The glass shows
[chi tiet: condensation droplets, fine bubbles rising, cream foam 2cm
thick]. Placed on [surface: dark oak table / black marble / rustic wood].
Background: [mo ta bg blur]. Shot on 50mm f/2.8 lens, three-point
studio softbox lighting with subtle rim light from behind. Ultra-sharp
focus on label and glass, shallow depth of field. Rich, deep color tones.
[Aspect ratio]. No text, no watermark, no distortion.
```

#### Hosting / Dinner Scene
```
Editorial lifestyle photography of a Vietnamese man in his 30s, smart
casual attire, [action: setting up dinner table / pouring beer /
arranging glasses]. A warm, intimate home dining room with [props: dark
wood table, white ceramic plates, cloth napkins, lit candles, artisan
bread board]. [San pham] bottles and branded [loai ly] glasses arranged
naturally on the table. Shot on 35mm f/2 lens, warm candlelight mixed
with soft pendant lamp glow from above. Natural skin texture, visible
fabric detail on napkins, wood grain on table. Cinematic color grading
with amber highlights and deep shadows. [Aspect ratio]. No text, no
watermark, no cartoon.
```

#### Food Pairing
```
Professional food photography, overhead 45-degree angle. A perfectly
[cooked method] [ten mon an] on a dark ceramic plate, beside a [loai ly]
glass of [mo ta bia: color, clarity, foam]. Garnished with [herbs, sauce].
Props: wooden cutting board, linen napkin, vintage knife, scattered sea
salt flakes. Shot on 100mm macro f/2.8, bright natural daylight from left
side window, slight shadows on right creating depth. Ultra-sharp food
texture detail: [crust/juice/grill marks + foam bubbles + condensation].
Warm, appetizing color palette: deep browns, golden amber, cream white.
[Aspect ratio]. No text, no watermark, no illustration.
```

#### Gift / Unboxing
```
Premium gift photography. Close-up of hands carefully opening a dark
kraft paper gift box revealing [san pham] bottles nestled inside foam
packaging. A handwritten thank-you card and branded tasting note card
visible on top. Shot on 85mm f/1.8, shallow depth of field with focus
on the reveal moment. Studio lighting: warm spotlight from above, dark
matte background. Visible paper texture, ribbon detail, bottle label
crisp. Luxurious, clean composition. [Aspect ratio]. No text overlay,
no watermark, no distortion.
```

#### Detail / Macro
```
Extreme close-up macro photography of [san pham] [lon/chai] surface
showing [condensation water droplets running down, frost crystals on
metal, brand emboss detail]. Refraction of light through water drops.
Shot on 100mm macro f/2.8, precise studio lighting with rim light
creating glow behind droplets. Super sharp focus, 8K detail. Dark
ambient background. [Aspect ratio]. No text, no watermark.
```

#### Lifestyle Portrait
```
Candid lifestyle portrait of a Vietnamese man, early 30s, [outfit:
linen shirt / smart casual polo], [action: holding a glass of beer on
apartment balcony / sitting at a reading corner / standing at a rooftop
bar]. Expression: relaxed, confident, genuine. Shot on 85mm f/1.4,
shallow depth of field, subject in sharp focus, background soft bokeh
with [city lights / warm room glow / sunset]. [Lighting: golden hour /
warm lamp]. Natural skin texture, no heavy editing. Editorial lifestyle
photography style. [Aspect ratio]. No text, no watermark, no glossy skin.
```

---

## PHAN 2: GOOGLE VEO 3 — Prompt Tao Video Viral (v2.0)

> UPDATE 03/2026: Framework viet lai hoan toan dua tren nghien cuu best practices moi nhat.
> Do dai toi uu: **100-150 WORDS** (khoang 400-700 ky tu). 4-6 cau. 1 action/clip.

### 2.1 Cong Thuc Chuan VEO 3 v2.0 (BAT BUOC)

```
1. CAMERA:   Shot type + framing + movement (RIENG 1 CAU)
2. SUBJECT:  Mo ta cu the (tuoi, trang phuc, dac diem)
3. ACTION:   1 hanh dong chinh + 1 micro-action
4. SETTING:  Boi canh + nguon sang + huong sang + color grade
5. AUDIO:    SFX cu the + Ambient layer

+ AVOID:    Liet ke noun phrases (KHONG dung "no" hay "don't")

Tong: 100-150 words. 4-6 cau. Dung THI HIEN TAI.
```

### 2.2 Quy Tac Vang v2.0

| # | Quy tac | Chi tiet |
|---|---------|----------|
| 1 | **100-150 words** | Duoi 100 = generic. Tren 175 = VEO3 bo qua random. Sweet spot: 120-140 words |
| 2 | **1 clip = 1 action = 1 camera move** | KHONG nhoi nhieu hanh dong vao 1 prompt 4-8s |
| 3 | **Camera = 1 cau rieng biet** | "The camera performs a slow dolly-in." TACH khoi mo ta chinh |
| 4 | **Front-load style** | Dat "Cinematic" hoac style quan trong nhat o DAU prompt |
| 5 | **Thi hien tai** | "The camera pans", "A man walks", "Light reflects" |
| 6 | **Micro-actions** | Chi tiet vat ly nho: "slight hesitation", "eyes close briefly", "wrist rotates" |
| 7 | **Avoid = noun phrases** | KHONG dung "no"/"don't". Chi liet ke: "waxy skin, morphing, ghosting" (8-12 items) |
| 8 | **Ky thuat CU THE** | KHONG "cinematic feel" -> NEN "35mm film grain, shallow depth of field" |
| 9 | **I2V khi co the** | Tao hero frame bang Nano Banana truoc -> animate bang VEO3. Dep hon T2V |
| 10 | **Iterate 5-10 lan** | Dieu chinh 1 bien moi lan: lighting HOAC camera HOAC subject |

### 2.3 Camera Movement Vocabulary v2

| Movement | Prompt Text (ngan gon) | Khi nao dung |
|----------|------------------------|--------------|
| **Dolly in** | `Slow dolly-in, 85mm` | Product reveal, pour |
| **Dolly out** | `Gradual dolly-out to wide` | Scene reveal, hosting |
| **Track** | `Tracking shot, eye-level` | Follow subject, lifestyle |
| **Orbit** | `Slow 90 degree orbit` | Product hero, table setting |
| **Crane down** | `Crane descending to eye-level` | Dinner reveal, overview |
| **Crane up** | `Crane rising to overhead` | Rooftop, BBQ, landscape |
| **Static macro** | `Locked-off macro, 100mm` | ASMR, pour detail, condensation |
| **Handheld** | `Gentle handheld sway` | UGC feel, authenticity |
| **Whip pan** | `Fast whip-pan landing on` | Hook, energy, surprise |

> Gioi han orbit o **90 degrees** thay vi 180. VEO3 thuong loi ghosting khi quay qua rong.

### 2.4 Cinematic Look Presets (Chon 1 cho moi prompt)

| Preset | Them vao prompt | Dung cho |
|--------|-----------------|----------|
| **Warm Commercial** | `Clean commercial look. Warm 5500K key light. Filled shadows. Rich colors.` | Product hero, hosting dinner |
| **Moody ASMR** | `Low-key lighting. Single warm source from above. Deep shadows. 35mm grain.` | Beer detail, pour, night |
| **Dreamy Lifestyle** | `Golden hour backlight. Soft bloom. Shallow depth of field. Warm tones.` | After-work, balcony, solo relax |
| **Raw Documentary** | `Available light only. Gentle handheld sway. Natural color. No filter.` | UGC, behind-the-scenes |
| **Premium Dark** | `Chiaroscuro lighting. Single rim light. Matte black background. Gold accents.` | Dunkel, gift, brand manifesto |
| **Film Cinematic** | `Shot on 35mm film. Subtle grain. Halation on highlights. Anamorphic oval bokeh.` | High-end brand video, TVC |
| **Teal-Orange** | `Warm amber highlights, cool blue shadows. Cinematic teal-orange grade.` | Rooftop, city, evening |

### 2.5 Audio Design v2 - Timeline-based

```
AUDIO FORMULA v2.0:
Audio: [SFX 1 with timing]. [SFX 2]. [Ambient layer]. [Music neu can].

Vi du:
"Audio: Sharp metallic pop at 0.5s. Fizz hiss lasting 2 seconds.
Quiet room tone. No music."
```

#### SFX Library cho Bia (ngan gon, cu the)
| Moment | Prompt Text |
|--------|-------------|
| Mo lon | `Sharp metallic click-pop, brief fizz hiss` |
| Rot bia | `Thick golden pour, glass resonance, foam building` |
| Bot bia | `Quiet effervescent crackling of tiny bubbles` |
| Cham ly | `Clear crystalline glass clink` |
| Cat steak | `Crisp knife through seared crust, sizzle` |
| Da lanh | `Ice cubes shifting and clinking in metal bucket` |
| Nuong | `Grill sizzle, fat dropping on hot coals` |
| Mo hop | `Paper rustling, cardboard fold, soft bottle clink` |

### 2.6 Template Prompt VEO 3 v2.0 - Theo Occasion

#### Product ASMR - De Viral nhat
```
Locked-off macro, 100mm lens. A thumb slowly presses the pull tab on
a [ten san pham] [lon/chai] -- slight hesitation, then a crisp pop.
Fine carbonation mist rises. [dark oak surface / black marble].
Single warm overhead spotlight, dark background. 35mm film grain,
shallow depth of field.

Audio: Metallic click-pop at 0.5s. 2-second fizz hiss fading to
quiet carbonation crackle. Room silence.

Avoid: waxy skin, morphing, ghosting, text overlay, jittery motion,
watermark, blurred edges.
```

#### Food Pairing - Satisfying Cut
```
Medium close-up, slight dolly-in. A sharp knife slices through a
seared [ten mon] -- [mo ta ben trong: pink juicy center / crispy
golden shell]. Steam rises gently from the cut. A [loai ly] glass
of [mo ta bia] sits beside the plate, condensation catching
warm light. Directional golden light from left, amber grade.

Audio: Crisp blade through crust, gentle sizzle, distant soft
jazz piano.

Avoid: plastic food look, oversaturated, shaky camera, morphing,
text overlay, floating objects.
```

#### Hosting - Dinner Table Reveal
```
Overhead crane slowly descending to eye-level. A beautifully set
dinner table: white plates, lit candles, [san pham] bottles at
center, branded glasses filled with [mo ta bia]. Candlelight
reflects warmly off glassware and dark wood. Deep amber shadows.

Audio: Gentle candle flame flicker. Quiet room tone. Barely
audible classical strings.

Avoid: jittery motion, blurry edges, morphing, artificial
lighting, floating objects, text overlay.
```

#### Unboxing - POV ASMR
```
Close-up POV, looking down. Hands slowly pull a gold ribbon on
a dark kraft gift box. Fingers carefully unfold the lid, revealing
[san pham] bottles in protective packaging. A handwritten card
rests on top. Soft natural daylight from a large window, clean
white surface. Shallow depth of field.

Audio: Ribbon sliding through cardboard. Paper rustling. Soft
bottle clink. Room silence.

Avoid: shaky hands, fast motion, waxy skin, text overlay,
floating limbs, morphing, watermark.
```

#### Pour Sequence - The Money Shot
```
Locked-off medium close-up, warm side light from left. A hand
tilts an empty branded [loai ly] glass at 45 degrees, then slowly
pours [ten san pham] -- [mo ta mau: crystal golden / cloudy amber /
rich chestnut] liquid flows along the inside wall. Glass straightens
as [mo ta foam: thick creamy white dome / dense tan cap] rises
above the rim. Subtle backglow through the beer. Dark background.

Audio: Thick satisfying liquid pour building to foam crackling.
Glass resonance. Complete silence.

Avoid: spillage, unnatural color, fast motion, blurry foam,
morphing, watermark, text overlay.
```

#### 3-Second Hook - Scroll Stopper
```
Extreme close-up whip-pan landing on a [san pham] [lon/chai].
The tab pops open with a dramatic mist burst in slow motion.
Camera holds on the fizzing opening for 2 seconds. High-contrast
rim lighting, dark background. Anamorphic lens flare.

Audio: Fast whoosh. Metallic pop with reverb. Bass impact hit
synced to the pop.

Avoid: motion blur, ghosting, morphing, text, watermark,
jittery motion, blurred edges.
```

#### Lifestyle Solo - After-work Moment
```
Medium shot, gentle handheld sway. A Vietnamese man in his 30s
sits on an apartment balcony at golden hour, holding a glass of
[mo ta bia]. He takes a slow sip, eyes closing briefly. City
skyline softly blurred behind him. Golden hour backlight, soft
bloom, shallow depth of field. Natural skin texture.

Audio: Distant city hum. Glass set down on wooden railing.
Faint evening breeze.

Avoid: waxy skin, uncanny valley face, morphing, oversaturated,
text overlay, watermark, glossy skin.
```

#### Cheers Moment - Social Energy
```
Medium close-up, locked-off. Four hands holding branded glasses
filled with [mo ta bia] move toward center frame. Glasses clink
together -- foam splashes slightly. Camera holds 2 seconds on the
glasses together. Warm amber candlelight, dark restaurant
background with soft bokeh.

Audio: Crystalline glass clink with half-second resonance.
Cheerful laughter. Quiet ambient restaurant murmur.

Avoid: floating limbs, extra fingers, morphing hands, ghosting,
text overlay, waxy skin, watermark.
```

### 2.7 Image-to-Video Workflow (I2V) - Ket qua dep nhat

> I2V cho output dep hon T2V dang ke vi lock composition + lighting tu anh tham chieu.

```
BUOC 1: Tao "Hero Frame" bang Nano Banana (dung prompt anh PHAN 1)
         -> Chon anh dep nhat lam reference image

BUOC 2: Upload anh vao VEO3 -> CHI prompt hanh dong + camera + audio
         -> KHONG mo ta lai visual da co trong anh

BUOC 3: I2V prompt chi can 50-100 ky tu
```

#### I2V Prompt Templates (khi da co hero frame)

```
Product tren ban:
"Slow dolly-in. Foam in the glass settles gently. A condensation
droplet slides down the bottle. Audio: Quiet carbonation crackle.
Room silence. Avoid: morphing, jittery, color shift."
```

```
Lifestyle portrait:
"Gentle handheld sway. The man lifts the glass slowly, takes
a sip, and sets it down. Audio: Glass contact on wood. City
hum. Avoid: waxy skin, morphing, uncanny face."
```

```
Food pairing:
"Static close-up. Steam rises from the dish. Camera holds.
Audio: Gentle sizzle fading. Quiet room.
Avoid: morphing, color shift, floating objects."
```

### 2.8 Multi-Shot Continuity (Anchor Method)

Khi tao chuoi clip noi nhau, copy-paste **"Anchor Token"** vao MOI prompt de VEO3 giu consistency:

```
ANCHOR TOKENS (copy-paste khi can):

Benediktiner Weissbier:
"tall dark-brown Benediktiner bottle with monastery label, cloudy
golden-amber wheat beer in tall Weizen glass, thick white foam"

Benediktiner Dunkel:
"dark-brown Benediktiner bottle, rich chestnut-brown cloudy beer
in tall Weizen glass, dense tan foam cap"

Bitburger Premium Pils:
"green Bitburger can with gold label, crystal-clear golden pilsner
in branded tulip glass, thin white foam"

Bitburger 0.0%:
"blue Bitburger 0.0% can, clear golden alcohol-free pilsner in
tulip glass, fine white foam"
```

### 2.9 STORYBOARD — 30s Commercial Workflow

> KHONG bao gio tao 30s video bang 1 prompt. Tach thanh 5-6 BEATS, moi beat 1 prompt rieng.

#### Storyboard Template: "Refreshing Moment"

| Beat | Thoi gian | Shot | Muc dich |
|------|----------|------|----------|
| 1 | 0-3s | **HOOK** — Extreme macro whip-pan | Bat mat, dung cuon |
| 2 | 3-8s | **CONTEXT** — Medium wide, scene | Gioi thieu boi canh |
| 3 | 8-13s | **PRODUCT** — Dolly-in hero | Gioi thieu san pham |
| 4 | 13-18s | **ACTION** — Pour/Open/Clink | Hanh dong chinh, satisfying |
| 5 | 18-25s | **PAYOFF** — Close-up reaction/sip | Cam xuc, desire |
| 6 | 25-30s | **TAG** — Product hero + tagline space | Brand recall |

#### Beat-by-Beat Prompts — Benediktiner "After Work"

**Beat 1: HOOK (3s)**
```
Extreme close-up whip-pan landing on a condensation-covered Benediktiner 
Weissbier bottle. Single dramatic rim light catches water droplets. 
Dark background. Anamorphic lens flare across the bottle surface.

Audio: Fast whoosh transitioning to quiet fizz. Bass impact hit.

Avoid: motion blur, ghosting, morphing, text, watermark.
```

**Beat 2: CONTEXT (5s)**
```
Wide establishing shot. A modern Saigon apartment balcony at golden hour. 
City skyline warm and hazy in the distance. Camera slowly pans right to 
reveal a small table with Benediktiner bottle and Weizen glass. 
Warm golden backlight, soft bloom, cinematic teal-orange grade.

Audio: Distant city hum. Gentle evening breeze.

Avoid: morphing, jittery, floating objects, text overlay.
```

**Beat 3: PRODUCT (5s)**
```
Slow dolly-in toward the Benediktiner Weissbier bottle and filled Weizen 
glass on a wooden balcony table. The cloudy golden-amber beer catches 
golden hour light, thick cream foam visible. Condensation droplets 
glisten on the dark brown bottle. Shallow depth of field.

Audio: Quiet carbonation crackle. Distant city ambiance.

Avoid: color shift, morphing, blurry label, text overlay.
```

**Beat 4: ACTION (5s)**
```
Medium close-up. A hand lifts the Benediktiner bottle and slowly pours 
golden-amber beer into the tilted Weizen glass. Liquid cascades along 
the inside wall. Creamy white foam rises steadily. Warm side lighting 
from the setting sun highlights the pour stream.

Audio: Thick satisfying pour building to foam crackling. Glass resonance.

Avoid: spillage, unnatural color, morphing, fast motion, blurry foam.
```

**Beat 5: PAYOFF (7s)**
```
Medium shot, gentle handheld sway. Vietnamese man in his early 30s, 
linen shirt, picks up the Weizen glass. He takes a slow sip, eyes 
closing briefly in satisfaction. Sets the glass down gently. City 
skyline golden behind him. Natural skin texture, warm golden light.

Audio: Soft sip. Glass set down on wood. Contented exhale. City hum.

Avoid: waxy skin, uncanny face, morphing, oversaturated, glossy skin.
```

**Beat 6: TAG (5s)**
```
Locked-off hero shot. The Benediktiner bottle and filled glass centered 
on the table. Golden hour light slowly dimming behind the city skyline. 
Camera holds perfectly still. Clean composition with text space at 
bottom third for tagline overlay.

Audio: Quiet ambient fade. Single soft piano note.

Avoid: camera movement, morphing, jittery, color shift, text.
```

#### Post-Production Checklist
```
1. Import 6 clips vao DaVinci Resolve / Premiere Pro
2. Color grade THONG NHAT (LUT chung) cho tat ca clips
3. Layer VO / music / SFX rieng (khong dung chi audio AI)
4. Them brand logo + tagline vao Beat 6
5. Export: 9:16 (TikTok/Reels) + 16:9 (YouTube) + 4:5 (FB Feed)
```

### 2.10 Seasonal Video Prompts

#### Tet — Lunar New Year (Warm, Festive)
```
Slow dolly-in. A beautifully arranged Tet table: Benediktiner bottles 
on a lacquered red-gold tray, filled Weizen glasses, traditional mai 
blossoms, kumquat branch with tiny orange fruits, red silk lucky money 
envelopes. Warm golden candlelight reflecting off the dark bottles and 
amber beer. Family hands reaching for glasses in the background.

Audio: Festive distant fireworks pop. Glass clink. Warm family laughter.

Avoid: morphing, floating objects, jittery, text overlay, watermark.
```

#### Summer — Beach Refresh (Bright, Energetic)
```
Tracking shot following a hand pulling a frosty Bitburger can from a 
metal ice bucket on a sandy beach surface. The can drips with ice water. 
Bright midday sunlight creating vivid specular highlights on the wet 
metallic surface. Turquoise ocean waves soft-focused behind. The tab 
pops open with a fine mist spray.

Audio: Ice clinking. Tab pop with crisp fizz. Distant ocean waves.

Avoid: overexposed, morphing, ghosting, text, watermark, blurry.
```

#### Mid-Autumn — Lantern Night (Intimate, Cultural)
```
Medium shot, slow crane descent. Paper lanterns with warm orange glow 
hanging above a garden table. Benediktiner Dunkel bottle beside 
traditional mooncakes on a dark wooden surface. A hand slowly pours 
the rich chestnut-brown beer into a glass. Lantern light reflects 
warmly in the dark beer surface.

Audio: Crickets chirping. Quiet pour. Distant traditional music.

Avoid: harsh lighting, morphing, jittery, text overlay, floating.
```

### 2.11 Tool Comparison — Video Generation

| Tool | Diem manh | Diem yeu | Dung khi nao |
|------|----------|----------|--------------|
| **VEO 3.1** | Camera stability, 4K, audio native, brand consistency | Can credit, doi lau | Hero shots, product showcase, B-roll |
| **VEO 3.1 Fast** | Nhanh, re hon | Chat luong thap hon | Prototyping, test concept truoc |
| **Sora** | Photorealism cao, narrative phuc tap, physics | Dat, queue dai | TVC, high-end brand video |
| **Kling** | Nhan vat realistic, sync audio-visual | It control camera | Character-driven, lifestyle |
| **Runway Gen-3** | Reference frame tot, fine-tune motion | Ngan (4s default) | Fix specific shots, inpainting |

#### Workflow Khuyen Nghi

```
 PROTOTYPE          PRODUCTION          POST
    |                    |                 |
 VEO Fast ---------> VEO 3.1 --------> DaVinci
 (test concept)   (final render)    (color + audio + text)
    |                    |
 Kling backup      Sora backup
 (nhan vat)        (landscape)
```

---

## PHAN 3: PLATFORM SPECS

| Platform | Image Ratio | Video Ratio | Duration | Hook Time |
|----------|-------------|-------------|----------|-----------|
| **TikTok** | 9:16 | 9:16 | 15-30s | 1.5s |
| **Reels** | 9:16 | 9:16 | 15-30s | 1.5s |
| **FB Feed** | 4:5 | 4:5 or 1:1 | 15-60s | 3s |
| **FB Story** | 9:16 | 9:16 | 15s | 1s |
| **IG Feed** | 1:1 or 4:5 | 4:5 | 30-60s | 3s |
| **YouTube Shorts** | 9:16 | 9:16 | 30-60s | 2s |
| **YouTube Long** | 16:9 | 16:9 | 30s-3min | 5s |

---

## PHAN 4: QUALITY CHECKLIST

### Video VEO 3 - Moi prompt PHAI pass:

- [ ] **100-150 words** -- Sweet spot: 120-140. KHONG qua 200
- [ ] **1 action + 1 camera move** -- Khong nhoi nhieu hanh dong
- [ ] **Camera = cau rieng** -- "The camera performs a slow dolly-in." TACH rieng
- [ ] **Micro-action >= 1** -- Chi tiet vat ly nho (slight hesitation, eyes close)
- [ ] **Audio co SFX cu the** -- Khong chi "ASMR" ma mo ta am thanh cu the
- [ ] **Look preset cu the** -- Khong dung "cinematic feel" ma dung "35mm grain, shallow DOF"
- [ ] **Avoid >= 5 noun phrases** -- Bat buoc: morphing, waxy skin, ghosting, text overlay, jittery
- [ ] **Thi hien tai** -- "The camera pans", "A man walks" (KHONG "would pan")
- [ ] **Hook 1.5s** -- Scene dau gay to mo hoac man nhan ngay
- [ ] **I2V neu co** -- Da tao hero frame bang Nano Banana truoc?
- [ ] **Aspect ratio** -- 9:16 (TikTok) hay 16:9 (YouTube) hay 4:5 (FB)?

### Anh Nano Banana - Moi prompt PHAI pass:

- [ ] **Front-load Subject** -- 20 tu dau = mo ta san pham chinh xac
- [ ] **Camera + Lens** -- "Shot on Hasselblad X2D, 90mm, f/4"
- [ ] **Light BEHAVIOR** -- Mo ta anh sang LAM GI (khong chi ten)
- [ ] **Texture cue >= 2** -- skin, foam, wood, glass, condensation, fabric
- [ ] **Positive language** -- "sharp crisp focus" THAY "no blur"
- [ ] **Aspect ratio** -- Da chi dinh
- [ ] **Reference image** -- Da upload anh mau neu co?

### Storyboard 30s Commercial - PHAI co:

- [ ] **5-6 beats** -- Moi beat 1 prompt rieng, 3-7s
- [ ] **Anchor tokens** -- Copy-paste san pham descriptor vao moi prompt
- [ ] **Consistent style** -- Cung look preset cho tat ca beats
- [ ] **Hook beat 1** -- 3s dau = scroll-stopping visual
- [ ] **Tag beat cuoi** -- Text space cho logo/tagline
- [ ] **Post-production plan** -- Color grade, audio layer, text overlay

