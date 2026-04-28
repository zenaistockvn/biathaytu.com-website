---
name: video-prompts
description: >
  Production-ready video prompt library for AI-generated beer marketing videos.
  Covers Seedance 2.0 (ByteDance) & Google Veo 3 across 10 video styles.
  Director's Framework with timestamp prompting, multimodal referencing, and audio design.
  Optimized for Bia Thầy Tu brand — chuẩn 2026.
---

# 🎬 Beer Product Video Prompt Library v1.0

> Cập nhật 10/04/2026 — Director's Framework cho Seedance 2.0 & Veo 3.

---

## TỔNG QUAN 2 CÔNG CỤ

---

## BỘ ẢNH GỐC (REFERENCE IMAGES)
*Lưu ý: Bạn hãy sử dụng luôn các ảnh này kèm với prompt tương ứng ở các phần dưới để đưa vào Flow tạo video (Ví dụ: đặt làm First Frame cho Veo 3 hoặc Reference cho Seedance).*

| Tên Sản Phẩm | Loại | Ảnh Xem Trước (VS Code Preview) | Đường dẫn vật lý (đưa vào FlowKit) |
|--------------|------|-----------------------------------|-----------------------------------|
| **Benediktiner Weissbier (Naturtrüb)** | Chai 0.33L | ![][bene-bottle] | `public/images/benediktiner/Benediktiner Weissbier Naturtrüb - 4 x 6 x 0.33 l bottle.webp` |
| **Benediktiner Weissbier (Naturtrüb)** | Ly Bia (Glass) | ![][bene-glass] | `public/images/benediktiner/Benediktiner Weissbier Naturtrüb - 0.5 l glass.webp` |
| **Benediktiner Weissbier (Naturtrüb)** | Lon 0.5L | ![][bene-can] | `public/images/benediktiner/Benediktiner Weissbier Naturtrüb - 4 x0.5 l can.webp` |
| **Benediktiner Weissbier Dunkel** | Logo / Nhãn | ![][bene-dunkel] | `public/images/benediktiner/Benediktiner Weissbier Dunkel - product logo.webp` |

[bene-bottle]: ../../../public/images/benediktiner/Benediktiner%20Weissbier%20Naturtr%C3%BCb%20-%204%20x%206%20x%200.33%20l%20bottle.webp "Chai Benediktiner"
[bene-glass]: ../../../public/images/benediktiner/Benediktiner%20Weissbier%20Naturtr%C3%BCb%20-%200.5%20l%20glass.webp "Ly Bia Benediktiner"
[bene-can]: ../../../public/images/benediktiner/Benediktiner%20Weissbier%20Naturtr%C3%BCb%20-%204%20x0.5%20l%20can.webp "Lon Benediktiner"
[bene-dunkel]: ../../../public/images/benediktiner/Benediktiner%20Weissbier%20Dunkel%20-%20product%20logo.webp "Logo Dunkel"

---

| Tiêu chí | Seedance 2.0 (ByteDance) | Google Veo 3.1 |
|----------|--------------------------|----------------|
| **Thế mạnh** | Multimodal control & consistency | Cinematic realism & native audio |
| **Thời lượng** | Tối đa 15 giây | Tối đa 8 giây |
| **Độ phân giải** | 2K (native) | 4K |
| **Input** | Text + Image + Video + Audio (tối đa 12 file) | Text + Image references |
| **Audio** | Hỗ trợ, cần post-production | Native sync dialogue + SFX |
| **Tốt nhất cho** | Narrative, branding, multi-shot consistency | Cinematic shots, dialogue, realism |
| **Truy cập** | [dreamina.capcut.com](https://dreamina.capcut.com) (free credits/ngày) | Google AI Studio / Vids (10 free/tháng) |
| **Giá** | Free tier + paid plans | Free trial $300 GCP / Gemini Advanced |

### Khi nào dùng gì?

```
Seedance 2.0 → Khi cần:
  ✅ Character consistency qua nhiều shots
  ✅ Upload reference image/video/audio để control chính xác
  ✅ Video dài hơn (15s vs 8s)
  ✅ Batch production cho social media
  ✅ Multi-shot narrative

Veo 3.1 → Khi cần:
  ✅ Chất lượng cinematic cao nhất (4K)
  ✅ Dialogue / lời thoại có lip-sync
  ✅ Sound effects tự động chính xác
  ✅ Physics rendering (ánh sáng, bọt bia, nước, phản chiếu)
  ✅ One-pass production (hình + âm thanh cùng lúc)
```

---

## CÔNG THỨC PROMPT VIDEO (Director's Framework)

### Seedance 2.0 — Modular Shot List

```
[Reference]   →  @Image1, @Video1, @Audio1 (tag file upload)
[Timestamp]   →  Phân đoạn thời gian: 0-3s, 3-7s, 7-10s...
[Subject]     →  Sản phẩm, nhân vật, vật liệu, chi tiết
[Action]      →  Hành động CỤ THỂ (1 verb/shot): rotate, pour, reveal, glide
[Camera]      →  Dolly-in, tracking, orbital, macro push-in, crane
[Style/Light] →  Mood, studio setup, color grade
[Audio hint]  →  Mô tả âm thanh mong muốn (refine trong post)
```

### Veo 3.1 — Cinematic Director

```
[Camera/Framing] →  Wide shot, close-up, medium, low-angle + movement
[Subject/Action] →  Nhân vật + hành động cụ thể, layered actions
[Setting]        →  Bối cảnh, thời gian, địa điểm
[Style/Ambiance] →  Aesthetic, lighting behavior, color grade
[Audio]          →  Dialogue: "...", SFX: footsteps/pour/clink, Ambient: ...
[Technical]      →  Lens type, f-stop, film stock aesthetic
[Constraints]    →  (no subtitles), (no text overlays)
```

### Quy tắc vàng cho Video Prompt

| # | Quy tắc | Giải thích |
|---|---------|------------|
| 1 | **Front-load Camera + Subject** | AI chú ý nhất 20 từ đầu — đặt framing + chủ thể trước |
| 2 | **1 camera move / shot** | Tránh overload: 1 dolly HOẶC 1 pan HOẶC 1 orbit. Không 3 thứ cùng lúc |
| 3 | **Timestamp cho multi-shot** | Chia video thành segments rõ ràng, mỗi segment 1 action |
| 4 | **Mô tả vật lý material** | "Condensation on cold glass", "metallic emerald surface" > "nice bottle" |
| 5 | **Audio tách riêng** | Viết audio description bằng câu riêng, không trộn vào visual |
| 6 | **Positive language** | "Sharp focus on foam" > "no blur". "Clean background" > "no mess" |
| 7 | **Upload reference khi có** | Seedance: ảnh SP gốc + motion ref. Veo: first/last frame image |
| 8 | **Iterate 1 biến/lần** | Chỉnh camera HOẶC action HOẶC lighting. Không thay 3 thứ cùng lúc |
| 9 | **Keep dialogue ≤ 7 từ** | Veo lip-sync chính xác nhất ở 4-7 từ/câu |
| 10 | **Ghi (no subtitles)** | Tránh AI đốt text lên video |

---

## Brand DNA — Video Version

```yaml
Bitburger:
  Visual Motion: "Crisp, confident, clean transitions"
  Sound Profile: "Metallic can tab pop, crisp pour, subtle fizz"
  Camera Style: "Modern, precision, cool-toned studio"
  Pace: "Medium — confident, not rushed"
  Mood: "Urban sophistication, after-work reward"

Benediktiner:
  Visual Motion: "Warm, flowing, organic movements"
  Sound Profile: "Glass clink, thick creamy pour, ambient warmth"
  Camera Style: "Cinematic, warm lighting, shallow DOF"
  Pace: "Slow — contemplative, ritualistic"
  Mood: "Spiritual warmth, tradition, evening intimacy"

Cấm trong video:
  - Cảnh nhậu nhẹt, ồn ào, party kiểu mass market
  - Người dưới 25 tuổi
  - Text overlay kiểu "Sale", "Giá sốc", "Chốt đơn"
  - Nhạc EDM/trap/bass nặng → chọn jazz, acoustic, ambient, classical
  - Uống trực tiếp từ chai/lon (luôn rót ra ly)
```

---

## STYLE 1: HERO PRODUCT REVEAL — Video sản phẩm chủ đạo

> Mục đích: Landing page, social hero video, brand awareness
> Thời lượng: 8-15s | Aspect: 16:9 (banner), 9:16 (Reels/TikTok)

### Bitburger — Seedance 2.0

```
Follow the product in @Image1.

0–3s: Extreme close-up on a Bitburger Premium Pils 500ml aluminum can, 
sharp focus on the emerald green and gold branding. Dramatic studio spotlight 
creating metallic reflections on condensation droplets. Dark navy background. 
Slow dolly-in.

3–8s: Pull back to medium shot revealing a branded tulip glass being filled 
with crystal-clear golden pilsner beer, fine white foam rising perfectly. 
Warm rim lighting highlighting the glass edges. Smooth crane movement up.

8–12s: Wide shot, both can and glass centered on a wet black reflective 
surface showing mirror reflection. Three-point studio lighting locks in. 
Hold static for logo overlay space.

Style: Commercial, high-end, 4K, smooth transitions, premium beer advertising.
Audio hint: Metallic can surface sound, crisp pour, subtle carbonation fizz.
```

### Benediktiner Weissbier — Veo 3.1

```
Cinematic medium close-up, slow dolly-in. A Benediktiner Weissbier 500ml 
dark brown bottle with ornate gold monastery label sits on a polished dark 
granite surface. Warm golden backlit rim light highlights condensation droplets 
running down the cold glass. A hand enters frame and tilts the bottle, 
beginning a slow pour into a tall Weizen glass at a 45-degree angle.
The naturally cloudy golden-amber wheat beer cascades down, thick creamy 
white foam builds at the surface. Neutral dark charcoal gradient background. 
Shot on 85mm lens, f/2.8, shallow depth of field. Premium advertising 
aesthetic. SFX: glass bottle gently tilting, liquid pouring into glass, 
carbonation bubbles rising. Ambient: soft warm studio silence. (no subtitles)
```

### Benediktiner Dunkel — Veo 3.1 (Moody)

```
Cinematic close-up, static camera with subtle handheld drift. 
A Benediktiner Weissbier Dunkel 500ml bottle beside a tall Weizen glass 
filled with rich chestnut-brown cloudy dark wheat beer, dense tan foam head. 
Positioned on a weathered dark oak table. Single warm overhead spotlight 
creating dramatic chiaroscuro shadows. Background: soft out-of-focus 
fireplace ember glow. The camera slowly pushes in on the glass, catching 
light refracting through the dark amber liquid.
Shot on 85mm lens, f/2.8, Kodak Portra 400 aesthetic, warm grain.
SFX: distant fireplace crackle, soft ambient hum. (no subtitles)
```

---

## STYLE 2: POUR SHOT / ASMR — Video cảm giác

> Mục đích: TikTok, Reels, Stories — sensory content, high engagement
> Thời lượng: 8-15s | Aspect: 9:16 (vertical)

### The Perfect Pour — Seedance 2.0

```
Follow @Image1 for product identity.

0–4s: Extreme macro shot, camera locked on empty Weizen glass rim. 
A hand tilts a Benediktiner Weissbier bottle (shown in @Image1) at 
45 degrees. Beer begins cascading in — golden-amber cloudy liquid 
with individual carbonation bubbles visible. Dramatic backlit rim 
lighting.

4–10s: Slow push-in as foam builds. Thick creamy white foam rises 
above the glass rim. Camera follows the foam upward. Each bubble in 
the foam head catches the warm light.

10–15s: Pull back to reveal full glass with perfect foam head. 
Condensation running down the glass surface. Dark moody background 
isolating the subject. Hold for 2 seconds.

Style: ASMR sensory, macro photography quality, slow motion feel.
Audio hint: Liquid pouring sound, bubbles rising, satisfying foam 
settling sound. No music — pure ASMR.
```

### Can Opening Moment — Veo 3.1

```
Extreme close-up macro shot, static camera. A hand grips a cold 
Bitburger Premium Pils aluminum can with visible condensation droplets 
on the emerald green metallic surface. The thumb pulls the tab — 
a fine mist spray releases upward with carbonation hissing. 
Camera captures the exact moment of the pop with spray particles 
frozen mid-air. Dramatic dark background, sharp rim lighting catching 
every water droplet and gas release. Shot on 100mm macro lens, f/4.
SFX: crisp metallic pop of can tab, satisfying hiss of carbonation 
release, tiny water droplets settling. Ambient: studio silence.
(no subtitles)
```

---

## STYLE 3: LIFESTYLE / OCCASION — Video đời sống

> Mục đích: Social awareness, aspirational content, brand lifestyle
> Thời lượng: 10-15s | Aspect: 9:16 (Reels), 1:1 (Feed)

### After-Work Rooftop — Seedance 2.0

```
Follow @Image1 for Bitburger can identity.

0–5s: Cinematic wide shot, slow pan right. A modern Saigon rooftop bar 
at golden hour. City skyline with warm lights creating soft bokeh in 
background. A Vietnamese man (early 30s, smart casual, confident posture) 
sits at a bar counter.

5–10s: Medium close-up, soft dolly-in. He picks up a Bitburger tulip glass 
filled with golden pilsner, takes a slow sip. Natural smile of satisfaction. 
Evening blue hour lighting mixed with warm tungsten bar lighting reflects 
off the metallic can nearby.

10–15s: Wide shot reveals the full scene — city lights, the man relaxed, 
beer on counter. Hold for logo space. Warm color grading throughout.

Style: Editorial lifestyle, urban sophistication, premium commercial.
Audio hint: Soft ambient city sounds, distant jazz piano, glass on counter.
```

### Bữa Tối Tại Gia — Veo 3.1

```
Cinematic medium shot, slow tracking right. A warm Vietnamese dining room 
at evening. A couple in their early 30s, well-dressed casually, sitting 
at a dark wooden table set with food — phở and fresh herbs, candles lit. 
A Benediktiner Weissbier bottle and filled Weizen glass on the table. 
The man pours beer slowly into the glass at 45 degrees. The woman smiles 
warmly, picks up her glass. They clink glasses gently. 
Natural warm golden table lamp lighting, shallow depth of field.
Shot on 50mm lens, f/1.8, warm color grading.
SFX: gentle glass clink, beer pouring, soft ambient room sound.
Ambient: quiet evening atmosphere, very faint distant neighborhood sounds.
(no subtitles)
```

### Khoảnh Khắc Bạn Bè — Seedance 2.0

```
0–5s: Wide cinematic shot, slow dolly forward. Modern Hanoi rooftop terrace 
at golden hour. Four Vietnamese professionals (late 20s-30s, smart casual) 
gathered around a table with Bitburger cans and Benediktiner bottles.

5–10s: Medium shot, tracking around the group. Everyone laughing naturally. 
One person raises their glass. Others follow — glasses clink together in 
the center of frame. Warm golden hour light wrapping around the group.

10–15s: Close-up on the clinking glasses — golden beer catches the sunset 
light. Pull back to wide with city bokeh behind. Hold for text overlay space.

Style: Editorial lifestyle, authentic joy, warm tones, premium commercial.
Audio hint: Natural laughter, glass clinking, soft ambient city + music.
```

---

## STYLE 4: FOOD PAIRING — Video bia × ẩm thực

> Mục đích: Education, carousel video, engagement content
> Thời lượng: 10-15s | Aspect: 9:16 (Reels), 1:1 (Feed)

### Weissbier × Phở — Veo 3.1

```
Overhead cinematic shot, slow push down. A dark moody wooden table surface. 
A steaming bowl of Vietnamese phở with fresh herbs, lime wedges, and 
bean sprouts placed beside a Benediktiner Weissbier bottle and filled 
Weizen glass with cloudy amber beer and thick foam. Steam wisps rise 
from the phở, catching soft directional window light from the left. 
The camera slowly transitions from overhead to a 45-degree angle, 
revealing the depth of both the soup and the beer glass side by side. 
Warm earth tones, intimate atmosphere.
Shot on 70mm lens, f/2.8, food magazine editorial quality.
SFX: gentle simmering broth sounds, steam rising, soft table ambiance.
(no subtitles)
```

### Dunkel × BBQ — Seedance 2.0

```
Follow @Image1 for Benediktiner Dunkel bottle.

0–5s: Close-up on smoky Vietnamese grilled pork ribs on a cast iron board. 
Steam and smoke rising. Camera slowly pulls back revealing the table setup. 
Warm firelight glow from the left.

5–10s: Tracking shot right, revealing a Benediktiner Dunkel bottle and 
glass of rich chestnut-brown wheat beer beside the BBQ. The beer's dark 
amber color harmonizes with the charred meat tones. Condensation catches 
the warm light.

10–15s: Medium shot of a hand picking up the beer glass, bringing it close. 
Dark moody food photography atmosphere, masculine energy. Colors: chestnut, 
dark amber, burnt orange. Hold for text space.

Style: Cinematic food commercial, dark moody editorial, premium.
Audio hint: Sizzling grill sounds, ambient fire crackle, glass pickup sound.
```

---

## STYLE 5: STORYTELLING / HERITAGE — Video thương hiệu

> Mục đích: Brand video, About page, series "Hành trình bia Đức"
> Thời lượng: 15s (single shot) → ghép thành video dài 30-60s
> Aspect: 16:9 (cinematic), 9:16 (Reels edit)

### Origin — Tu Viện Ettal — Veo 3.1

```
Wide cinematic shot, slow drone push forward. A medieval Bavarian 
monastery interior (Kloster Ettal style) at dawn. Golden morning light 
streaming through ancient arched stone windows into a brewery cellar. 
Dust particles floating in the light beams. A single Benediktiner bottle 
positioned on an old oak barrel in the foreground catches the golden light. 
Mist rising from an Alpine valley visible through a distant window. 
Deep focus throughout. Spiritual, timeless, sacred craft atmosphere.
Shot on 24mm wide-angle lens, f/8, warm golden tones.
Ambient: quiet monastery echoes, distant church bells, soft wind through 
stone corridors. (no subtitles)
```

### The Brewmaster — Seedance 2.0

```
0–5s: Extreme close-up, soft dolly-in. Weathered German brewmaster's hands 
carefully examining golden barley grains. Individual grains visible in 
sharp detail. Warm golden directional side lighting.

5–10s: Medium shot, the brewmaster lifts a copper ladle from a brewing 
kettle, steam gently rising. Amber light reflects off the copper surface, 
creating rich warm tones in the steam. Slow circular camera movement.

10–15s: Wide shot of the traditional brewery interior. Copper kettles, 
oak barrels. The brewmaster walks through, silhouette against golden 
backlight. Text space at bottom.

Style: Documentary cinematography, craftsmanship, human touch. 
Kodak film grain, warm color grade.
Audio hint: Grain rustling, liquid bubbling, footsteps on stone floor.
```

### Reinheitsgebot — 4 Nguyên Liệu — Veo 3.1

```
Cinematic close-up macro sequence, controlled slow dolly across four 
raw brewing ingredients arranged on an aged wooden surface — golden barley 
grains in a mound, green hop flowers on a stem, a glass pitcher of 
crystal-clear spring water with light refracting through it, and fresh 
yeast culture in a small ceramic bowl. Camera glides left to right across 
the ingredients slowly. Dramatic Renaissance painting lighting, strong 
directional warm light from upper left creating deep chiaroscuro shadows. 
A vintage German parchment scroll partially visible underneath.
Shot on 100mm macro lens, f/4. Reverent, pure, timeless tradition.
SFX: soft grains shifting, water gently rippling, absolute quiet reverence.
(no subtitles)
```

---

## STYLE 6: SEASONAL / CAMPAIGN — Video theo mùa

> Mục đích: Holiday campaigns, limited-time content, event video
> Thời lượng: 10-15s | Aspect: 9:16 + 16:9 + 1:1

### Tết / Lunar New Year — Seedance 2.0

```
Follow @Image1 for product arrangement reference.

0–5s: Wide shot, slow crane down. A beautifully set Vietnamese Tết table 
with red and gold lacquered tray holding Benediktiner Weissbier and Dunkel 
bottles with filled glasses. Fresh kumquat branch with orange fruits, red 
silk ribbons, gold lucky money envelopes, mai blossoms surrounding.

5–10s: Close-up tracking across the table surface. Camera glides past 
the gold lupcky envelopes, the mai blossoms, arriving at the beer glasses. 
The amber beer catches the warm fairy light bokeh from background.

10–15s: Medium shot. A hand picks up a glass, another hand meets it for 
a gentle toast clink. Warm golden ambient lighting throughout. Rich color 
palette: deep red, gold, warm amber. Hold for "Chúc Mừng Năm Mới" text.

Style: Festive, luxurious, Vietnamese Lunar New Year atmosphere.
Audio hint: Soft Vietnamese traditional music undertone, glass clink, 
joyful but gentle ambient celebration sounds.
```

### Mid-Autumn Festival — Veo 3.1

```
Cinematic medium shot, slow pan left. A dark wooden table under soft 
moonlight. Benediktiner bottles alongside traditional Vietnamese mooncakes 
and a filled Weizen glass with amber-gold beer. Paper lanterns with warm 
orange glow visible in soft bokeh background. The beer glass reflects 
the lantern light, creating warm amber highlights.
Camera slowly pushes in on the glass and mooncake arrangement.
Warm, intimate, cultural celebration atmosphere.
Shot on 85mm lens, f/2.8. Colors: deep amber, warm gold, soft orange.
SFX: gentle night crickets, distant lantern festival sounds, soft 
ambient warmth. (no subtitles)
```

---

## STYLE 7: UGC / SEEDING — Video tự nhiên

> Mục đích: KOL seeding, review video, community engagement
> Thời lượng: 8-15s | Aspect: 9:16 (TikTok/Reels)
> Style: Phone-camera authentic, slight shake, natural color

### Unboxing — Seedance 2.0

```
0–4s: POV first-person handheld shot. Hands opening a kraft paper delivery 
box on a kitchen counter. Natural daylight from window. The box reveals 
12 Benediktiner Weissbier bottles nestled in straw packing material. 
Slight camera shake — authentic smartphone feel.

4–10s: Hand picks up one bottle, holds it up to camera. Natural light 
catches the gold monastery label. Thumb brushes over the label approvingly. 
Slight tilt and turn to show details.

10–15s: Bottle placed back, camera tilts showing the full collection in 
the box. Natural satisfied reaction. Mobile photography aesthetic — warm 
natural filter, casual framing.

Style: Authentic UGC, iPhone 16 Pro quality, no heavy editing.
Audio hint: Box opening cardboard sound, bottles clinking gently in straw, 
natural room ambiance. No music.
```

### First Taste Review — Veo 3.1

```
Medium close-up, slightly off-center framing, subtle smartphone handheld 
drift. A Vietnamese man in his early 30s at a well-lit modern kitchen 
counter. He picks up a glass of Benediktiner Weissbier, examines the 
cloudy amber color against the window light. Takes a slow sip. 
A genuine expression of pleasant surprise — eyebrows raise slightly, 
small nod of approval. He says, "Ngon thật đấy." softly with a slight 
smile. Natural kitchen lighting, no professional setup.
Shot on smartphone front camera perspective, warm natural tones.
SFX: glass pickup sound, quiet sip, natural kitchen ambiance.
(no subtitles)
```

---

## STYLE 8: EDUCATIONAL / HOW-TO — Video kiến thức

> Mục đích: Tasting guide, cách rót, nhiệt độ, Reels education
> Thời lượng: 15s (segments for longer videos)
> Aspect: 9:16 (Reels/TikTok), 16:9 (YouTube)

### Cách Rót Bia Lúa Mì Đúng Chuẩn — Seedance 2.0

```
Follow @Image1 for Benediktiner bottle.

0–5s: Close-up on hands holding a tall Weizen glass at 45-degree angle. 
Other hand slowly pours Benediktiner Weissbier along the glass wall. 
Golden-amber cloudy beer flows smoothly down the inside surface. 
Clean studio background, even lighting.

5–10s: Glass gradually tilts upright as it fills to 2/3. Camera follows 
the tilt motion. Foam begins building naturally — thick, creamy, white. 
The pour pauses.

10–15s: Hand swirls the remaining beer in the bottle (to capture yeast 
sediment), then pours the last portion straight into center of glass. 
Foam rises dramatically above the rim. Camera holds on the perfect 
pour result. Premium educational content.

Style: Clean tutorial, professional lighting, easy to follow.
Audio hint: Pouring liquid sound, glass handling, gentle fizzing.
```

---

## STYLE 9: CINEMATIC AD — Video quảng cáo chuyên nghiệp

> Mục đích: Facebook Ads, YouTube Pre-roll, paid campaigns
> Thời lượng: 8-15s | Aspect: 16:9 (YouTube), 9:16 (FB/IG), 1:1

### Hero Ad — Bitburger Splash — Veo 3.1

```
Dramatic low-angle cinematic shot, slow dolly-in. A Bitburger Premium Pils 
can positioned at a dynamic slight angle with a controlled beer splash arc 
flowing behind it, individual golden droplets frozen mid-air. Deep navy 
blue gradient background with subtle gold particle effects and professional 
light streaks. The can's emerald green and gold branding razor-sharp. 
Camera slowly pushes into the can, splash settling into a calm pool 
reflection below. Ultra-clean CGI-quality commercial rendering.
Shot on Hasselblad X2D aesthetic, 90mm lens, f/8.
SFX: dramatic whoosh, liquid splash settling, subtle bass impact.
Ambient: epic silence with gentle reverb. (no subtitles)
```

### Hero Ad — Benediktiner Heavenly Light — Seedance 2.0

```
Follow @Image1 for Benediktiner bottle identity.

0–5s: Black screen fades in. Volumetric golden light rays slowly break 
through dark clouds above, creating a heavenly cathedral-of-light effect. 
Camera tilts down following the light.

5–10s: Light reveals a Benediktiner Weissbier bottle positioned on a dark 
surface. The golden rays illuminate the bottle, creating a halo effect. 
A tall Weizen glass below fills with cloudy amber beer, foam overflowing 
and catching the divine light. Slow dolly-in.

10–15s: Full reveal — bottle and glass in ethereal golden light. 
Background: dark-to-gold gradient. Text space for "Dem Himmel so nah" 
tagline. Camera holds static, light pulses gently.

Style: Cinematic advertising, heavenly, ethereal.
Audio hint: Angelic ambient pad, soft choir hum, liquid light sounds.
```

---

## STYLE 10: COMPARISON / TASTING — Video so sánh

> Mục đích: Product education, "3 dòng bia Benediktiner" series
> Thời lượng: 15s | Aspect: 9:16 (Reels), 16:9 (YouTube)

### Three Brothers — Seedance 2.0

```
Follow @Image1 (3 bottles lineup reference).

0–5s: Wide shot, slow tracking left to right. Three Benediktiner bottles 
(Weissbier, Dunkel, Hell) standing on a polished black reflective surface. 
Each with its distinct beer in a glass positioned in front. Background 
gradient transitions from amber gold (left) through deep chestnut (center) 
to bright cream gold (right).

5–10s: Close-up dolly across each glass — first Weissbier (cloudy amber, 
thick white foam), then Dunkel (chestnut-brown, tan foam), then Hell 
(crystal-clear golden, fine white foam). Camera pauses briefly on each.

10–15s: Pull back to wide shot of all three. Even studio rim highlights 
on each bottle. Matching color reflect beneath each glass on the polished 
surface. Hold for comparison text overlay space.

Style: Premium retail advertising, clean, educational.
Audio hint: Soft transitional whoosh between each beer, ambient premium tone.
```

---

## WORKFLOW: Video Production Pipeline

### Pipeline 1: Single Platform (Nhanh)

```yaml
Bước 1 — Chuẩn bị assets:
  - Pack shot ảnh sản phẩm (high-res, nền trắng/xám)
  - Reference video cho camera movement (nếu có)
  - Script/storyboard cho nội dung

Bước 2 — Generate AI video:
  Tool: Seedance 2.0 (dreamina.capcut.com) HOẶC Veo 3.1 (AI Studio)
  Input: Product image + text prompt từ library này
  Output: Raw AI clip 8-15s
  Tip: Generate 3-5 variations, chọn best 1

Bước 3 — Post-production:
  Tool: CapCut / Premiere Pro / DaVinci Resolve
  Tasks:
    - Trim & timing adjustment
    - SFX & music overlay (nếu dùng Seedance)
    - Color grading fine-tune
    - Text/logo overlay
    - Export đa ratio: 9:16, 16:9, 1:1

Bước 4 — Quality check:
  - Brand consistency (logo, color, product accuracy)
  - Audio mix (không quá to/nhỏ)
  - Platform specs (xem bảng bên dưới)
  - Không có AI artifact (tay có 6 ngón, chữ lộn xộn, nắp bần)
```

### Pipeline 2: Multi-Shot Narrative (Video dài 30-60s)

```yaml
Bước 1 — Storyboard:
  Chia video thành 4-6 shots, mỗi shot là 1 prompt riêng.
  Ví dụ video 45s về Benediktiner:
    Shot 1: Tu viện Ettal dawn (Heritage, 8s)
    Shot 2: Brewmaster hands examining barley (Craft, 8s)
    Shot 3: Beer being poured into glass (Pour, 10s)
    Shot 4: Couple enjoying at dinner table (Lifestyle, 10s)
    Shot 5: Close-up glass, product + tagline (CTA, 9s)

Bước 2 — Consistency protocol:
  Seedance: Upload CÙNG reference image cho TẤT CẢ shots
  Veo: Lặp lại CHÍNH XÁC physical description của character/product

Bước 3 — Generate từng shot:
  - Dùng prompt từ library, modify cho narrative flow
  - Mỗi shot generate 3 variations → chọn best

Bước 4 — Assembly:
  Tool: CapCut Pro / Premiere Pro
  - Ghép shots theo storyboard
  - Transition: simple cut hoặc matched dissolve (KHÔNG star wipe, slide fancy)
  - Music track: 1 bản nhạc consistent xuyên suốt
  - Color grade đều tất cả shots

Bước 5 — Sound design:
  - Layer 1: Ambient background (xuyên suốt)
  - Layer 2: SFX per shot (pour, clink, sizzle...)
  - Layer 3: Music (jazz/acoustic/classical, phù hợp brand)
  - Layer 4: Voiceover (nếu có) — thu riêng, add sau
```

### Pipeline 3: Batch Social Content (Volume)

```yaml
Mục tiêu: 12-20 video clips / tuần cho TikTok + Reels + Stories

Bước 1 — Chọn chủ đề tuần:
  Tuần 1: Hero product (4 clips × 4 sản phẩm)
  Tuần 2: Pour shots / ASMR (4 clips)
  Tuần 3: Lifestyle / occasion (4 clips)
  Tuần 4: Food pairing (4 clips)

Bước 2 — Batch generate trên Seedance (15s clips):
  Upload 1 product reference image → generate 5 variations mỗi prompt
  Chọn 1-2 best → tổng 12-20 clips

Bước 3 — Post-production batch:
  CapCut batch edit: cùng color grade, cùng font, cùng logo placement
  Export: 9:16 (TikTok/Reels) + 1:1 (Feed) + 16:9 (YouTube Shorts cover)

Bước 4 — Schedule:
  Upload vào AMC content library → auto-publish pipeline
```

---

## Platform Specs — Video Export

| Platform | Ratio | Duration | Max Size | Resolution |
|----------|-------|----------|----------|------------|
| TikTok | 9:16 | 15-60s | 287MB | 1080×1920 |
| Instagram Reels | 9:16 | 15-90s | 650MB | 1080×1920 |
| Instagram Stories | 9:16 | ≤15s | 30MB | 1080×1920 |
| Facebook Feed | 1:1 or 4:5 | 3-240s | 4GB | 1080×1080 |
| Facebook Reels | 9:16 | 15-90s | 4GB | 1080×1920 |
| YouTube Shorts | 9:16 | ≤60s | 256GB | 1080×1920 |
| YouTube (long) | 16:9 | Any | 256GB | 1920×1080+ |

---

## Anti-Patterns — Lỗi AI Video Hay Gặp

| # | Lỗi | Cách phòng tránh |
|---|------|------------------|
| 1 | **Tay 6 ngón / biến dạng** | Giữ tay ở rìa frame hoặc soft focus. Kiểm tra kỹ trước publish |
| 2 | **Nắp bần (cork) thay nắp bia** | Prompt rõ: "standard metal crown cap, beer bottle cap" |
| 3 | **Chữ lộn xộn trên nhãn** | Dùng "(no text overlays)" + composite nhãn thật trong post |
| 4 | **Physics sai (bia rơi ngược, bọt biến mất)** | Mô tả physics cụ thể: "foam rises and settles naturally, liquid pours downward with gravity" |
| 5 | **Lip-sync lệch** | Giữ dialogue ≤ 7 từ, dùng medium close-up cho face |
| 6 | **Ánh sáng nhảy (flicker)** | Specify consistent lighting source: "single warm overhead spotlight, no flickering" |
| 7 | **Character morphing giữa shots** | Lặp lại EXACT physical description hoặc dùng reference image @Image1 |
| 8 | **Motion blur quá mức** | Thêm "sharp detail, high shutter speed" khi cần freeze moment |
| 9 | **Audio không sync** | Tách audio description thành câu riêng, viết sau visual |
| 10 | **Watermark AI** | Crop hoặc re-render. Paid tier thường không có watermark |

---

## Âm Thanh & Nhạc Phù Hợp Brand

### Nhạc nền khuyến nghị (tìm trên Epidemic Sound, Artlist)

| Mood | Genre | Dùng cho |
|------|-------|----------|
| Premium evening | Smooth jazz, bossa nova | Lifestyle, dinner, after-work |
| Heritage/craft | Acoustic guitar, piano solo | Brand story, heritage, how-to |
| Celebration | Orchestral light, acoustic ensemble | Tết, events, toast moments |
| ASMR/Sensory | None — pure SFX | Pour shots, macro, can opening |
| Modern urban | Lo-fi beats, chill electronic | Rooftop, GenZ content, city life |
| Epic reveal | Cinematic strings, percussion | Hero ads, product reveal |

### SFX Library (mô tả trong prompt)

```yaml
Pour sounds:
  - "Liquid pouring smoothly into glass along the wall"
  - "Cascading beer with rising carbonation bubbles"
  - "Thick foam building and settling"

Can/Bottle:
  - "Metallic can tab pop with carbonation hiss release"
  - "Glass bottle placed on wooden surface"
  - "Metal crown cap popping off with slight fizz"

Glass interaction:
  - "Two glasses clinking gently at a toast"
  - "Glass being picked up from wet counter surface"
  - "Finger tracing condensation on cold glass"

Ambient:
  - "Warm fireplace crackle in background"
  - "Distant city sounds from rooftop"
  - "Quiet monastery echoes, stone corridors"
  - "Evening garden atmosphere, soft insects"
```

---

## Quick Access Guide — Truy cập nhanh

### Seedance 2.0 (Dreamina)
```
1. Vào dreamina.capcut.com
2. Đăng nhập (Google/TikTok/Email)
3. Chọn "Video Generation"
4. Upload reference images (product pack shots)
5. Paste prompt từ library này
6. Generate → chọn best → download
7. Free credits refresh hàng ngày
```

### Google Veo 3.1
```
1. Vào aistudio.google.com
2. Đăng nhập Google account
3. Tạo API key hoặc dùng playground
4. Chọn Veo 3.1 model
5. Paste prompt (nhớ include audio + "(no subtitles)")
6. Generate → review → download
7. Free: 10/tháng (Vids) hoặc $300 GCP trial
```

---

## Template Nhanh — Copy-Paste

### Template A: Product Reveal (8-15s)

```
[Camera]: [framing], [movement]. 
[Product]: [tên SP + mô tả chi tiết từ Brand DNA].
[Action]: [1 hành động chính].
[Setting]: [bề mặt + background].
[Lighting]: [mô tả behavior ánh sáng].
[Technical]: Shot on [lens], [f-stop], [aesthetic].
[Audio/SFX]: [âm thanh cụ thể].
(no subtitles)
```

### Template B: Lifestyle Scene (10-15s)

```
[Camera]: [framing], [movement].
[Characters]: [ai, tuổi, trang phục, tư thế].
[Setting]: [địa điểm VN, thời gian, bối cảnh].
[Product]: [SP xuất hiện TỰ NHIÊN trên bàn/trong tay].
[Action]: [hành động social: toast, sip, pour, talk].
[Mood]: [premium, warm, intimate, urban...].
[Audio]: [SFX + ambient + music hint].
(no subtitles)
```

### Template C: ASMR/Pour (8-15s — Seedance timestamp)

```
Follow @Image1 for product identity.

0–[X]s: [Macro shot setup. Product + glass position. Lighting.]
[X]–[Y]s: [Pour action với physics detail. Camera follows liquid/foam.]
[Y]–[Z]s: [Final reveal. Pull back or hold. Perfect result.]

Style: ASMR sensory, macro photography, slow motion.
Audio hint: [Pure SFX, no music. Pour + fizz + settle sounds.]
```

### Template D: Multi-Shot Storyboard (30-60s)

```
Shot 1 ([duration]): [Scene setup — wide establishing shot]
Shot 2 ([duration]): [Detail — close-up product/action]
Shot 3 ([duration]): [Human element — character interaction]
Shot 4 ([duration]): [Product moment — pour/toast/sip]
Shot 5 ([duration]): [Closing — wide + text overlay space]

Consistency: Use @Image1 for ALL shots (Seedance) OR 
repeat exact character description (Veo).
Transitions: Simple cuts or matched dissolves only.
Music: Single track throughout.
```

---

## Checklist Video Trước Khi Publish

- [ ] **Brand accuracy**: Đúng sản phẩm, đúng label, đúng ly
- [ ] **No AI artifacts**: Không tay 6 ngón, không chữ lộn, không nắp bần
- [ ] **Audio quality**: SFX sync, nhạc appropriate, không quá to
- [ ] **Tone premium**: Không nhậu nhẹt, không mass market, không ồn ào
- [ ] **Platform fit**: Đúng ratio, đúng duration, đúng file size
- [ ] **Age compliance**: Mọi người trong video > 25 tuổi rõ ràng
- [ ] **CTA appropriate**: Không ép mua, CTA mềm hoặc không CTA
- [ ] **Color consistency**: Cùng color grade nếu cùng series
- [ ] **Legal**: Không claim sức khỏe, không khuyến khích uống quá mức
- [ ] **Version logged**: Lưu prompt + settings cho reproduce

---

*Phiên bản: 1.0*
*Cập nhật: 10/04/2026*
*Tương thích: Seedance 2.0 (ByteDance) · Google Veo 3.1*
*Brand: Bia Thầy Tu — Bitburger · Benediktiner*
