---
name: beer-image-prompts
description: >
  Production-ready prompt library for AI-generated German beer marketing images.
  Covers Bitburger & Benediktiner across 8 styles with Spec-Sheet framework.
  Optimized for Nano Banana (Gemini 3.1) / Flux / Midjourney v6 — chuẩn 2026.
---

# 🍺 Beer Product Image Prompt Library v2.0

> Cập nhật 31/03/2026 — Áp dụng Spec-Sheet Framework 6 phần chuẩn quốc tế.

---

## CÔNG THỨC PROMPT (Bắt buộc tuân thủ)

```
[Subject]  →  Tên SP, vật liệu, finish, ly, bia
[Camera]   →  Lens, f-stop, góc, DOF
[Setting]  →  Bề mặt, props, bối cảnh
[Lighting] →  Mô tả BEHAVIOR (ánh sáng LÀM GÌ, không chỉ tên)
[Style]    →  Aesthetic, chất lượng, mood
[Exclude]  →  Tránh gì (dùng ngôn ngữ tích cực: "clean" thay "no mess", ĐẶC BIỆT chú ý loại trừ nắp bấc/nắp champagne "no cork, standard metal crown cap only")
```

### Quy tắc vàng

| # | Quy tắc | Tại sao |
|---|---------|---------|
| 1 | **Front-load Subject** | AI chú ý nhất 20 từ đầu |
| 2 | **Gọi tên camera** | "Shot on Hasselblad X2D" → chất lượng tốt hơn |
| 3 | **Mô tả light behavior** | "warm rim light highlighting glass edges" > "warm lighting" |
| 4 | **Positive language** | "sharp crisp focus" > "no blur". "clean composition" > "no mess" |
| 5 | **Iterate 1 biến/lần** | Chỉnh lighting HOẶC angle HOẶC setting. Không thay 3 thứ cùng lúc |
| 6 | **Upload reference khi có** | Nano Banana hỗ trợ 8-14 ảnh ref → brand consistency cao nhất |

---

## Brand DNA — Luôn tuân thủ

```yaml
Bitburger:
  Heritage: "Founded 1817, Eifel region, Germany"
  Tagline: "Bitte ein Bit"
  Product: "500ml aluminum can, emerald green + gold branding"
  Glass: "Branded tulip glass"
  Beer: "Crystal-clear golden pilsner, fine white foam head"
  Mood: "Crisp, confident, Germany's #1 draft beer"
  Visual Code: "Clean lines, cool tones, modern premium"
  Camera Palette: "Emerald green, gold, navy blue, metallic silver"

Benediktiner:
  Heritage: "Kloster Ettal monastery, 400-year brewing tradition"
  Tagline: "Dem Himmel so nah — Gần hơn với thiên đường"
  Products:
    Weissbier: "500ml dark brown bottle with classic metal crown cap, gold monastery label"
    Dunkel: "500ml dark brown bottle with classic metal crown cap, dark red-brown label"
    Hell: "500ml dark brown bottle with classic metal crown cap, gold-cream label"
  Glass: "Tall Weizen glass (Weissbier/Dunkel), Classic beer glass (Hell)"
  Beer:
    Weissbier: "Naturally cloudy golden-amber wheat beer, thick cream foam"
    Dunkel: "Rich chestnut-brown cloudy dark wheat beer, dense tan foam"
    Hell: "Crystal-clear golden Bavarian lager, fine white foam"
  Mood: "Spiritual warmth, tradition, craftsmanship, natural"
  Visual Code: "Rustic wood, warm lighting, monastery arches, wheat fields"
  Camera Palette: "Amber, dark brown, warm gold, cream, monastery stone"
```

---

## ⚠️ BẮT BUỘC: Ảnh tham chiếu chính hãng (Official Reference)

> **NGUYÊN TẮC SỐ 1: KHÔNG BAO GIỜ để AI tự vẽ chai/lon/cốc bia từ mô tả text.**
> Luôn upload ảnh gốc chính hãng làm reference. AI chỉ được thay đổi BỐI CẢNH, không được thay đổi SẢN PHẨM.

### Thư mục ảnh gốc

```
public/images/products/official/
├── bitburger/                    ← 20 ảnh chính hãng Bitburger
│   ├── flasche_*                 ← Chai 330ml/500ml (longneck, frontal, betaut/dry)
│   ├── 90160_*_Dose_*            ← Lon 500ml
│   ├── 90384_*_WM26_*            ← Lon WM26 Edition
│   ├── 91364_*_0568l_*           ← Lon 568ml Export
│   ├── 60922_*_Pokal.*           ← Ly Pokal chuẩn brand
│   ├── 74560_*_Flasche_Pokal_*   ← Combo chai + ly
│   ├── 88335_*_Fass_5L_*         ← Bom 5L
│   ├── 80148_*_Tray_*            ← Thùng 24 lon
│   ├── 76979_*_Drive_*           ← Sixpack 0.0% Alkoholfrei
│   ├── 20201006_*_drive.*        ← Chai Drive 330ml
│   ├── 73871_*_Glutenfrei_*      ← Bitburger Glutenfrei
│   └── Bitburger_Bit-Lounge_*    ← Ly lounge set
├── benediktiner/                 ← 24 files chính hãng Benediktiner
│   ├── 86480_bottle_nobg.png     ← Weissbier NT chai (transparent bg)
│   ├── 86480_*_Flasche_*         ← Weissbier NT chai (studio bg)
│   ├── 89327_*_NT_*              ← Weissbier NT chai 330ml
│   ├── 85981_*_Sixpack_*         ← Weissbier NT sixpack
│   ├── 85981_*_Tray_*            ← Weissbier NT thùng
│   ├── 83810_*_Dose_*            ← Weissbier lon 4-pack
│   ├── 87205_*_Dose_frontal_*    ← Weissbier lon đơn
│   ├── glass_nobg.png            ← Ly Weizen chuẩn (transparent bg)
│   ├── glass_removebg.png        ← Ly Weizen (removed bg)
│   ├── bottle_removebg.png       ← Chai (removed bg)
│   ├── 57425_*_Dunklel_*         ← Dunkel chai (studio)
│   ├── 49717_*_WB_dunkel.*       ← Dunkel ly + chai
│   ├── 86312_*_Dunkel_Dosenkarton_* ← Dunkel lon 4-pack
│   ├── Bene_GL_vO_WB_hell.*      ← Hell ly + chai
│   ├── 86492_*_Festbier_*        ← Festbier lon
│   ├── 86312_*_Festbier_*        ← Festbier lon 4-pack
│   ├── 86087_*_AF_Flasche_*      ← Alcohol-Free chai
│   ├── 86087_*_AF_Glas_*         ← Alcohol-Free ly
│   ├── 89327_*_AF_Draufsicht_*   ← AF chai 330ml top-down
│   ├── 89327_*_AF_Frontal_*      ← AF chai 330ml frontal
│   └── 88997_*.eps               ← Logo vector (print only)
└── brand-assets/                 ← EPS/PDF cho in ấn
```

### Quy tắc sử dụng ảnh tham chiếu

| # | Quy tắc | Chi tiết |
|---|---------|----------|
| 1 | **Luôn upload ảnh gốc** | Mọi prompt tạo ảnh PHẢI kèm 1-3 ảnh reference từ thư mục `official/` |
| 2 | **Không thay đổi sản phẩm** | Prompt phải ghi rõ: "Keep the product bottle/can/glass EXACTLY as shown in the reference image" |
| 3 | **Màu sắc bất biến** | Bitburger = emerald green + gold. Benediktiner Weissbier = gold label. Dunkel = dark red-brown label. KHÔNG được thay đổi |
| 4 | **Logo cốc/ly phải chuẩn** | Nếu có ly bia trong ảnh, PHẢI dùng ly có logo brand (upload `60922_Bitb_Pils_Pokal.jpg` hoặc `glass_nobg.png` làm ref) |
| 5 | **Ưu tiên ảnh transparent bg** | Dùng `*_nobg.png` hoặc `*_removebg.png` cho composite workflow — AI giữ SP chính xác hơn |
| 6 | **Chọn đúng variant** | Weissbier content → dùng ref Weissbier. Dunkel content → dùng ref Dunkel. KHÔNG mix |

### Prompt Template bắt buộc (khi tạo ảnh mới)

```
[REFERENCE]: Upload {official_image_path}
[INSTRUCTION]: Keep the product (bottle/can/glass) EXACTLY identical to the reference 
image — same label, same colors, same proportions, same cap style. 
Only change the BACKGROUND SCENE to: {scene_description}.
[CAMERA]: {camera_specs}
[LIGHTING]: {lighting_description}
[STYLE]: {style_description}
[EXCLUDE]: No color changes to product, no label modifications, no cork caps, 
no generic bottles, standard metal crown cap only
```

### Ví dụ đúng vs sai

```diff
+ ĐÚNG: Upload 86480_bottle_nobg.png → "Keep product identical. Place on rustic oak table 
+        in a Vietnamese garden at golden hour."
+ ĐÚNG: Upload glass_nobg.png → "Keep glass identical with brand logo visible. 
+        Background: cozy living room with warm lighting."

- SAI:  "Generate a Benediktiner bottle on a table" (không có reference → AI bịa màu)
- SAI:  "A green Benediktiner bottle" (Benediktiner KHÔNG có chai xanh)
- SAI:  "A beer glass" (không chỉ định ly có logo brand → AI vẽ ly trơn)
```

---

## STYLE 1: HERO PRODUCT — Ảnh sản phẩm chủ đạo

> Mục đích: Banner website, ảnh đại diện, thumbnail e-commerce
> Aspect: 4:5 (social), 16:9 (banner), 1:1 (e-commerce)

### Bitburger Premium Pils — Clean Modern
```
High-end advertising packshot of a Bitburger Premium Pils 500ml aluminum can 
with emerald green and gold branding, alongside a branded tulip glass filled 
with crystal-clear golden pilsner beer, perfectly formed white foam head. 
Positioned on a wet black reflective surface showing crisp mirror reflection. 
Cool-toned studio lighting with sharp white rim light accentuating the can's 
metallic surface and water droplets. Deep navy blue seamless backdrop. 
Shot on Canon EOS R5, 85mm lens, f/5.6, tack-sharp focus, high dynamic range. 
Commercial photography, minimalist, premium, photorealistic, 8K resolution.
```

### Benediktiner Weissbier — Premium Studio
```
Professional commercial product photograph of a Benediktiner Weissbier 500ml 
dark brown glass bottle with ornate gold monastery label, positioned beside 
a tall Weizen glass filled with naturally cloudy golden-amber wheat beer and 
thick creamy white foam head overflowing slightly. Centered on a polished 
dark granite surface with gentle reflection. Three-point studio softbox 
lighting, warm golden rim light from behind highlighting the glass edges 
and condensation droplets on the bottle. Neutral dark charcoal gradient 
background. Shot on Hasselblad X2D, 90mm lens, f/4, sharp focus on label 
and foam texture, shallow depth of field background. Ultra-realistic, 
premium advertising aesthetic, 8K resolution.
```

### Benediktiner Dunkel — Moody Evening
```
Cinematic product photograph of Benediktiner Weissbier Dunkel 500ml bottle 
beside a tall Weizen glass filled with rich chestnut-brown cloudy dark wheat 
beer, dense tan foam head. Positioned on a weathered dark oak table surface. 
Single warm overhead spotlight creating dramatic chiaroscuro with deep amber 
tones. Background: soft out-of-focus fireplace ember glow creating warm 
atmospheric bokeh. Shot on Sony A7R IV, 85mm lens, f/2.8, sharp focus on 
glass texture, shallow depth of field. Deep shadows, rich warm tones. 
High-end beverage advertising, photorealistic, 8K resolution.
```

### Benediktiner Hell — Fresh Morning
```
Clean bright product photograph of Benediktiner Hell 500ml bottle alongside 
a classic beer glass filled with crystal-clear golden Bavarian lager, fine 
white foam. Positioned on pristine white marble countertop with a single 
wheat stalk as minimal prop. Soft natural morning window light wrapping 
evenly around the bottle creating gentle transparent highlights in the beer. 
Light airy studio background with subtle warm gradient. Shot on Fujifilm 
GFX 100S, 80mm lens, f/4, crisp detail throughout. Airy, clean, refreshing 
mood. Premium e-commerce photography, photorealistic.
```

---

## STYLE 2: LIFESTYLE — Thương hiệu trong đời sống

> Mục đích: Social media posts, brand awareness, aspirational content
> Aspect: 4:5 (feed), 9:16 (stories/reels)

### Benediktiner — Garden Moment
```
Lifestyle product photograph of two Benediktiner Weissbier bottles and a 
filled Weizen glass on a weathered wooden outdoor table in a lush Vietnamese 
tropical garden. Natural golden hour sunlight filtering through green foliage, 
creating warm dappled light patterns on the table. Condensation running down 
the cold glass. Background: blurred tropical plants and soft fairy lights. 
Shot on Sony A7R IV, 50mm lens, f/2.0, shallow depth of field, warm color 
grading. Inviting, relaxing, aspirational lifestyle atmosphere. Professional 
editorial photography.
```

### Bitburger — Rooftop Evening
```
Cinematic lifestyle photograph of a Bitburger Premium Pils can being poured 
into a tulip glass on a modern Saigon rooftop bar counter. City skyline with 
warm lights creating soft bokeh in the background. Evening blue hour lighting 
mixed with warm tungsten bar lighting reflecting off the metallic can surface. 
Condensation on glass surface catching ambient light. Shot on 35mm lens, f/2.0, 
shallow depth of field. Urban, sophisticated, contemporary lifestyle. 
Premium commercial photography, photorealistic.
```

### Khoảnh khắc bạn bè
```
Candid lifestyle photograph of four young Vietnamese professionals (late 20s) 
clinking glasses of golden German beer at a modern Hanoi rooftop bar during 
golden hour. City skyline soft-focused behind them, everyone laughing naturally. 
Table has Bitburger cans and Benediktiner bottles. Warm evening golden light 
wrapping around the group with soft city bokeh behind. Shot on Canon EOS R5, 
85mm lens, f/1.8, shallow depth of field. Editorial lifestyle photography, 
authentic joy, warm tones.
```

### Buổi tối thư giãn
```
Intimate lifestyle photograph of a Vietnamese man in his early 30s relaxing 
on a leather sofa in a well-designed modern apartment, savoring a glass of 
Benediktiner Weissbier while reading a book. Warm table lamp casting soft 
directional light, vinyl records on a shelf visible in background. Shot on 
85mm lens, f/1.4, very shallow depth of field focused on the beer glass 
in his hand. Calm sophistication, personal ritual, quiet luxury mood. 
Documentary-style editorial photography.
```

---

## STYLE 3: FOOD PAIRING — Bia × Ẩm thực

> Mục đích: Engagement content, educational posts, carousel
> Aspect: 1:1 (carousel), 4:5 (feed)

### Weissbier × Phở
```
Elevated editorial food photograph featuring a Benediktiner Weissbier bottle 
and filled Weizen glass beside a steaming bowl of Vietnamese pho with fresh 
herbs and lime wedges. Dark moody wooden table surface. Soft directional 
window light from the left creating natural shadows and highlighting the 
rising steam wisps from the pho. Shot on 70mm macro lens, f/2.8, shallow 
depth of field focused on the beer glass and pho. Warm earth tones, intimate 
atmosphere. High-end food magazine editorial photography.
```

### Dunkel × BBQ
```
Rustic food pairing photograph of Benediktiner Weissbier Dunkel bottle with 
a glass of rich chestnut-brown wheat beer alongside a platter of smoky 
grilled Vietnamese pork ribs on a cast iron board. Dark wood table surface. 
Warm firelight glow from the left mixed with soft overhead spotlight creating 
dramatic highlights on the condensation. Background: blurred ember glow. 
Shot on 85mm lens, f/2.8. Dark moody food photography, masculine energy. 
Colors: chestnut, dark amber, burnt orange. Photorealistic, editorial.
```

### Overhead Flat Lay — Hải sản Việt
```
Overhead flat lay food photograph: Benediktiner Weissbier bottle centered on 
a rustic wooden board, surrounded by Vietnamese seafood — grilled prawns, 
fried spring rolls, dipping sauces in ceramic bowls, fresh herbs scattered. 
Two filled beer glasses at opposite corners. Bright even overhead lighting 
creating minimal shadows, fresh vibrant colors. Shot on 35mm lens, f/8 for 
maximum sharpness throughout. Food magazine editorial style. Square 1:1 
composition for Instagram.
```

### Pils × Bánh Mì
```
Editorial food photograph of a Bitburger Premium Pils can and filled tulip 
glass beside a crispy Vietnamese bánh mì overflowing with grilled pork, 
pickled vegetables, fresh cilantro and chili on a marble counter. Natural 
side lighting from a window creating soft shadows. Fresh, vibrant colors 
with cool metallic accents from the can. Shot on 85mm lens, f/2.8, shallow 
depth of field. Modern fusion food photography, clean and appetizing.
```

---

## STYLE 4: MACRO / ASMR DETAIL — Cận cảnh cảm giác

> Mục đích: TikTok, Reels, Stories — sensory content
> Aspect: 9:16 (vertical video thumbnail), 1:1 (feed)

### Pour Shot — Slow Pour
```
Extreme close-up macro photograph capturing Benediktiner Weissbier being 
poured into a tall Weizen glass at a 45-degree angle. Focus on the cascading 
golden-amber liquid, rising carbonation bubbles, and the creamy foam building 
at the surface. Dark moody background isolating the action. High-speed 
photography freezing the pour mid-motion. Dramatic backlit rim lighting 
highlighting individual bubbles and foam texture. Shot on 100mm macro lens, 
f/2.8. Professional studio lighting. Aspirational, sensory, premium beer 
commercial aesthetic. Photorealistic, 8K resolution.
```

### Condensation Detail
```
Ultra-detailed macro photograph of condensation droplets running down a cold 
Bitburger Premium Pils can surface. Extreme close-up showing individual water 
beads on the metallic emerald green surface with gold label partially visible 
and one large drop about to fall. Crisp cool-toned studio lighting creating 
tiny specular highlights in each droplet. Shallow depth of field with only the 
nearest droplets in razor-sharp focus. Dark blurred background. Shot on 100mm 
macro lens, f/4. Refreshing, tactile, sensory-driven commercial photography. 
Photorealistic.
```

### Foam Texture
```
Extreme macro photograph of thick creamy beer foam head in a Weizen glass, 
showing individual bubble structure and the golden-amber Benediktiner Weissbier 
visible through the translucent foam layer. Warm overhead lighting creating 
soft highlights on each bubble. The glass rim visible at the edge of frame. 
Shot on 100mm macro lens, f/2.8 with focus stacking for maximum detail. 
Sensory, textural, ASMR-aesthetic. Premium beverage photography, 
photorealistic, 8K.
```

### Can Opening — Action Freeze
```
High-speed action photograph capturing the exact moment a Bitburger Premium 
Pils can tab is being pulled open, with a fine mist spray and carbonation 
escaping upward. Dramatic dark background isolating the metallic can. Sharp 
rim lighting catching the spray particles mid-air. Visible condensation on 
the cold can surface. Shot on 85mm lens, f/4, 1/8000s equivalent freeze 
frame. Dynamic, refreshing, satisfying moment. Commercial advertising 
photography, photorealistic.
```

---

## STYLE 5: STORYTELLING — Câu chuyện thương hiệu

> Mục đích: Blog posts, series "Hành trình bia Đức", brand heritage
> Aspect: 16:9 (blog banner), 4:5 (carousel)

### Origin Story — Tu viện Ettal
```
Atmospheric wide-angle photograph of a medieval Bavarian monastery interior 
(Kloster Ettal style) at dawn, golden morning light streaming through ancient 
arched stone windows into a brewery cellar. A single Benediktiner bottle 
positioned on an old oak barrel in the golden foreground light. Mist rising 
from the Alpine valley visible through a distant window. Shot on 24mm lens, 
f/8 for deep focus. Spiritual, timeless, sacred craft atmosphere. 
Cinematic documentary photography, warm golden tones, 8K resolution. 
Wide aspect ratio 16:9 with text space at top.
```

### Reinheitsgebot — Luật Tinh khiết 1516
```
Artistic still life photograph: four raw brewing ingredients arranged on 
an aged wooden surface — golden barley grains in a mound, green hop flowers 
on a stem, a glass pitcher of crystal-clear spring water with light 
refracting through it, and fresh yeast culture in a small ceramic bowl. 
A vintage German parchment scroll partially visible underneath. Dramatic 
Renaissance painting lighting style, strong directional warm light from 
upper left creating deep chiaroscuro shadows. Shot on 85mm lens, f/4. 
Reverent, pure, timeless tradition. Fine art photography, photorealistic.
```

### The Brewmaster's Hands
```
Cinematic close-up photograph of weathered German brewmaster's hands 
carefully examining golden barley grains, individual grains visible in sharp 
detail. Copper brewing kettle with reflected amber light visible in soft 
bokeh background. Steam gently rising. Shot on 85mm lens, f/2.0, very 
shallow depth of field focused on the hands and grain. Warm golden 
directional side lighting. Craftsmanship, dedication, human touch mood. 
Documentary photography style, photorealistic.
```

---

## STYLE 6: SEASONAL / CAMPAIGN — Chiến dịch theo mùa

> Mục đích: Holiday posts, campaign visuals, limited editions
> Aspect: 1:1 (social), 9:16 (stories), 16:9 (banner)

### Tết / Lunar New Year
```
Festive premium product photograph of Benediktiner Weissbier and Dunkel 
bottles arranged with filled beer glasses on a traditional Vietnamese 
lacquered red and gold wooden tray. Surrounding elements: fresh kumquat 
branch with orange fruits, red silk ribbons, gold lucky money envelopes, 
traditional mai blossoms. Warm golden ambient lighting with soft bokeh of 
fairy lights in background. Rich color palette: deep red, gold, warm amber 
harmonizing with the beer's natural tones. Shot on 85mm lens, f/2.8, 
shallow depth of field. Luxurious, celebratory, Vietnamese Lunar New Year 
atmosphere. Premium commercial photography, photorealistic.
```

### Summer Campaign — Beach Vibes
```
Bright refreshing product photograph of Bitburger 0.0% Non-Alcoholic cans 
arranged in a vintage metal ice bucket overflowing with crushed ice on a 
sandy beach surface. Background: soft-focus turquoise ocean waves and palm 
tree silhouettes. Bright natural midday sunlight creating vivid specular 
highlights on the ice and wet can surfaces. Water splashes frozen around 
the base. Shot on 35mm wide-angle lens, f/4, sharp throughout. Vibrant, 
energetic, summer lifestyle. Colors: ocean blue, bright white, emerald 
green, gold. Commercial advertising photography.
```

### Mid-Autumn Festival
```
Atmospheric product photograph of Benediktiner bottles alongside traditional 
Vietnamese mooncakes on a dark wooden table under soft moonlight. Paper 
lanterns with warm orange glow visible in soft bokeh background. A filled 
Weizen glass with amber-gold beer reflecting the lantern light. Shot on 
85mm lens, f/2.8. Warm, intimate, cultural celebration atmosphere. Colors: 
deep amber, warm gold, soft orange, dark wood tones. Premium commercial 
photography, photorealistic.
```

### Christmas / Year-End
```
Cozy premium product photograph of Bitburger and Benediktiner bottles on 
a dark marble surface beside a decorated miniature Christmas tree with 
warm fairy lights. Two filled beer glasses, soft snowfall effect in dark 
background. Rich warm tungsten lighting creating golden highlights on the 
glass surfaces and bottles. Shot on 85mm lens, f/2.0, shallow depth of 
field with fairy light bokeh. Festive warmth, premium gifting, European 
holiday tradition meets Vietnamese celebration. Commercial photography.
```

---

## STYLE 7: PREMIUM ADVERTISING — Ảnh quảng cáo chuyên nghiệp

> Mục đích: Facebook Ads, Google Display, banner campaigns
> Aspect: 1200x628 (FB ads), 1080x1080 (IG ads), 1200x628 (Google)

### Hero Ad — Bitburger
```
Dramatic advertising hero photograph of a Bitburger Premium Pils can 
positioned at a slight dynamic angle with a controlled beer splash arc 
flowing behind it, individual droplets frozen mid-air. Deep navy blue 
gradient background with subtle gold particle effects and professional 
light streaks. The can's emerald green and gold branding perfectly sharp. 
Shot on Hasselblad X2D, 90mm lens, f/8 for maximum sharpness. Ultra-clean, 
CGI-quality commercial rendering, premium advertising aesthetic. Text space 
at bottom for "Bitte ein Bit" overlay. 8K resolution, photorealistic.
```

### Hero Ad — Benediktiner
```
Premium advertising photograph of Benediktiner Weissbier bottle emerging 
from dramatic volumetric golden light rays breaking through dark clouds, 
creating a heavenly cathedral-of-light effect. The tall Weizen glass below 
is filled with cloudy amber beer, foam overflowing and catching the golden 
light. Ethereal, heavenly mood with dark-to-gold gradient background. 
Shot on 85mm lens, f/4. Text space for "Dem Himmel so nah" tagline. 
Cinematic advertising photography, photorealistic, 8K resolution.
```

### Combo — Three Brothers
```
Clean premium promotional photograph of three Benediktiner bottles 
(Weissbier, Dunkel, Hell) standing side by side on a polished black 
reflective surface, each with a glass of its distinct beer style positioned 
in front. Gradient background transitioning from amber gold (left, Weissbier) 
through deep chestnut (center, Dunkel) to bright cream gold (right, Hell). 
Each beer's natural color reflected in the surface beneath it. Even studio 
lighting with soft rim highlights on each bottle. Shot on 70mm lens, f/8 
for even sharpness across all three. Premium retail advertising, 
photorealistic, 8K.
```

---

## STYLE 8: UGC / SEEDING — Ảnh tự nhiên

> Mục đích: KOL seeding, review posts, community content
> Aspect: 4:5 (feed), 9:16 (stories). Style: phone-camera authentic

### Unboxing moment
```
Point-of-view first-person photograph of hands opening a kraft paper 
delivery box containing a 12-pack of Benediktiner Weissbier bottles nestled 
in straw packing material. Kitchen counter background with natural daylight 
from window. Shot on iPhone 16 Pro, slightly warm natural filter, casual 
framing with slight tilt. Authentic unboxing excitement, genuine joy. 
Natural unedited mobile photography aesthetic. Vertical 4:5 composition.
```

### "Cuối ngày xứng đáng"
```
Casual selfie-style photograph of a Vietnamese young woman in her late 20s 
holding up a glass of Bitburger Pils toward the camera with a satisfied 
natural smile, sitting at a Hanoi street food stall. Colorful neon street 
signs creating bokeh behind her. Table messy with local dishes and an open 
Bitburger can. Shot on smartphone front camera perspective, natural skin 
tones, warm evening ambient light, no heavy editing. Authentic UGC, 
relatable Gen Z casual lifestyle. Vertical 4:5.
```

### Review — Side by Side
```
Overhead table photograph taken by a food blogger: an open notebook with 
handwritten Vietnamese tasting notes visible, two glasses of different 
Benediktiner beers side by side (cloudy amber Weissbier vs dark chestnut 
Dunkel for visual comparison), a pen, and a phone showing the camera app 
screen. Natural warm indoor cafe lighting, slightly messy authentic setup 
on a light wood table. Shot on smartphone, natural perspective. Honest 
review, educational content aesthetic. Square 1:1 composition.
```

---

## WORKFLOW: Ảnh gốc → AI Background (Official Reference Pipeline)

> Pipeline chuẩn cho Bia Thầy Tu: **giữ nguyên sản phẩm từ ảnh chính hãng**, chỉ đổi bối cảnh.
> ⚠️ **TUYỆT ĐỐI** không để AI tự vẽ sản phẩm từ text description.

### Bước 1: Chọn ảnh gốc chính hãng (BẮT BUỘC)

```yaml
Nguồn duy nhất: public/images/products/official/
Ưu tiên:
  - Transparent bg (*_nobg.png, *_removebg.png) → tốt nhất cho composite
  - Studio bg (*_betaut.jpg) → tốt cho AI background replacement
  - Pack shots (*_frontal*.jpg) → tốt cho hero ads

Chọn theo sản phẩm:
  Bitburger Pils:
    Chai:  flasche_longneck_033l_pils_frontal_betaut_V8.jpg
    Lon:   90160_Bitburger_05l_Dose_frontal_unbetaut_LG.jpg
    Ly:    60922_Bitb_Pils_Pokal.jpg
    Combo: 74560_Bitb_Pils_05l_Flasche_Pokal_frontal_betaut_142x291mm.jpg
    Bom:   88335_Bitb_PremiumPils_Fass_5L_Export_frontal_betaut_001.jpg
  
  Bitburger 0.0%:
    Chai:  20201006_bitburger_flasche_033l_export_drive.jpg
    Pack:  76979_Bit_Pils_Drive_Alkoholfrei_Export_Sixpack_6er_6x033l.jpg
  
  Benediktiner Weissbier:
    Chai (nobg):  86480_bottle_nobg.png
    Chai (studio): 86480_Benediktiner_Weiss_NT_Flasche_05l_betaut.jpg
    Ly (nobg):    glass_nobg.png
    Lon:          87205_Bene_Weissbier_05l_Dose_frontal_Export.jpg
    Pack:         85981_Bene_Weissbier_NT_Sixpack_033l_Export.jpg
  
  Benediktiner Dunkel:
    Combo:  49717_Bene_GL_vO_WB_dunkel.jpg
    Chai:   57425_Benediktiner_Dunklel_VO_E-Hinweis.jpg
    Lon:    86312_Bene_Dunkel_Dosenkarton_4x05l_schraeg_links.jpg
  
  Benediktiner Hell:
    Combo:  Bene_GL_vO_WB_hell.jpg
  
  Benediktiner AF:
    Chai:   86087_Bene_Weissbier_AF_Flasche_Abbildung.jpg
    Ly:     86087_Bene_Weissbier_AF_Glas_Abbildung.jpg
```

### Bước 2: AI Background Generation

```yaml
Tool: Gemini API (gemini-3.1-flash-image-preview) hoặc Flux Kontext
Workflow:
  1. Upload ảnh gốc từ Bước 1
  2. Prompt: "Keep the product (bottle/can/glass) EXACTLY identical to the 
     reference — same label design, same colors, same proportions. 
     Only change the background to: [SCENE DESCRIPTION]."
  3. Verify: Kiểm tra output có giữ đúng màu sắc, logo, và tỉ lệ không
  4. Iterate: "Keep everything about the product. Adjust only the lighting to [...]"

Volume: Mỗi SP × 8 styles × 1-2 prompts = 32-64 ảnh
```

### Bước 3: Quality Check (BẮT BUỘC trước khi dùng)

```yaml
Checklist:
  - [ ] Màu nhãn chai/lon giống ảnh gốc 100%?
  - [ ] Logo thương hiệu trên ly/chai có đúng không?
  - [ ] Nắp chai là nắp kim loại crown cap (KHÔNG phải nắp bần/cork)?
  - [ ] Tỉ lệ chai/lon so với ly có tự nhiên không?
  - [ ] Bọt bia đúng style (Weissbier = dày xốp, Pils = mịn trắng)?
  - [ ] Không có text/chữ lạ trên nhãn?

Nếu FAIL bất kỳ mục nào → LOẠI ảnh, tạo lại với prompt rõ hơn
```

### Bước 4: Upscale & Polish

```yaml
Tool: Topaz Photo AI hoặc Real-ESRGAN
Input: Ảnh đã pass Quality Check
Output: Production-ready 4K+
Lưu vào: public/images/products/official/ (nếu đạt chuẩn brand)
         public/images/products/generated/ (nếu dùng cho content)
```


## Anti-Patterns (Những lỗi AI hay gặp cần tránh)

1. **Sai nắp chai (Bottle Cap Error):** AI rất hay tự vẽ nắp bần (cork) giống chai rượu vang hoặc champagne. **BẮT BUỘC** dùng prompt: `standard metal crown cap`, `classic beer bottle cap`. Trong negative prompt: `no cork`, `no wine cork`, `no champagne cap`.
2. **Sai tỉ lệ bọt (Foam Proportion):** Bọt bia lúa mì (Weissbier) phải dày, xốp và mượt. Tránh bọt quá mỏng như bia Lager thông thường.
3. **Chữ viết lộn xộn (Gibberish Text):** Nếu AI tự generate text trên nhãn, hãy yêu cầu `clean label without garbled text` hoặc dùng Photoshop/Canva để thay nhãn thật sau đó.

---

## Tool Reference

| Tool | Dùng khi | Ưu điểm |
|------|---------|---------|
| **Nano Banana 2** (`gemini-3.1-flash-image-preview`) | Batch generation, iteration nhanh | Free API, edit conversational |
| **Nano Banana Pro** (`gemini-3-pro-image-preview`) | Final hero assets | 4K output, reasoning tốt |
| **Flux Kontext** | Đổi nền giữ nguyên SP | Brand consistency tuyệt đối |
| **Midjourney v6** | Exploration, mood board | Artistic, community prompts |
| **Pebblely** | E-commerce background | Auto shadow/reflection |
| **Topaz Photo AI** | Upscale final output | 8K crisp detail |

---

## Quy tắc chung khi dùng prompt

1. **Front-load Subject**: 20 từ đầu tiên MÔ TẢ SẢN PHẨM chính xác
2. **Camera realism**: Luôn gọi tên camera + lens + f-stop cụ thể
3. **Light behavior**: Mô tả ánh sáng "làm gì" thay vì chỉ tên
4. **Localize cho VN**: Bối cảnh Việt Nam (Hà Nội, Sài Gòn, ẩm thực Việt)
5. **Giữ tone premium**: Bia nhập khẩu Đức = phân khúc cao cấp
6. **Đa dạng ratio**: 1:1 (IG), 9:16 (Stories/Reels), 4:5 (feed), 16:9 (banner)
7. **Tránh underage**: Mọi người trong ảnh phải trên 25 tuổi rõ ràng
8. **Version control**: Lưu prompt nào cho kết quả tốt để reproduce
9. **Iterate nhỏ**: Mỗi lần chỉnh 1 biến duy nhất
10. **Reference image**: Upload ảnh mẫu khi có — hiệu quả hơn text-only 3-5x
