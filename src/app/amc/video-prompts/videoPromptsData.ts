/**
 * Video Prompts Data v3.0 — 50 Kịch Bản Storyselling × AI Video
 *
 * Framework: SAECS (Subject → Action → Emotion → Cinematography → Style)
 * Brand: Bia Thầy Tu — Bitburger & Benediktiner
 * Tools: Seedance 2.0 (ByteDance) & Google Veo 3.1
 *
 * Tổ chức theo PAGE = dịp sử dụng (storyselling occasions)
 */

export type VideoTool = 'seedance' | 'veo3';

export interface VideoPrompt {
  id: string;
  name: string;
  description: string;
  storyboard: string;
  pageId: string;
  tool: VideoTool;
  toolLabel: string;
  duration: string;
  aspect: string;
  purpose: string;
  product: string;
  prompt: string;
  audioHint: string;
  brandNotes: string[];
  tips: string[];
}

export interface VideoPage {
  id: string;
  icon: string;
  label: string;
  color: string;
  description: string;
  insight: string;
}

export const TOOLS: { id: VideoTool; label: string; icon: string; color: string; platform: string }[] = [
  { id: 'seedance', label: 'Seedance 2.0', icon: '🎞️', color: '#FF6B6B', platform: 'dreamina.capcut.com' },
  { id: 'veo3', label: 'Veo 3.1', icon: '🎥', color: '#4ECDC4', platform: 'aistudio.google.com' },
];

export const VIDEO_PAGES: VideoPage[] = [
  { id: 'tiep-khach', icon: '🏠', label: 'Tiếp Khách Tại Gia', color: '#D4A530', description: 'Video cho dịp tiếp đón khách tại nhà — tinh tế, không phô trương', insight: 'Sự tinh tế đôi khi chỉ nằm ở việc chọn đúng thứ đặt trên bàn trước khi khách đến.' },
  { id: 'after-work', icon: '🌙', label: 'After-Work / Thư Giãn', color: '#6C5CE7', description: 'Video khoảnh khắc riêng tư sau giờ làm — chậm, tĩnh, premium', insight: 'After-work không phải đi bar. Đôi khi chỉ cần đúng thứ đang cầm trên tay.' },
  { id: 'bua-toi', icon: '🍽️', label: 'Bữa Tối / Food Pairing', color: '#F59E0B', description: 'Video bia kết hợp ẩm thực — storyselling qua món ăn', insight: 'Khi món ăn được chuẩn bị kỹ, đồ uống cũng phải xứng tầm.' },
  { id: 'ban-be', icon: '🥂', label: 'Bạn Bè / Gathering', color: '#00B894', description: 'Video nhóm bạn — vui nhưng chỉn chu, không ồn ào', insight: 'Anh host trận như host tiệc. Không cần cầu kỳ — cần chỉn chu.' },
  { id: 'qua-bieu', icon: '🎁', label: 'Quà Biếu / Gift', color: '#E17055', description: 'Video quà tặng — sang trọng, khác biệt, unboxing', insight: 'Tặng bia Đức chính hãng — lịch sự, khác biệt, và người nhận thật sự dùng được.' },
  { id: 'thuong-hieu', icon: '🏛️', label: 'Thương Hiệu / Heritage', color: '#8B5CF6', description: 'Video câu chuyện thương hiệu — 400 năm tu viện, Reinheitsgebot', insight: '400 năm công thức tu viện Ettal. Men sống. Không lọc. Bia lúa mì đúng chuẩn Bavaria.' },
  { id: 'san-pham', icon: '🏆', label: 'Sản Phẩm / Hero Shot', color: '#EC4899', description: 'Video hero sản phẩm — quảng cáo, landing page, banner', insight: 'Không bán bia. Bán trải nghiệm xứng tầm.' },
  { id: 'kien-thuc', icon: '📚', label: 'Kiến Thức / Education', color: '#3B82F6', description: 'Video hướng dẫn — cách rót, nhiệt độ, tasting note', insight: 'Bia Đức có cách thưởng thức riêng — và khi rót đúng, bạn sẽ hiểu vì sao.' },
];

// ═══════════════════════════════════════════════════════════════
// 50 VIDEO PROMPTS — Organized by Storyselling Pages
// ═══════════════════════════════════════════════════════════════

export const VIDEO_PROMPTS: VideoPrompt[] = [

  // ╔═══════════════════════════════════════════╗
  // ║  PAGE 1: TIẾP KHÁCH TẠI GIA (6 prompts)  ║
  // ╚═══════════════════════════════════════════╝

  {
    id: 'tk-01',
    name: 'Chuẩn Bị Bàn Tiếp Khách',
    description: 'Chủ nhà chuẩn bị bàn tiếp khách: lấy bia từ tủ lạnh, xếp ly, bày cold cuts, rót bia trước giờ khách đến.',
    storyboard: '🎬 Kịch bản:\n• Mở tủ lạnh lấy chai Benediktiner Weissbier đã ướp lạnh\n• Đặt bộ cốc Weizen chính hãng lên bàn gỗ tối\n• Bày khay phô mai, hạt điều, salami\n• Rót bia nghiêng 45° vào ly — bọt kem trắng dày dâng lên\n• Camera lùi: bàn tiếp khách hoàn hảo, nến đã đốt\n\n💡 "Sự tinh tế nằm ở việc chọn đúng thứ đặt trên bàn trước khi khách đến."',
    pageId: 'tiep-khach', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'Facebook Reels, TikTok — storyselling tiếp khách', product: 'Benediktiner Weissbier 500ml',
    prompt: `Follow @Image1 for Benediktiner Weissbier 500ml dark brown bottle with gold monastery label and standard metal crown cap.

0–3s: Close-up hand opens refrigerator, reaches for chilled Benediktiner Weissbier 500ml dark brown bottle. Condensation on cold glass. Warm kitchen light.

3–7s: Medium shot. Hands place tall Weizen glasses on dark wood table. Wooden board with cheese, roasted cashews, salami nearby. Small candle flickers. Golden directional light from left.

7–12s: Macro close-up. Bottle tilts 45°, naturally cloudy golden-amber wheat beer flows along glass wall. Thick creamy white foam builds. Camera pushes in on rising foam. Backlit rim light catches bubbles.

12–15s: Wide reveal. Complete table: two filled Weizen glasses, food board, candle, bottle. Dark wood #2C1810, warm amber light. Hold for text.

Style: Cinematic editorial, warm intimate, premium home entertaining. Colors: #2C1810, #D4A530, #F5E6D3.`,
    audioHint: 'Tủ lạnh mở, chai đặt, bia rót chậm, bọt dâng, nến cháy. Không nhạc — ASMR.',
    brandNotes: ['Chai: 500ml dark brown, gold monastery label, metal crown cap (KHÔNG nắp bần)', 'Ly: Weizen glass tulip cao', 'Bia: cloudy golden-amber, foam TRẮNG KEM dày', 'Palette: Dark Wood #2C1810 + Gold #D4A530'],
    tips: ['Upload pack shot làm @Image1', 'Rót 45° = kỹ thuật đúng', 'Post trước cuối tuần'],
  },
  {
    id: 'tk-02',
    name: 'Nâng Ly Cùng Khách',
    description: 'Chủ nhà và khách nâng ly toast — ánh bia vàng chạm ánh nến. Sự kết nối qua ly bia chọn kỹ.',
    storyboard: '🎬 Kịch bản:\n• Hai người cầm ly Weizen đầy bia hổ phách\n• Nâng ly ngang tầm mắt, nến phản chiếu qua thành ly\n• Chạm ly nhẹ — âm thanh trong trẻo\n• Close-up bọt bia dao động sau cú chạm\n• Mỉm cười, nhấp ngụm đầu tiên\n\n💡 "Người tinh tế không nói nhiều. Nhưng khách sẽ nhận ra."',
    pageId: 'tiep-khach', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'Instagram Reels — khoảnh khắc kết nối', product: 'Benediktiner Weissbier',
    prompt: `Cinematic medium close-up, slow dolly-in. Two people at warmly-lit dark wood dining table. Two tall Weizen glasses with naturally cloudy golden-amber wheat beer, thick creamy white foam. Candlelight reflecting through glass creating amber highlights. They raise glasses and clink softly. Foam ripples from gentle impact. Both take slow first sip with subtle appreciation. Warm golden lamp and candlelight, shallow depth of field. #2C1810 table, #D4A530 beer. Shot on 85mm, f/1.8. SFX: delicate glass clink, soft evening ambient. (no subtitles)`,
    audioHint: 'Ly chạm trong trẻo, không gian yên tĩnh buổi tối, nến cháy.',
    brandNotes: ['Ly Weizen tulip cao, bia cloudy golden-amber, foam TRẮNG KEM', 'KHÔNG cầm chai uống trực tiếp', 'Nhân vật > 28 tuổi, smart casual'],
    tips: ['Veo 3 render clink rất tốt', 'Luôn thêm (no subtitles)', 'Pair với CTA "Inbox THỬ"'],
  },
  {
    id: 'tk-03',
    name: 'Mở Tủ Lạnh — First Impression',
    description: 'Close-up mở tủ lạnh: hàng Benediktiner xếp ngay ngắn bên trong tủ, ánh sáng tủ chiếu lên nhãn vàng. Ấn tượng đầu tiên khi khách nhìn vào.',
    storyboard: '🎬 Kịch bản:\n• Tay kéo cửa tủ lạnh — ánh sáng tủ bật lên\n• Reveal: 6 chai Benediktiner xếp gọn, nhãn gold quay ra\n• Camera từ từ zoom vào nhãn tu viện\n• Tay lấy 2 chai ra — condensation tỏa khói lạnh\n• Đóng tủ, quay lại bàn đã setup sẵn\n\n💡 "Tủ lạnh ghi điểm: không phải nước ngọt, không phải bia đại trà."',
    pageId: 'tiep-khach', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '12s', aspect: '9:16',
    purpose: 'TikTok — satisfying reveal, everyday luxury', product: 'Benediktiner Weissbier 500ml',
    prompt: `Follow @Image1 for Benediktiner Weissbier 500ml.

0–3s: Close-up hand pulls open a modern stainless steel refrigerator door. Interior light illuminates. Reveal: six Benediktiner Weissbier 500ml dark brown bottles with gold monastery labels neatly arranged on a shelf, labels facing camera.

3–7s: Slow dolly-in on the bottles. Camera focuses on the ornate gold monastery label detail. Cold mist visible around the bottles. Studio-quality refrigerator interior light.

7–12s: Hand reaches in, picks up two bottles. Cold condensation creates visible vapor trails. Bottles lifted out. Cut to medium shot showing dark wood table already set with Weizen glasses, napkins, candle. The two bottles placed on table.

Style: Satisfying reveal, clean modern kitchen, warm-to-cool temperature contrast.`,
    audioHint: 'Tủ lạnh mở, hơi lạnh tỏa, chai cầm lên, đặt trên bàn gỗ.',
    brandNotes: ['6 chai xếp nhãn gold quay ra camera = visual impact', 'Condensation vapor = premium cold beer feel', 'Tủ lạnh modern, sạch sẽ — KHÔNG rối'],
    tips: ['Satisfying reveal = high engagement TikTok', 'Dùng cho "fridge tour" trend', 'Pair: "Tủ lạnh nhà anh có gì?"'],
  },
  {
    id: 'tk-04',
    name: 'Setup Bàn Phòng Khách — Cinematic',
    description: 'Time-lapse style: bàn trống → bày khăn → xếp ly → đặt bia → thắp nến → hoàn thiện. Quá trình chuẩn bị là câu chuyện.',
    storyboard: '🎬 Kịch bản:\n• Bàn gỗ trống, camera overhead\n• Tay trải khăn linen → đặt đĩa trắng\n• Xếp dao nĩa → đặt ly Weizen\n• Chai Benediktiner + chai Bitburger đặt vào\n• Thắp nến, chỉnh bông hoa nhỏ\n• Final frame: bàn tiếp khách hoàn hảo từ trên nhìn xuống\n\n💡 "Tiến trình chuẩn bị nói lên tất cả."',
    pageId: 'tiep-khach', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '1:1',
    purpose: 'Facebook Feed — bàn tiếp khách setup process', product: 'Benediktiner + Bitburger',
    prompt: `0–3s: Overhead shot of empty dark wood table #2C1810. Clean surface. Warm ambient lighting from above.

3–6s: Hands smoothly place a linen table runner. Then white ceramic plates positioned. Cutlery arranged precisely. Each movement deliberate, unhurried.

6–10s: Two tall Weizen glasses placed. Then a Benediktiner Weissbier dark brown bottle with gold label and a Bitburger Premium Pils emerald green can positioned together. A small wooden cheese board slides into frame.

10–13s: A match strikes, lighting a small candle. A tiny flower arrangement placed as final touch.

13–15s: Camera holds on the completed overhead view. Perfect table: linen, plates, cutlery, two beers, glasses, candle, flowers, cheese board. Warm golden glow. Hold for text overlay.

Style: Overhead process video, warm tones, satisfying setup. Stop-motion feel.`,
    audioHint: 'Khăn trải, đĩa đặt, ly xếp, nến bật — mỗi âm thanh rõ ràng. ASMR style.',
    brandNotes: ['Có CẢ Benediktiner (chai) VÀ Bitburger (lon) = portfolio diversity', 'Overhead angle = clean, Instagram-ready composition', 'Palette: dark wood, white ceramic, gold, green'],
    tips: ['Overhead setup videos rất popular trên FB/IG', 'Process = storytelling tự nhiên', 'Post caption: "Chuẩn bị tiếp khách 15 phút"'],
  },
  {
    id: 'tk-05',
    name: 'Khách Đến — Doorbell Moment',
    description: 'Chuông cửa reo, chủ nhà mở cửa đón khách, dẫn vào bàn đã setup. Khách ngạc nhiên khi thấy bàn bia Đức.',
    storyboard: '🎬 Kịch bản:\n• Chuông cửa reo, chủ nhà mở cửa\n• Tracking shot theo chủ nhà dẫn khách vào\n• Over-shoulder shot: khách nhìn thấy bàn đã setup\n• Close-up mặt khách — pleasantly surprised\n• Hai người ngồi xuống, chủ nhà rót bia\n\n💡 "Ghi điểm không cần nói. Bàn nói thay."',
    pageId: 'tiep-khach', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'Reels — khoảnh khắc tiếp khách, reaction', product: 'Benediktiner Weissbier',
    prompt: `Cinematic tracking shot, smooth Steadicam movement. Modern Vietnamese apartment, warm evening lighting. A host (male, early 30s, smart casual) opens the front door, greeting a guest warmly. Camera follows from behind as they walk through a short hallway into the living/dining area. The camera does an over-shoulder reveal: a beautifully set dark wood table with Benediktiner Weissbier bottles, tall Weizen glasses, a cheese board, and a lit candle. Warm golden ambient light. The guest pauses with a subtle expression of pleasant surprise. They sit down. The host picks up a bottle and begins pouring into a tilted Weizen glass. Naturally cloudy golden-amber beer flows. Shot on 35mm lens, f/2.8 for environmental context. Colors: warm amber, dark wood, golden highlights. SFX: doorbell, door opening, footsteps, subtle "wow" reaction, beer pouring. (no subtitles)`,
    audioHint: 'Chuông cửa, bước chân, reaction nhẹ, bia rót.',
    brandNotes: ['Veo 3 cần clear action choreography: door → walk → reveal → sit → pour', 'Host > 28 tuổi', 'Bàn đã setup sẵn = storytelling trước-sau'],
    tips: ['Tracking shot tạo immersion', '"Reveal" moment = hook cho viewer', 'Dùng cho series "Host như Pro"'],
  },
  {
    id: 'tk-06',
    name: 'Rót Bia Cho Khách — Hospitality Pour',
    description: 'Chủ nhà rót Weissbier cho khách — cận cảnh kỹ thuật rót chuẩn 45°. Bia trong ly, bọt dâng, đưa ly cho khách.',
    storyboard: '🎬 Kịch bản:\n• Tay cầm chai Benediktiner, tay kia cầm ly nghiêng 45°\n• Rót chậm dọc thành ly — bia chảy mượt\n• Dựng thẳng ly — bọt trắng dâng hoàn hảo\n• Đưa ly cho khách bằng hai tay — cử chỉ tôn trọng\n• Khách nhận ly, gật đầu cảm ơn\n\n💡 "Rót bia cho khách — không phải rót nước. Đây là nghi thức."',
    pageId: 'tiep-khach', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'TikTok, Reels — hospitality + education kết hợp', product: 'Benediktiner Weissbier 500ml',
    prompt: `Follow @Image1 for Benediktiner Weissbier 500ml.

0–5s: Close-up. Confident hands hold a tall Weizen glass at 45 degrees. Other hand tilts Benediktiner Weissbier bottle, pouring naturally cloudy golden-amber beer slowly along the glass wall. Smooth liquid flow, minimal foam at this angle. Clean background, warm side lighting.

5–10s: Glass gradually tilts upright. Thick creamy white foam builds dramatically. Camera follows the rising foam crown. Golden backlight catches foam texture.

10–15s: Medium shot. The host presents the filled glass to a seated guest using both hands — a gesture of respect. Guest receives it with a grateful nod. Both smile warmly. Table visible with food and candle. Hold for text overlay.

Style: Warm hospitality, clean tutorial-meets-lifestyle. Intimate lighting.`,
    audioHint: 'Bia rót dọc ly, bọt dâng, ly đặt nhẹ, cảm ơn thì thầm.',
    brandNotes: ['Rót 45° → upright = kỹ thuật chuẩn Weissbier', 'Đưa ly bằng 2 tay = cử chỉ Việt Nam lịch sự', 'Foam: TRẮNG KEM, dome shape'],
    tips: ['Kết hợp education + lifestyle', 'Two-handed gesture = Vietnamese cultural touch', 'Series: "Cách host tiếp khách chuẩn"'],
  },

  // ╔═══════════════════════════════════════════╗
  // ║  PAGE 2: AFTER-WORK / THƯ GIÃN (7 prompts)║
  // ╚═══════════════════════════════════════════╝

  {
    id: 'aw-01',
    name: 'After-Work Trên Ban Công',
    description: 'Tan làm, ngồi ban công với một lon Bitburger. Chỉ cần khoảnh khắc này — golden hour, thành phố nhá nhem.',
    storyboard: '🎬 Kịch bản:\n• Tay bật nắp lon Bitburger 500ml — "psst"\n• Rót vào ly tulip trên thành ban công\n• Wide: anh ngồi ghế, skyline nhá nhem phía sau\n• Close-up ly bia vàng sáng, bọt mỏng\n• Ngụm đầu — khẽ cười, buông lỏng vai\n\n💡 "After-work không phải đi bar. Chỉ cần đúng thứ đang cầm trên tay."',
    pageId: 'after-work', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'TikTok, Reels — storyselling after-work', product: 'Bitburger Premium Pils 500ml',
    prompt: `Follow @Image1 for Bitburger Premium Pils 500ml aluminum can emerald green and gold branding.

0–3s: Close-up hands pull tab of cold Bitburger 500ml emerald green can. Carbonation mist releases. Condensation droplets catch golden hour light. Balcony railing in bokeh.

3–8s: Medium shot. Man (early 30s, rolled sleeves) in leather chair on modern balcony. Pours crystal-clear golden pilsner into tulip glass. Fine white foam. City skyline dusk in warm bokeh. Blue hour + warm lamp mix.

8–12s: Close-up filled tulip glass against sunset. Crystal-clear golden, tiny rising bubbles, thin white foam. Glass catches last golden rays.

12–15s: Medium shot. He sips, shoulders relax, subtle smile. Solo moment. Navy + gold palette. Hold for text.

Style: Cinematic lifestyle, golden hour, solo premium. Colors: #1A365D, #D4A530, #1B4332.`,
    audioHint: 'Can tab pop, bia rót, thành phố xa, gió nhẹ. Jazz piano nhẹ hoặc không nhạc.',
    brandNotes: ['Lon Bitburger: 500ml aluminum, emerald green + gold', 'Ly: Pilsner tulip (KHÔNG Weizen)', 'Bia: crystal-CLEAR golden, fine foam MỎNG'],
    tips: ['Golden hour → blue hour = magic', 'Post 18h-20h thứ 6-7', 'Solo shot = premium personal ritual'],
  },
  {
    id: 'aw-02',
    name: 'Đêm Riêng Với Dunkel',
    description: 'Tối riêng tư, ghế da, đèn vàng, ly Dunkel nâu sẫm. Uống chậm, thưởng thức vị caramel.',
    storyboard: '🎬 Kịch bản:\n• Phòng tối ấm, đèn bàn vàng, shelf sách\n• Mở chai Dunkel — crown cap rơi lịch kịch\n• Rót vào ly Weizen: bia nâu hạt dẻ, bọt nâu nhạt\n• Sắc bia qua ánh đèn — caramel, amber\n• Ngồi ghế da, cầm ly, nhìn cửa sổ đêm\n\n💡 "Thưởng thức chậm là cách tốt nhất để nói lời cảm ơn với chính mình."',
    pageId: 'after-work', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'Instagram Reels — mood content tối riêng tư', product: 'Benediktiner Dunkel',
    prompt: `Cinematic close-up, subtle handheld drift. Dimly lit living room at night. Warm table lamp golden light. Benediktiner Weissbier Dunkel 500ml dark brown bottle with dark red-brown label beside tall Weizen glass filled with rich chestnut-brown cloudy dark wheat beer, dense tan foam. Man's hand slowly picks up glass, tilts to examine color against lamp — caramel, amber, chestnut layers. Contemplative sip. Leather armchair, bookshelf bokeh. Chiaroscuro lighting. Shot on 85mm, f/2.0, Kodak Portra 400 grain. Colors: #2C1810, chestnut, amber, cream. SFX: quiet room, leather creak, glass handling. (no subtitles)`,
    audioHint: 'Phòng yên tĩnh, da ghế kẽo kẹt, ly nâng, hớp nhẹ. Không nhạc.',
    brandNotes: ['Dunkel: nhãn RED-BROWN (khác Weissbier nhãn GOLD)', 'Bia: chestnut-brown CLOUDY, foam TAN/NÂU NHẠT', 'Mood: dark, cozy, indoor intimate'],
    tips: ['Chiaroscuro = 1 phía sáng, dramatic', 'Caption: "Tối nay, cho mình một khoảnh khắc."'],
  },
  {
    id: 'aw-03',
    name: 'Tháo Cà Vạt — Ritual Chuyển Trạng Thái',
    description: 'Tan sở: tháo cà vạt, xắn tay áo, bật nắp lon bia. Ritual đơn giản chuyển từ "công việc" sang "đời sống".',
    storyboard: '🎬 Kịch bản:\n• Close-up tay nới lỏng cà vạt, kéo ra\n• Xắn tay áo sơ mi lên 2 gấp\n• Camera pan xuống → tay mở lon Bitburger\n• Rót vào ly — bia vàng sáng, bọt crisp\n• Wide shot: anh ngồi sofa, TV tắt, chỉ bia và sự yên tĩnh\n\n💡 "Ritual 30 giây. Từ deadline sang deadline-free."',
    pageId: 'after-work', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'TikTok — ritual content, relatable lifestyle', product: 'Bitburger Premium Pils',
    prompt: `0–4s: Extreme close-up. A man's hands loosening a dark silk necktie, pulling it off slowly. Then rolling up white dress shirt sleeves precisely — two folds. Clean, deliberate movements. Warm apartment interior lighting.

4–8s: Camera pans down smoothly. Hands pick up a cold Bitburger Premium Pils 500ml emerald green aluminum can from a side table. Tab pops open with satisfying carbonation spray mist. 

8–12s: Close-up pour into a clean tulip Pilsner glass. Crystal-clear golden beer, fine white foam cap. Camera follows the pour.

12–15s: Wide shot. He sits on a leather sofa, glass in hand, TV off, apartment quiet. City lights through window. Just the beer and the silence. Navy-gold palette. Hold.

Style: Ritual content, minimalist, transition moment. Clean modern apartment.`,
    audioHint: 'Cà vạt tháo, vải xào xạc, can pop, bia rót, yên lặng.',
    brandNotes: ['Bitburger = after-work positioning', 'KHÔNG TV mở — sự yên tĩnh có chủ đích', 'Crystal-clear golden, fine foam'],
    tips: ['"Ritual" trend = relatable, high share', 'Post 17h-18h thứ 6', 'Pair: "Bạn cần bao lâu để chuyển trạng thái?"'],
  },
  {
    id: 'aw-04',
    name: 'Vinyl & Bia — Retro Vibes',
    description: 'Đặt đĩa vinyl, kim quay, nhạc jazz phát ra. Rót Dunkel, ngồi nghe. Thời gian chậm lại.',
    storyboard: '🎬 Kịch bản:\n• Tay lấy đĩa vinyl từ bìa → đặt lên mâm xoay\n• Kim hạ xuống — nhạc jazz bắt đầu\n• Camera tracking: từ máy vinyl sang bàn bên cạnh\n• Ly Dunkel đã rót sẵn, bọt tan mịn, cạnh sách\n• Tay cầm ly, nghiêng nhẹ → ánh nến qua bia nâu\n\n💡 "Slow living không phải trend. Là lựa chọn."',
    pageId: 'after-work', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'Instagram Reels — mood, aesthetic content', product: 'Benediktiner Dunkel',
    prompt: `Cinematic close-up, smooth tracking right. A hand carefully removes a vinyl record from its sleeve and places it on a vintage turntable. The needle drops — warm crackling begins. Camera tracks smoothly right, revealing a side table with a tall Weizen glass filled with rich chestnut-brown Benediktiner Dunkel beer, dense tan foam settled. A Benediktiner Dunkel bottle with dark red-brown label beside it. A small stack of books and a tea candle. Hand picks up the glass, tilts it gently — warm candlelight refracts through dark amber liquid. Moody warm interior, single warm light source. Shot on 50mm, f/1.8. Warm vintage grain. SFX: vinyl crackle, needle drop, soft jazz, glass pickup. (no subtitles)`,
    audioHint: 'Vinyl crackle, needle drop bắt đầu jazz mềm, ly nâng lên.',
    brandNotes: ['Dunkel + vinyl = retro masculine aesthetic', 'Bia: chestnut-brown, cloudy, tan foam', 'KHÔNG modern music — vinyl jazz only'],
    tips: ['Vinyl trend = aesthetic content, high save', 'Veo 3 audio sync: vinyl crackle + jazz built-in', 'Caption: "Jazz. Dunkel. Thứ bảy."'],
  },
  {
    id: 'aw-05',
    name: 'Sách & Bia — Quiet Evening',
    description: 'Đọc sách, ly bia bên cạnh. Trang sách lật, ánh đèn vàng, khung cảnh tĩnh lặng nhất có thể.',
    storyboard: '🎬 Kịch bản:\n• Close-up trang sách đang mở, ngón tay giữ trang\n• Camera pull back nhẹ: reveal ly Weissbier bên cạnh sách\n• Bookmark kẹp vào, sách gấp lại\n• Tay cầm ly bia, nhấp nhẹ\n• Đặt ly xuống cạnh sách — perfect still life\n\n💡 "Có những buổi tối chỉ cần sách và bia là đủ."',
    pageId: 'after-work', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '12s', aspect: '9:16',
    purpose: 'IG Reels — quiet aesthetic, bookstagram crossover', product: 'Benediktiner Weissbier',
    prompt: `Follow @Image1 for Benediktiner Weissbier 500ml.

0–4s: Extreme close-up on an open book. Warm golden reading lamp illuminates the pages. A finger traces a line of text, then turns the page slowly.

4–8s: Camera slowly pulls back. Reveals a tall Weizen glass of naturally cloudy golden-amber Benediktiner Weissbier with thick white foam beside the book on a dark wood side table. The glass catches warm lamplight. A leather bookmark slides into the book.

8–12s: Medium shot. Hand closes the book gently, picks up the beer glass. Takes a slow sip. Sets it back down beside the closed book. Still life: book, beer, warm light. Perfect quiet moment.

Style: Literary aesthetic, warm intimate, ASMR quiet. Kodak Portra tones.`,
    audioHint: 'Trang sách lật, sách gấp, ly nâng, bia nhấp, đặt ly xuống. Pure silence.',
    brandNotes: ['Weissbier + sách = intellectual, cultured positioning', 'Bia: cloudy golden-amber, white foam', 'KHÔNG phone, KHÔNG TV — analog moment'],
    tips: ['Bookstagram crossover audience = high save', 'Post Chủ nhật tối', 'Hashtag: #BiaVaSach #QuietEvening'],
  },
  {
    id: 'aw-06',
    name: 'Mưa Saigon — Window Beer',
    description: 'Mưa Sài Gòn chiều, ngồi trong nhà nhìn ra, ly Weissbier phản chiếu giọt mưa trên kính. Mood tuyệt đẹp.',
    storyboard: '🎬 Kịch bản:\n• Cửa kính, giọt mưa chảy dọc xuống\n• Camera focus từ giọt mưa → shift focus sang ly bia phía trong\n• Ly Weissbier vàng amber, bọt kem, cạnh cửa sổ\n• Tay nâng ly, ánh mưa chạy qua thành ly\n• Wide: người ngồi cạnh cửa, mưa ngoài, bia trong\n\n💡 "Mưa Sài Gòn. Ly bia lúa mì. Hoàn hảo."',
    pageId: 'after-work', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'IG/FB Reels — mood content, rainy day aesthetic', product: 'Benediktiner Weissbier',
    prompt: `Cinematic close-up, static camera with rack focus. Rain droplets streaming down a glass window. Focus racks from the rain-streaked glass to a tall Weizen glass of naturally cloudy golden-amber Benediktiner Weissbier with thick white foam, positioned on the windowsill inside. The beer's amber glow reflects in the rain streaks. A hand gently picks up the glass. Camera pulls back slightly revealing a person sitting beside the window, looking out at Saigon rain. Moody, peaceful, contemplative atmosphere. Diffused gray daylight from outside mixing with warm interior lamp. Shot on 85mm, f/1.4 for extreme shallow DOF. SFX: rain hitting window, distant thunder rumble, cozy indoor quiet. (no subtitles)`,
    audioHint: 'Mưa rơi trên kính, sấm xa xa, yên tĩnh bên trong.',
    brandNotes: ['Rack focus: rain → beer = cinematic technique', 'Weissbier amber glow qua giọt mưa = visual poetry', 'Saigon rain = localized content'],
    tips: ['Rainy content performs 2x trên mùa mưa SG', 'Post khi trời mưa thật = real-time relevance', 'Caption: "Mưa Sài Gòn. Ly bia lúa mì. Hoàn hảo."'],
  },

  // ╔═══════════════════════════════════════════╗
  // ║  PAGE 3: BỮA TỐI / FOOD PAIRING (7)      ║
  // ╚═══════════════════════════════════════════╝

  {
    id: 'bt-01',
    name: 'Weissbier × Phở — Giao Thoa Đức-Việt',
    description: 'Phở Việt gặp bia lúa mì Đức. Hương chuối, đinh hương complement nước dùng xương.',
    storyboard: '🎬 Kịch bản:\n• Tô phở bốc khói, rau thơm, chanh, giá đỗ\n• Bên cạnh: chai Weissbier + ly Weizen amber đục\n• Camera overhead → 45° — chiều sâu cả hai\n• Hơi nóng phở bay lên, đan xen ánh bia vàng\n• Tay gắp phở, tay kia nâng ly\n\n💡 "Phở × Weissbier — bất ngờ nhưng đúng."',
    pageId: 'bua-toi', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '1:1',
    purpose: 'Facebook Feed — food pairing education', product: 'Benediktiner Weissbier',
    prompt: `Overhead cinematic shot transitioning to 45°. Dark moody wood table #2C1810. Steaming Vietnamese phở with fresh herbs, lime, bean sprouts beside Benediktiner Weissbier 500ml dark brown bottle + filled tall Weizen glass with cloudy golden-amber beer, thick white foam. Steam wisps catch directional window light from left, interweaving with golden beer tones. 70mm macro, f/2.8. Warm earth tones. SFX: simmering broth, steam, kitchen warmth. (no subtitles)`,
    audioHint: 'Nước phở sôi nhẹ, hơi nóng, bàn ăn ấm cúng.',
    brandNotes: ['Weissbier pair Phở: banana/clove complement broth', 'Cloudy amber, WHITE foam', 'KHÔNG Pils cho phở'],
    tips: ['Steam + beer = visual storytelling', 'Caption education: vì sao Weissbier hợp phở', '1:1 cho Feed, crop 9:16 cho Reels'],
  },
  {
    id: 'bt-02',
    name: 'Dunkel × Steak — Đồng Điệu Vị Nặng',
    description: 'Steak medium-rare gặp Dunkel: malt rang, caramel match thịt nướng. Cùng gam nâu hòa quyện.',
    storyboard: '🎬 Kịch bản:\n• Close-up steak sizzle, khói bốc\n• Tracking: reveal Dunkel + ly nâu sẫm\n• Color harmony: bia chestnut + thịt nướng\n• Cắt steak, juice chảy, nâng ly Dunkel\n• Wide: bàn tối, nến, đĩa trắng, hoàn hảo\n\n💡 "Steak cần rượu vang? Không hẳn. Thử Dunkel."',
    pageId: 'bua-toi', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'TikTok, Reels — food pairing', product: 'Benediktiner Dunkel',
    prompt: `Follow @Image1 for Benediktiner Dunkel 500ml dark brown bottle dark red-brown label.

0–4s: Extreme close-up sizzling medium-rare steak on cast iron. Smoke rises. Warm firelight from left. Dark wood background.

4–9s: Tracking right revealing Dunkel bottle + Weizen glass with chestnut-brown cloudy beer, tan foam. Color harmony: beer dark amber = meat charred tones. Condensation catches firelight.

9–13s: Medium shot. Knife cuts steak — pink juice flows. Other hand picks up Dunkel glass. Dark moody editorial.

13–15s: Pull back. Table: white plate, cutlery, candle, glass, bottle. #2C1810, chestnut, amber. Hold.

Style: Cinematic food commercial, dark chiaroscuro.`,
    audioHint: 'Steak sizzle, khói, dao cắt, ly nâng. Ambient ấm.',
    brandNotes: ['Dunkel pair Steak: malt rang + caramel = red meat complement', 'Nhãn RED-BROWN', 'Bia: chestnut-brown cloudy, TAN foam'],
    tips: ['Color harmony: bia nâu + thịt nướng tự nhiên', 'Chiaroscuro: 1 nguồn warm → dramatic'],
  },
  {
    id: 'bt-03',
    name: 'Bitburger × BBQ Cuối Tuần',
    description: 'BBQ outdoor, sườn nướng, lon Bitburger ướp lạnh. Năng động nhưng premium.',
    storyboard: '🎬 Kịch bản:\n• Than hồng, sườn trên vỉ nướng\n• Xô đá: lon Bitburger emerald green\n• Lấy lon → rót vào ly Pilsner → bọt trắng mỏng\n• 3-4 ly xếp trên bàn outdoor\n• Wide: sân vườn, đèn dây, bếp nướng\n\n💡 "Bitburger Pils — đắng thanh, sạch miệng, wash down mọi vị nướng."',
    pageId: 'bua-toi', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'Reels, TikTok — BBQ weekend', product: 'Bitburger Premium Pils',
    prompt: `Follow @Image1 for Bitburger Premium Pils aluminum can emerald green gold.

0–4s: Close-up BBQ grill. Pork ribs sizzle over charcoal. Ember glow, smoke. Natural golden hour. Garden bokeh.

4–8s: Ice bucket with Bitburger emerald green cans. Hand pulls cold can, water dripping. Fairy lights background.

8–12s: Pour crystal-clear golden pilsner into Pilsner glass. Fine white foam. Camera pushes in on crisp golden liquid, tiny bubbles.

12–15s: Wide. Outdoor table: 4 Pilsner glasses, BBQ smoking, fairy lights warm bokeh. Green garden, evening. Premium relaxed.

Style: Energetic premium outdoor. Colors: #1B4332, #D4A530, amber.`,
    audioHint: 'Than cháy, thịt xèo, đá kêu, can mở, bia rót.',
    brandNotes: ['Pils pair BBQ: đắng thanh, clean finish', 'Lon emerald green, Pilsner glass (KHÔNG Weizen)', 'Crystal-CLEAR golden, FINE white foam'],
    tips: ['BBQ = high engagement', 'Post thứ 7 trưa', 'Caption: vì sao Pils hợp đồ nướng'],
  },
  {
    id: 'bt-04',
    name: 'Weissbier × Hải Sản — Seafood Night',
    description: 'Bàn seafood: tôm hùm, nghêu, cua. Weissbier thanh nhẹ cut through vị béo hải sản.',
    storyboard: '🎬 Kịch bản:\n• Đĩa hải sản hấp bốc khói — tôm, nghêu, cua\n• Camera glide: reveal chai Weissbier + ly amber đục\n• Chanh vắt lên hải sản — acid pairs với bia\n• Tay bóc tôm, nhúng nước chấm, nhấp bia\n• Still life cuối: bàn seafood + bia = coastal mood\n\n💡 "Hải sản cần gì thanh miệng? Weissbier — chua nhẹ, bọt kem, hoàn hảo."',
    pageId: 'bua-toi', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'Reels — seafood pairing, coastal vibe', product: 'Benediktiner Weissbier',
    prompt: `Cinematic close-up tracking. A platter of steamed seafood: whole prawns, clams, crab legs, lemon wedges on a rustic wooden board. Steam rising. Camera glides right revealing a Benediktiner Weissbier bottle with gold monastery label and a filled Weizen glass — cloudy golden-amber, thick white foam. A hand squeezes lemon over the seafood. Then picks up the Weizen glass for a sip. Warm coastal dining atmosphere, natural evening light mixed with warm lamp. Shot on 70mm, f/2.8. Colors: seafood pinks, lemon yellow, beer amber, dark wood. SFX: steam hiss, lemon squeeze, glass clink. (no subtitles)`,
    audioHint: 'Hơi nóng hải sản, chanh vắt, ly nâng, gió biển nhẹ.',
    brandNotes: ['Weissbier pair seafood: wheat acidity cuts fatty richness', 'Coastal mood nhưng vẫn premium', 'Cloudy amber, WHITE foam'],
    tips: ['Seafood content = seasonal summer/coastal', 'Lemon squeeze = satisfying visual hook', 'Pair: "Hải sản × Bia lúa mì — bạn thử chưa?"'],
  },
  {
    id: 'bt-05',
    name: 'Pils × Gỏi Cuốn — Light Pairing',
    description: 'Gỏi cuốn Việt Nam gặp Bitburger Pils. Clean, nhẹ, thanh. Hai thứ đều "less is more".',
    storyboard: '🎬 Kịch bản:\n• Close-up tay cuốn gỏi cuốn — tôm, bún, rau sống\n• Cuốn xong, đặt lên đĩa trắng cạnh nước chấm\n• Pan sang: ly Pilsner bia Bitburger trong vắt\n• Camera rộng: bàn trắng sáng, gỏi cuốn + bia = simplicity\n• Chấm gỏi cuốn, nhấp bia, smile\n\n💡 "Gỏi cuốn × Pilsner. Nhẹ gặp nhẹ. Tinh gặp tinh."',
    pageId: 'bua-toi', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '12s', aspect: '9:16',
    purpose: 'TikTok — light food content, Vietnamese twist', product: 'Bitburger Premium Pils',
    prompt: `0–4s: Close-up hands rolling fresh Vietnamese spring rolls — translucent rice paper wrapping around shrimp, vermicelli, herbs, lettuce. Clean bright natural lighting. White surface.

4–8s: Finished spring rolls placed on white plate beside dipping sauce. Camera pans right to reveal a filled Pilsner glass of crystal-clear golden Bitburger beer with fine white foam, an emerald green can beside it.

8–12s: Medium shot. Clean bright table: white plate with spring rolls, dipping sauce, Pilsner glass, Bitburger can. Hand dips spring roll, takes a bite, then sips beer. Minimal, clean aesthetic. Natural daylight.

Style: Clean, bright, minimal food content. White + green + golden palette.`,
    audioHint: 'Bánh tráng cuốn, đũa gắp, bia nhấp. Sáng, nhẹ.',
    brandNotes: ['Pils + gỏi cuốn = "light meets light" concept', 'Crystal-clear golden, fine foam', 'Bright setting (KHÔNG dark moody)'],
    tips: ['Vietnamese food crosses + German beer = unique content angle', 'Clean bright aesthetic cho summer content'],
  },
  {
    id: 'bt-06',
    name: 'Dunkel × Bò Kho — Comfort Food',
    description: 'Bò kho Việt Nam sánh đặc gặp Dunkel nâu ấm. Comfort food × comfort beer.',
    storyboard: '🎬 Kịch bản:\n• Nồi bò kho bốc khói — sắc nâu đỏ, cà rốt, hành tây\n• Múc ra tô — nước sánh đặc, thịt mềm\n• Cạnh tô: ly Dunkel nâu sẫm, bọt tan\n• Close-up: sắc bò kho ~= sắc Dunkel — same warm palette\n• Xé bánh mì, nhúng nước bò kho, nhấp Dunkel\n\n💡 "Bò kho cần gì? Không phải nước ngọt. Dunkel — cùng gam nâu, cùng sự ấm áp."',
    pageId: 'bua-toi', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'FB Reels — comfort food × beer, Vietnamese soul food', product: 'Benediktiner Dunkel',
    prompt: `Cinematic medium shot, slow push-in. A steaming bowl of Vietnamese bò kho beef stew — rich brown-red broth, tender beef chunks, carrots, star anise visible. Beside it on a dark wood table: a Benediktiner Dunkel bottle with dark red-brown label and a Weizen glass of chestnut-brown cloudy dark wheat beer, settled tan foam. Camera captures the visual parallel: the stew's warm brown-red and the beer's chestnut-brown share the same warm color family. A hand tears a piece of bánh mì bread, dips it in the stew, then picks up the beer glass for a sip. Warm kitchen lighting from above. Shot on 50mm, f/2.0. SFX: stew simmering, bread tearing, gentle sip. (no subtitles)`,
    audioHint: 'Bò kho sôi nhẹ, bánh mì xé, bia nhấp. Comfort sounds.',
    brandNotes: ['Dunkel + bò kho = color harmony TUYỆT VỜI (cùng warm brown)', 'Bia: chestnut-brown cloudy, tan foam', 'Star anise in bò kho echoes Dunkel spice notes'],
    tips: ['Comfort food content = relatable, high engagement mùa lạnh', 'Color parallel storytelling: bia = stew = same warmth'],
  },
  {
    id: 'bt-07',
    name: 'Pizza Night × Weissbier — Casual Premium',
    description: 'Pizza homemade, cheese kéo sợi, Weissbier bên cạnh. Casual nhưng vẫn premium — KHÔNG fast food.',
    storyboard: '🎬 Kịch bản:\n• Pizza vừa ra lò — steam, cheese bubbling\n• Cắt slice, cheese kéo sợi dài — satisfying\n• Camera: slice trên đĩa + ly Weissbier amber đục\n• Cắn pizza, nhấp bia — perfect combo\n• Wide: bàn gỗ, pizza board, 2 ly bia, couple moment\n\n💡 "Pizza tự làm. Bia tự chọn. Casual NHƯNG chuẩn."',
    pageId: 'bua-toi', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'TikTok — casual premium dining, couple content', product: 'Benediktiner Weissbier',
    prompt: `Follow @Image1 for Benediktiner Weissbier 500ml.

0–4s: Close-up fresh homemade pizza just from oven. Steam rising, cheese still bubbling. A pizza cutter slices through — melted cheese stretches satisfyingly in long strings. Warm overhead kitchen lighting.

4–9s: A slice lifted onto a white plate. Camera pulls back revealing a filled Weizen glass of cloudy golden-amber Benediktiner Weissbier with thick white foam beside the plate. Dark wood table.

9–13s: Medium shot. A person takes a bite of pizza (cheese pull visible), then picks up the Weizen glass and sips. Genuine enjoyment expression.

13–15s: Wide shot. Dark wood table, pizza board, two filled Weizen glasses, Benediktiner bottle, candle. Couple dining. Casual but premium.

Style: Casual premium dining, warm kitchen, satisfying food content.`,
    audioHint: 'Pizza cắt, cheese kéo, cắn giòn, bia nhấp. Warm ambient.',
    brandNotes: ['Weissbier + Pizza: wheat beer pairs Italian flavors well', 'Homemade pizza = premium, KHÔNG delivery box', 'Casual but elevated = key brand positioning'],
    tips: ['Cheese pull = viral hook', 'Couple content = share-worthy', 'Caption: "Pizza Night nâng cấp"'],
  },

  // ╔═══════════════════════════════════════════╗
  // ║  PAGE 4: BẠN BÈ / GATHERING (6 prompts)  ║
  // ╚═══════════════════════════════════════════╝

  {
    id: 'bb-01',
    name: 'Rooftop Toast — Nhóm Bạn',
    description: '4 người bạn rooftop hoàng hôn. Nâng ly clink — bia vàng bắt ánh nắng.',
    storyboard: '🎬 Kịch bản:\n• Rooftop, skyline Sài Gòn hoàng hôn\n• 4 bạn professional quanh bàn, Bitburger lon + Benediktiner chai\n• Nâng ly → clink! → bia bắt hoàng hôn\n• Close-up 4 ly chạm, golden glow\n• Wide: 4 người cười, skyline, warm\n\n💡 "Không cần bar sang. Cần đúng người, đúng thứ trên bàn."',
    pageId: 'ban-be', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'Reels — social gathering, community', product: 'Bitburger + Benediktiner',
    prompt: `0–4s: Wide cinematic, dolly forward. Saigon rooftop golden hour. Four Vietnamese professionals (late 20s-30s, smart casual) around table. Bitburger cans + Benediktiner bottles visible.

4–9s: Medium shot, tracking arc. Laughing naturally. One raises Pilsner glass. Others follow with Weizen glasses. Four glasses clink at center. Golden hour wraps from behind.

9–13s: Close-up clinking glasses — golden and amber beers catch sunset. Foam surfaces ripple.

13–15s: Wide establishing. Group, skyline, beer, warm light. Hold.

Style: Editorial lifestyle, authentic, golden tones.`,
    audioHint: 'Cười, ly chạm, gió rooftop, thành phố xa.',
    brandNotes: ['CẢ Bitburger + Benediktiner = portfolio diversity', 'Pilsner glass + Weizen glass', 'Nhân vật > 28 tuổi, professional'],
    tips: ['Toast = hero shot', 'Post kèm: "Cuối tuần cần gì? Đúng người. Đúng bia."'],
  },
  {
    id: 'bb-02',
    name: 'Xem Trận — Match Night Setup',
    description: 'Setup xem trận: TV, sofa, xô đá Bitburger, đồ nhắm. Chỉn chu hơn nhậu ngoài.',
    storyboard: '🎬 Kịch bản:\n• TV bật kênh bóng đá, sofa xếp gọn\n• Xô đá + lon Bitburger emerald green\n• 4 ly Pilsner rót sẵn trên khay\n• Đĩa đồ nhắm: chips, hạt, phô mai\n• 3-4 người ngồi sofa, nâng ly theo bàn thắng\n\n💡 "Host trận như host tiệc. Không cần cầu kỳ — cần chỉn chu."',
    pageId: 'ban-be', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'Reels — match day, group moment', product: 'Bitburger Premium Pils 330ml',
    prompt: `0–3s: Medium shot of a large TV screen showing a football match (blurred, no real branding). Modern living room, warm lighting.

3–7s: Camera pans down and right. Vintage metal ice bucket with Bitburger emerald green 330ml aluminum cans packed in ice. Four clean Pilsner glasses filled with crystal-clear golden beer arranged on a tray.

7–11s: Pull back. Snack spread: chips bowl, mixed nuts, cheese board. 3-4 men (late 20s-30s) on a leather sofa, focused on the match, beer in hand.

11–15s: Close-up reaction moment — they lean forward simultaneously, then cheer, raising glasses. Clink. Genuine joy. Hold on the group celebration.

Style: Authentic match night, warm interior, premium casual.`,
    audioHint: 'TV match audio muffled, cheering, glass clink, chips crunch.',
    brandNotes: ['Bitburger 330ml = match format (easy hold, not too heavy)', 'Pilsner glasses (KHÔNG chai/lon trực tiếp)', '3-4 người = manageable, KHÔNG đông ồn'],
    tips: ['Post theo lịch EPL/Champions League', 'Caption: "Xem trận chuẩn Setup"'],
  },
  {
    id: 'bb-03',
    name: 'Board Game Night — Bia & Cờ',
    description: 'Đêm board game: bàn cờ, bia, cười. Intellectual fun — không say, không ồn.',
    storyboard: '🎬 Kịch bản:\n• Overhead: bộ board game trải trên bàn gỗ\n• Chai Benediktiner + lon Bitburger xung quanh\n• Tay đặt quân cờ, tay kia cầm ly bia\n• 4 người cùng cười khi ai đó thua\n• Close-up: xúc xắc lăn cạnh ly Weissbier\n\n💡 "Game night. Bia Đức. Trí tuệ + vui vẻ."',
    pageId: 'ban-be', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'Reels — game night content, niche community', product: 'Benediktiner Weissbier + Bitburger',
    prompt: `Overhead cinematic shot, slow push in. A dark wood table with a board game spread out — colorful game pieces, cards, dice. Around the edges: Benediktiner Weissbier bottles, Bitburger cans, and filled glasses (mix of Weizen and Pilsner). Four hands visible moving game pieces and holding beer glasses. Camera transitions to medium level, showing 4 young professionals (late 20s-30s) laughing as someone makes a dramatic game move. Close-up: dice roll and land beside a Weizen glass of cloudy amber beer. Warm string lights in bokeh background. Shot on 35mm, f/2.0. SFX: dice rolling, cards shuffling, laughter, glass on wood. (no subtitles)`,
    audioHint: 'Xúc xắc lăn, bài xào, cười, ly đặt xuống bàn.',
    brandNotes: ['Board game night = intellectual social, premium positioning', 'Mix products cho variety', 'KHÔNG say, KHÔNG ồn — fun but controlled'],
    tips: ['Board game niche = high engagement in young professional audience', 'Post kèm: "Bạn bia nào trong đêm board game?"'],
  },
  {
    id: 'bb-04',
    name: 'Camping Trip — Bia Dưới Sao',
    description: 'Cắm trại: lửa trại, trời sao, lon Bitburger lạnh. Outdoor nhưng vẫn tinh tế.',
    storyboard: '🎬 Kịch bản:\n• Lửa trại cháy, than hồng rực\n• Lon Bitburger trên khúc gỗ cạnh lửa\n• Tay nhặt lon, mở — psst — rót vào cốc inox\n• Wide: 3-4 người quanh lửa, trời sao phía trên\n• Close-up: ngước lên nhìn sao, cầm cốc bia\n\n💡 "Bia Đức dưới trời sao Đà Lạt. Đôi khi luxury không cần 4 bức tường."',
    pageId: 'ban-be', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'Reels — outdoor lifestyle, camping trend', product: 'Bitburger Premium Pils',
    prompt: `0–4s: Close-up campfire crackling, orange embers glowing. A Bitburger 500ml emerald green can sits on a wooden log beside the fire, warm firelight reflecting off the aluminum surface.

4–8s: Hand picks up the can, pops tab — carbonation spray catches firelight. Pours into a stainless steel camping cup. Golden beer glows in firelight.

8–12s: Wide shot. 3-4 people sitting around the campfire on camping chairs. Star-filled sky above (dramatic Milky Way visible). Warm cozy outdoor atmosphere. Beer cans visible, cups in hand.

12–15s: Close-up over-shoulder. One person looks up at the stars, camping cup of beer in hand. Serene. Pure. Hold.

Style: Outdoor adventure, campfire warmth vs starry cool, premium camping.`,
    audioHint: 'Lửa trại, can mở, bia rót, dế kêu, gió nhẹ. Không nhạc.',
    brandNotes: ['Camping = lon (practical), KHÔNG chai', 'Cốc inox camping cup acceptable (outdoor context)', 'Star sky + firelight = epic visual contrast'],
    tips: ['Camping content = high share in adventure community', 'Post kèm location tag: Đà Lạt, Bảo Lộc, Mộc Châu'],
  },
  {
    id: 'bb-05',
    name: 'Housewarming Party — Chai Đầu Tiên',
    description: 'Dọn nhà mới, bạn bè đến, mở chai Benediktiner đầu tiên trong không gian mới.',
    storyboard: '🎬 Kịch bản:\n• Phòng mới: thùng carton còn chưa mở, nội thất mới\n• Bạn bè đến — mang theo thùng Benediktiner Mix\n• Đặt lên bàn mới, mở nắp chai đầu tiên\n• Rót bia vào ly mới coong — first drink trong nhà mới\n• Toast: "Chúc mừng nhà mới!"\n\n💡 "Ngôi nhà bắt đầu bằng chai bia đầu tiên mở cùng bạn."',
    pageId: 'ban-be', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'Reels — housewarming, milestone moment', product: 'Benediktiner Mix 12 chai',
    prompt: `Cinematic medium shot, warm interior. A new apartment with some moving boxes still visible, fresh furniture. Friends (late 20s-30s, casual) arrive carrying a Benediktiner Mix box (12 bottles). They place it on a new dining table. Someone opens the first bottle — a Benediktiner Weissbier with gold label. Pours into a brand new Weizen glass. Others grab different bottles (Weissbier gold label, Dunkel red-brown label). Everyone raises glasses for a toast. Natural warm afternoon light through large windows. New home feeling — fresh, clean, hopeful. Shot on 35mm, f/2.0. SFX: bottle opening, pouring, excited chatter, glass clink, "Chúc mừng!" spoken softly. (no subtitles)`,
    audioHint: 'Chai mở, bia rót, chúc mừng nho nhỏ, ly chạm.',
    brandNotes: ['Mix 12 chai = perfect housewarming gift positioning', 'Cả Weissbier + Dunkel trong box', 'Milestone moment = emotional brand connection'],
    tips: ['Housewarming = relatable milestone', 'CTA: "Tặng nhà mới — inbox đặt Mix 12 chai"'],
  },
  {
    id: 'bb-06',
    name: 'Sinh Nhật Tối Giản — 30th Birthday',
    description: 'Sinh nhật 30: không club, không party to. 5-6 bạn thân, bàn bia Đức, bánh nhỏ, nến.',
    storyboard: '🎬 Kịch bản:\n• Phòng ấm, bàn trang trí tối giản: nến, hoa nhỏ\n• Bánh sinh nhật nhỏ với số 30\n• Benediktiner + Bitburger trên bàn, ly đã rót\n• Bạn bè nâng ly toast: "Chúc mừng 30!"\n• Birthday person thổi nến, mọi người cười, clink bia\n\n💡 "30 tuổi. Không cần club. Cần đúng 5 người và thứ đúng trên bàn."',
    pageId: 'ban-be', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'Reels — birthday content, milestone celebration', product: 'Benediktiner + Bitburger',
    prompt: `0–3s: Medium shot. Warmly lit room, minimal birthday setup: small cake with "30" candle, small flower arrangement, string lights. Dark wood table.

3–7s: Camera reveals table spread: Benediktiner Weissbier bottles (gold label), Bitburger cans (emerald green), mixed Weizen and Pilsner glasses filled. 5-6 people (early 30s) seated around.

7–11s: Close-up on candle being blown out. Cheering. Everyone raises different glasses. Slow-motion clink at center of table. Warm golden light catches beer.

11–15s: Pull back. Group laughing, celebrating. Intimate, warm, premium milestone moment. Not a club. Not a bar. Just right. Hold for text.

Style: Intimate celebration, warm, authentic joy. String lights bokeh.`,
    audioHint: 'Nến thổi, reo hò nhẹ, glass clink, cười ấm.',
    brandNotes: ['Birthday 30+ = target demographic positioning', 'KHÔNG club/bar ồn ào', 'Mix products = portfolio showcase'],
    tips: ['Birthday content = high tag/share', '"30" = relatable age for target audience', 'CTA: "Cùng lên plan sinh nhật kiểu mới"'],
  },

  // ╔═══════════════════════════════════════════╗
  // ║  PAGE 5: QUÀ BIẾU / GIFT (6 prompts)     ║
  // ╚═══════════════════════════════════════════╝

  {
    id: 'qb-01',
    name: 'Unboxing Thùng Benediktiner Mix',
    description: 'Unboxing: hộp kraft, ribbon vàng, 12 chai Weissbier + Dunkel + bộ cốc chính hãng.',
    storyboard: '🎬 Kịch bản:\n• Hộp kraft trên marble, ribbon vàng\n• Kéo ribbon — bung ra\n• Mở nắp: 12 chai xếp trong rơm\n• Close-up nhãn gold + nhãn red-brown\n• Bộ 6 cốc Weizen chính hãng, logo rõ\n\n💡 "Tặng bia Đức chính hãng — lịch sự, khác biệt."',
    pageId: 'qua-bieu', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'TikTok — unboxing, gift recommendation', product: 'Thùng Mix 12 chai + Bộ cốc',
    prompt: `0–3s: Kraft gift box on dark marble #1A1A1A. Golden satin ribbon bow. Soft studio lighting.

3–7s: POV hands pull ribbon. Lid lifts revealing 12 Benediktiner bottles in straw: six gold label (Weissbier), six dark red-brown label (Dunkel).

7–11s: Hand picks up Weissbier bottle showing gold monastery label detail. Then Dunkel bottle — contrasting label colors. Both 500ml dark brown glass, metal crown caps.

11–15s: Full reveal: 12 bottles + 6 branded Weizen glasses with etched logo beside box. Premium gift. Golden ribbon, marble. Hold.

Style: Premium unboxing, clean lighting. Colors: #1A1A1A, #D4A530, cream.`,
    audioHint: 'Ribbon kéo, nắp mở, chai chạm rơm, ly đặt. ASMR.',
    brandNotes: ['Mix: 6 Weissbier (GOLD) + 6 Dunkel (RED-BROWN)', 'Chai 500ml dark brown, metal crown cap KHÔNG nắp bần', 'Giá: ~1.092.000đ'],
    tips: ['Unboxing = high save/share TikTok', 'Dùng trước Tết, 20/10, sinh nhật'],
  },
  {
    id: 'qb-02',
    name: 'Quà Tết — Gold & Red',
    description: 'Set quà Tết: bia Benediktiner + mai vàng + lì xì + ribbon đỏ. Giao thoa Đức-Việt qua sắc đỏ-vàng.',
    storyboard: '🎬 Kịch bản:\n• Bàn gỗ lacquer đỏ, mai vàng cắm trong bình\n• Hộp quà: chai Benediktiner xếp trong hộp đen matte\n• Lì xì vàng đỏ xung quanh\n• Tay mở hộp — reveal chai bia + cốc branded\n• Wide: bàn Tết hoàn chỉnh với bia Đức\n\n💡 "Quà Tết không cần rượu. Bia Đức chính hãng — sang, khác biệt, thực dụng."',
    pageId: 'qua-bieu', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'Reels — Tết gift content, seasonal campaign', product: 'Set quà Benediktiner',
    prompt: `Follow @Image1 for Benediktiner Weissbier bottles.

0–4s: Overhead. Traditional Vietnamese Tết table: red lacquer tray, mai blossom branch with bright yellow flowers, gold and red lucky money envelopes, red silk ribbons.

4–9s: Close-up tracking. A matte black gift box opens revealing Benediktiner bottles (gold label + dark red-brown label) nestled in gold tissue paper. Branded Weizen glasses packed beside.

9–13s: Medium shot. Hands arrange the gift set on the Tết table. The gold monastery labels harmonize with the gold lucky money envelopes. Red ribbon ties everything together.

13–15s: Wide overhead. Complete Tết gift display: beer, glasses, mai blossoms, lucky money, candles. Red + gold + dark amber. Hold for text.

Style: Festive premium, Lunar New Year, red-gold color harmony.`,
    audioHint: 'Hộp mở, giấy tissue xào, chai xếp, nhạc Tết nhẹ.',
    brandNotes: ['Red + Gold Tết = Gold beer labels = natural harmony', 'Matte black box = premium packaging', 'Post 2-3 tuần trước Tết'],
    tips: ['Tết gift content = HIGHEST conversion season', 'CTA: "Nhắn TẾT để nhận bảng giá set quà"'],
  },
  {
    id: 'qb-03',
    name: 'Quà Sếp — Corporate Gift',
    description: 'Tặng sếp/đối tác: hộp sang, card viết tay, set Benediktiner. Chuyên nghiệp, ấn tượng.',
    storyboard: '🎬 Kịch bản:\n• Hộp đen matte với khắc chữ gold\n• Mở: 4 chai Benediktiner + 2 cốc chính hãng\n• Card viết tay: "Cảm ơn anh/chị" → gài vào\n• Close-up nhãn tu viện — vàng, sang trọng\n• Hộp đóng lại, ribbon buộc — ready to gift\n\n💡 "Quà cho sếp: không nên bia đại trà, không nên rượu khó uống."',
    pageId: 'qua-bieu', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'Reels — corporate gift guide', product: 'Set quà Benediktiner',
    prompt: `Cinematic close-up, slow tracking. A matte black premium gift box with subtle gold embossing. Hands open the lid revealing 4 Benediktiner Weissbier 500ml bottles (gold monastery labels) and 2 branded Weizen glasses, packed in black silk lining. A hand places a handwritten thank-you card on top. Close-up on the gold monastery label detail — ornate, prestigious. The box closes. A gold ribbon is tied in a perfect bow. Final shot: the complete closed gift box, ribbon tied, ready to gift. Clean dark background, soft studio lighting. Shot on 85mm, f/2.8. SFX: box opening, silk rustling, card placing, ribbon tying. (no subtitles)`,
    audioHint: 'Hộp mở, lụa xào, card đặt, ribbon buộc. Premium ASMR.',
    brandNotes: ['Corporate gift = premium black packaging', 'Gold monastery label = prestigious look', 'Handwritten card = personal touch'],
    tips: ['Corporate gift content = B2B marketing', 'Target: HR managers, executive assistants', 'CTA: "Inbox QUÀ SẾP để nhận báo giá set"'],
  },
  {
    id: 'qb-04',
    name: 'Quà 20/10 — For Her',
    description: 'Quà cho crush/vợ: set bia Đức + hoa + chocolate. Khác biệt hoàn toàn vs hoa hồng đại trà.',
    storyboard: '🎬 Kịch bản:\n• Bó hoa nhỏ thanh lịch (không hồng đỏ quá khổ)\n• Bên cạnh: hộp 6 chai Benediktiner + chocolate Đức\n• Card: "Happy 20/10" + thẻ tasting note\n• Close-up: chai bia cạnh hoa — unexpected but classy\n• Tay nữ mở hộp — surprised smile\n\n💡 "Ai nói phụ nữ không uống bia? Tặng bia Đức — cô ấy sẽ nhớ."',
    pageId: 'qua-bieu', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '12s', aspect: '9:16',
    purpose: 'Reels — gift for women, 20/10 campaign', product: 'Benediktiner Set + Chocolate',
    prompt: `0–3s: Elegant small flower bouquet (not giant red roses — think dried flowers or pastel arrangement) on a clean white surface. Beside it: a gift box.

3–7s: Hands open the gift box. Inside: 6 Benediktiner Weissbier 500ml bottles (gold labels), premium German chocolates, and a small card with tasting notes.

7–10s: Close-up: a Benediktiner bottle beside the flowers. The unexpected yet elegant pairing. Gold label catches soft light.

10–12s: Over shoulder: a woman (early 30s, stylish) opens the gift. Her expression shifts from curiosity to genuine surprised smile. She picks up a bottle, reads the label, impressed.

Style: Elegant, unexpected, sophisticated. Soft natural lighting.`,
    audioHint: 'Hộp mở, giấy xào, reaction vui, chai nâng lên.',
    brandNotes: ['KHÔNG hoa hồng đỏ khổ lớn — elegant small arrangement', 'Tasting note card = educational touch', 'Target: quà tặng khác biệt cho phụ nữ hiện đại'],
    tips: ['Post 1-2 tuần trước 20/10', 'Unexpected gift angle = higher engagement', 'CTA: "Set 20/10 — inbox QUÀ CÔ ẤY"'],
  },
  {
    id: 'qb-05',
    name: 'Bom 5L — Set "WOW"',
    description: 'Set quà bom 5L Benediktiner + cốc kim loại. Size ấn tượng, wow-factor cực cao.',
    storyboard: '🎬 Kịch bản:\n• Bom 5L Benediktiner đặt giữa bàn — size impressive\n• Camera orbit quanh bom — nhãn tu viện chi tiết\n• Mở vòi bom — bia chảy ra vào ly lớn\n• Bọt kem tràn — impressive pour\n• Wide: bom + 4 cốc + "WOW" reaction\n\n💡 "5 lít bia tu viện. Đủ gây ấn tượng cho bất kỳ ai."',
    pageId: 'qua-bieu', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'TikTok — wow factor gift, viral potential', product: 'Bom 5L Benediktiner',
    prompt: `Follow @Image1 for Benediktiner 5L mini keg.

0–4s: Medium shot. A Benediktiner 5L mini keg (barrel shaped, gold monastery label) placed on dark wood table. Camera slowly orbits around it showing the impressive size and ornate label detail. Warm side lighting.

4–9s: Close-up on the tap. A hand pulls the tap lever. Naturally cloudy golden-amber Weissbier flows into a large Weizen glass. Thick creamy white foam builds dramatically. The pour is impressively smooth.

9–13s: Glass filled to overflowing — foam cascading slightly over the rim. Camera captures the wow-moment.

13–15s: Pull back. The 5L keg alongside 4 filled glasses. A reaction: someone picks up a glass, genuinely impressed. Hold for text and price.

Style: Impressive product showcase, warm lighting, wow-factor.`,
    audioHint: 'Vòi bom mở, bia chảy mạnh, bọt bung, "wow" reaction.',
    brandNotes: ['Bom 5L = barrel shape, gold monastery label', 'Has own tap mechanism', 'Bia: cloudy golden-amber, THICK white foam', 'Giá: premium tier'],
    tips: ['5L keg = instant wow factor, viral potential', 'Works for housewarming, birthday, Tết', 'CTA: "Inbox BOM để đặt set gây ấn tượng"'],
  },
  {
    id: 'qb-06',
    name: 'Thank You Gift — Cảm Ơn Bằng Bia',
    description: 'Gửi quà cảm ơn: thùng bia giao tận nhà, người nhận mở cửa nhận với nụ cười.',
    storyboard: '🎬 Kịch bản:\n• Chuông cửa reo\n• Mở cửa: shipper đưa thùng kraft với ribbon gold\n• Close-up card: "Cảm ơn đã giúp đỡ — [tên người gửi]"\n• Mở thùng trên bàn: 12 chai Benediktiner + cốc\n• Smile, cầm chai lên, gật đầu — touched\n\n💡 "Cảm ơn bằng bia Đức. Thiết thực. Sang. Và người nhận thật sự dùng được."',
    pageId: 'qua-bieu', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'Reels — thank you gift, delivery experience', product: 'Thùng 12 chai Benediktiner',
    prompt: `Cinematic tracking, warm natural daylight. Doorbell rings. A person (male, 30s) opens their apartment door. A delivery person hands over a kraft gift box with gold ribbon. Close-up on a thank-you card attached: handwritten message visible. The recipient sits at a table, opens the box. Inside: 12 Benediktiner bottles (gold + red-brown labels) with 2 Weizen glasses. He picks up a bottle, reads the label, touched by the thoughtful gift. Genuine grateful smile. Natural afternoon light. Shot on 35mm, f/2.0. SFX: doorbell, door opening, box opening, paper rustling, soft grateful sigh. (no subtitles)`,
    audioHint: 'Chuông cửa, mở cửa, hộp mở, card đọc, thở nhẹ cảm ơn.',
    brandNotes: ['Delivery experience = modern gifting', 'Handwritten card = personal touch critical', 'Reaction = genuine, not exaggerated'],
    tips: ['Thank you context = year-round relevance', 'Delivery branding = service positioning', 'CTA: "Gửi quà cảm ơn — freeship nội thành"'],
  },

  // ╔═══════════════════════════════════════════╗
  // ║  PAGE 6: THƯƠNG HIỆU / HERITAGE (6)      ║
  // ╚═══════════════════════════════════════════╝

  {
    id: 'th-01',
    name: 'Tu Viện Ettal — Khởi Nguồn 400 Năm',
    description: 'Bình minh qua vòm đá tu viện cổ, thùng gỗ sồi, chai bia trong ánh sáng vàng thần thánh.',
    storyboard: '🎬 Kịch bản:\n• Bình minh. Vòm đá tu viện. Tia sáng vàng xuyên qua\n• Hạt bụi lơ lửng — không gian linh thiêng\n• Camera tiến vào hầm bia\n• Thùng gỗ sồi. Chai Benediktiner trên thùng\n• Ánh sáng vàng ôm chai — hào quang\n\n💡 "400 năm. Men sống. Không lọc. Đây là di sản."',
    pageId: 'thuong-hieu', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '16:9',
    purpose: 'Brand video, About page', product: 'Benediktiner (thương hiệu)',
    prompt: `Wide cinematic, slow drone push forward. Medieval Bavarian monastery (Kloster Ettal) at dawn. Golden light through arched stone windows into brewery cellar. Dust particles in light beams. Oak barrels stacked. Single Benediktiner Weissbier 500ml bottle on oak barrel catches golden light, halo effect. Alpine valley mist through distant window. 24mm, f/8. Spiritual, timeless. Text space top for tagline. Ambient: monastery echoes, church bells, Alpine wind. (no subtitles)`,
    audioHint: 'Vọng tu viện, chuông nhà thờ xa, gió Alpine.',
    brandNotes: ['"Dem Himmel so nah" = "Gần hơn với thiên đường"', 'Kloster Ettal = tu viện thật, Bavaria, 400+ năm', 'Volumetric light = spiritual mood'],
    tips: ['Dùng cho About page, brand intro YouTube', 'Ghép nhiều shots heritage → brand film 60s'],
  },
  {
    id: 'th-02',
    name: 'Reinheitsgebot — 4 Nguyên Liệu Tinh Khiết',
    description: 'Luật Tinh khiết Đức 1516: 4 nguyên liệu — lúa mạch, hoa bia, nước nguồn, men.',
    storyboard: '🎬 Kịch bản:\n• Bàn gỗ cổ, ánh Phục Hưng\n• Camera glide: ① Lúa mạch vàng ② Hoa bia xanh ③ Nước nguồn ④ Men trong bát\n• Cuộn giấy cổ Đức phía dưới\n• Dừng: 4 nguyên liệu + ánh vàng = tinh khiết\n\n💡 "Bia Đức ngon vì luật cấm bỏ gì? Mọi thứ trừ 4 thứ này."',
    pageId: 'thuong-hieu', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '16:9',
    purpose: 'Education, brand heritage', product: 'Tất cả (Reinheitsgebot)',
    prompt: `Cinematic macro, slow dolly left to right. Aged wood surface: golden barley grains, fresh green hop flowers, crystal-clear water pitcher refracting light, fresh yeast in ceramic bowl. Camera glides across each, pausing briefly. Renaissance chiaroscuro lighting, golden from upper left. Vintage German parchment underneath. 100mm macro, f/4. Reverent, pure. SFX: grain shifting, water rippling, quiet reverence. (no subtitles)`,
    audioHint: 'Lúa mạch xào xạc, nước gợn, tĩnh lặng tôn kính.',
    brandNotes: ['Reinheitsgebot 1516 = 4 nguyên liệu only', 'Renaissance painting aesthetic', 'Parchment scroll = heritage trust symbol'],
    tips: ['Education HIGH save rate', 'Series: "Bạn biết gì về bia Đức?"', 'Text overlay: tên 4 nguyên liệu Đức + Việt'],
  },
  {
    id: 'th-03',
    name: 'Bản Đồ Bavaria — Germany to Vietnam',
    description: 'Animation journey: Bavaria → cảng Hamburg → tàu → cảng Việt Nam → bàn ăn. Hành trình chai bia.',
    storyboard: '🎬 Kịch bản:\n• Map Bavaria highlight → Kloster Ettal pin\n• Tracking theo con đường: tu viện → nhà máy\n• Xe tải → cảng Hamburg → container ship\n• Tàu qua Ấn Độ Dương → cảng TP HCM\n• Final: chai Benediktiner trên bàn ăn Việt Nam\n\n💡 "Từ tu viện Bavaria đến bàn ăn của bạn — hành trình 10.000km."',
    pageId: 'thuong-hieu', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'Brand awareness, origin story', product: 'Benediktiner (thương hiệu)',
    prompt: `0–3s: Aerial shot of a picturesque Bavarian Alps landscape, green valleys, a medieval monastery visible. A golden pin marker appears on the monastery.

3–7s: Tracking shot. Bottles moving along a production line at a traditional brewery. Then loading onto a truck. Truck drives through German countryside.

7–11s: Cinematic wide shot of a container ship crossing deep blue ocean. Dramatic sky, vast sea. The journey motif.

11–15s: Cut to a warm Vietnamese dining table. A hand places a Benediktiner Weissbier bottle (gold label) on a dark wood table beside a filled Weizen glass. From Bavaria to Vietnam. 10,000km. The full journey complete. Hold.

Style: Journey narrative, geographic storytelling, warm conclusion.`,
    audioHint: 'Chuông Alpine, engine hum, ocean waves, cuối cùng: bia rót tại VN.',
    brandNotes: ['10,000km journey = authenticity messaging', 'Bavaria real landscapes', 'KHÔNG nói "nhập khẩu" — nói "hành trình"'],
    tips: ['Origin story = trust building content', 'Dùng cho FB Video quy mô lớn', 'Subtitle VN cho education'],
  },
  {
    id: 'th-04',
    name: 'Men Sống — Living Yeast Closeup',
    description: 'Macro cực gần: men bia sống hoạt động trong liquid. Khoa học + nghệ thuật = bia tươi KHÔNG lọc.',
    storyboard: '🎬 Kịch bản:\n• Extreme macro: bong bóng CO2 nổi trong bia\n• Camera zoom sâu hơn: men bia trôi lơ lửng\n• Ánh sáng vàng xuyên qua liquid amber\n• Pull back: men này tạo nên vị đặc trưng\n• Final: chai Benediktiner — "Naturtrüb = Không lọc"\n\n💡 "Men sống. Không lọc. Mỗi chai là một hệ sinh thái nhỏ."',
    pageId: 'thuong-hieu', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'Education, differentiation messaging', product: 'Benediktiner Weissbier Naturtrüb',
    prompt: `Extreme macro cinematography, static then slow push-in. Golden-amber liquid fills the frame — naturally cloudy Benediktiner Weissbier viewed through dramatic backlight. Individual carbonation bubbles rising, yeast particles suspended, creating a living galaxy effect. The light refracts through the cloudy beer creating warm amber nebula patterns. Camera pushes in further — the micro-world of living yeast visible. Pull back slowly revealing this is inside a tall Weizen glass. The Benediktiner bottle with gold monastery label beside it. Text space for "Naturtrüb — Không lọc, giữ trọn men sống." Shot on 100mm macro, f/2.8. SFX: deep ambient hum, subtle carbonation fizz, science-documentary feel. (no subtitles)`,
    audioHint: 'Hum sâu ambient, fizz nhẹ CO2, feel khoa học.',
    brandNotes: ['Naturtrüb = naturally cloudy = KHÔNG LỌC', 'Men sống = key differentiator vs bia công nghiệp', 'Macro beer = unique content angle'],
    tips: ['Science-art hybrid content = niche viral', '"Naturtrüb" trên nhãn = proof point', 'Caption: "Bạn đang uống 1 hệ sinh thái sống."'],
  },
  {
    id: 'th-05',
    name: 'Bitte Ein Bit — Tagline Story',
    description: 'Câu chuyện đằng sau "Bitte ein Bit" — câu nói quen thuộc nhất nước Đức khi gọi bia.',
    storyboard: '🎬 Kịch bản:\n• Quầy bar Đức truyền thống, gỗ cổ, đèn amber\n• Khách ngồi xuống, nói: "Bitte ein Bit"\n• Bartender gật, rót Bitburger từ vòi vào ly Pilsner\n• Crystal-clear golden, bọt trắng hoàn hảo\n• Đặt ly trước khách — smile + nod\n\n💡 "\'Bitte ein Bit\' — Xin một Bitburger. 3 từ. Đủ rồi."',
    pageId: 'thuong-hieu', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '16:9',
    purpose: 'Brand story, tagline video', product: 'Bitburger Premium Pils',
    prompt: `Cinematic medium shot, warm amber interior. A traditional German beer hall bar counter — dark wood, brass fixtures, warm overhead lights. A customer (male, 40s, casual European style) sits down at the counter. He says softly "Bitte ein Bit" with a subtle smile. The bartender nods knowingly, pulls a Bitburger tap handle. Crystal-clear golden pilsner pours into a branded Pilsner glass — fine white foam cap forms perfectly. The bartender places the glass on a branded Bitburger coaster before the customer. Customer nods appreciatively, takes a sip. Shot on 50mm, f/1.8. Warm tavern lighting. SFX: bar ambiance, "Bitte ein Bit" spoken, tap pulling, beer pouring, glass set down. (no subtitles)`,
    audioHint: '"Bitte ein Bit" thì thầm, vòi rót, ly đặt, bar ambient.',
    brandNotes: ['"Bitte ein Bit" = iconic German tagline', 'Draft pour = bar context', 'Crystal-clear golden, fine WHITE foam cap', 'German bar aesthetic, NOT Vietnamese'],
    tips: ['Tagline story = brand culture content', 'Subtitle VN: "Xin một Bitburger. 3 từ. Đủ rồi."', 'Dùng cho brand awareness campaign'],
  },
  {
    id: 'th-06',
    name: 'Tay Thợ Bia — Craftsmanship',
    description: 'Close-up tay thợ bia: kiểm tra lúa mạch, khuấy nồi đồng, nếm bia thử. Con người tạo nên di sản.',
    storyboard: '🎬 Kịch bản:\n• Tay thợ bia cầm nắm lúa mạch vàng\n• Bỏ vào nồi đồng — khuấy chậm, hơi nóng bốc\n• Nghiêng muỗng đồng kiểm tra liquid amber\n• Nếm thử — gật đầu hài lòng\n• Pull back: hầm bia cổ, thùng gỗ, ánh vàng\n\n💡 "400 năm công thức. Vẫn có đôi tay kiểm tra từng mẻ bia."',
    pageId: 'thuong-hieu', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '16:9',
    purpose: 'Brand story, craftsmanship', product: 'Benediktiner (thương hiệu)',
    prompt: `0–5s: Extreme close-up. Weathered brewmaster's hands examining golden barley grains. Individual grains visible. Warm golden side lighting.

5–10s: Medium shot. Brewmaster lifts copper ladle from brewing kettle, steam rising. Amber light off copper. Slow circular camera.

10–15s: Wide. Traditional brewery interior — copper kettles, oak barrels. Brewmaster walks through, silhouette against golden backlight. Text space.

Style: Documentary, craftsmanship, human touch. Kodak grain, warm grade.`,
    audioHint: 'Hạt xào xạc, liquid bubbling, bước chân trên đá.',
    brandNotes: ['Close-up hands = trust, human connection', 'Copper + amber + golden = warm brand palette', 'Multi-shot: ghép 3 clips → brand video 45s'],
    tips: ['Craftsman content = high trust', 'Pair: "Đằng sau mỗi chai bia — đôi tay của người thợ."'],
  },

  // ╔═══════════════════════════════════════════╗
  // ║  PAGE 7: SẢN PHẨM / HERO SHOT (6)        ║
  // ╚═══════════════════════════════════════════╝

  {
    id: 'sp-01',
    name: 'Bitburger — Hero Splash Ad',
    description: 'Lon Bitburger giữa splash vàng, giọt đông cứng mid-air. CGI quality quảng cáo.',
    storyboard: '🎬 Kịch bản:\n• Nền navy gradient gold\n• Lon emerald green nghiêng dynamic\n• Splash vàng bay phía sau, giọt frozen mid-air\n• Camera dolly-in → splash lắng → phản chiếu\n• Space: "Bitte ein Bit"\n\n💡 "Germany\'s #1 draft beer."',
    pageId: 'san-pham', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '16:9',
    purpose: 'Facebook Ads, YouTube Pre-roll', product: 'Bitburger Premium Pils',
    prompt: `Dramatic low-angle, slow dolly-in. Bitburger 500ml aluminum can emerald green gold "Bitte ein Bit" at dynamic angle. Golden beer splash arc behind, individual droplets frozen mid-air. Navy #1A365D gradient, subtle gold particles. Can branding razor-sharp, condensation droplets. Splash settles into reflective pool below. Hasselblad X2D, 90mm, f/8. Text space bottom. SFX: dramatic whoosh, splash settling, bass impact, reverb. (no subtitles)`,
    audioHint: 'Whoosh, splash, bass impact, epic reverb silence.',
    brandNotes: ['Lon emerald green + gold, sharp branding', 'NavY #1A365D background', 'Text overlay trong post-production', 'KHÔNG người — pure product'],
    tips: ['CGI-quality → paid ads', 'Export 16:9 + 9:16', 'Chừa text cho tagline'],
  },
  {
    id: 'sp-02',
    name: 'Benediktiner — Ánh Sáng Thiên Đường',
    description: 'Chai Benediktiner từ ánh sáng vàng xuyên mây — "Dem Himmel so nah".',
    storyboard: '🎬 Kịch bản:\n• Màn đen, fade in\n• Tia vàng volumetric xuyên mây đen\n• Tilt xuống theo ánh sáng\n• Chạm chai → hào quang gold\n• Ly Weizen: bia đang đầy, bọt tràn\n• Hold: chai + ly + light\n\n💡 "Dem Himmel so nah — Gần hơn với thiên đường."',
    pageId: 'san-pham', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '16:9',
    purpose: 'Brand hero ad, tagline video', product: 'Benediktiner Weissbier',
    prompt: `Follow @Image1 for Benediktiner Weissbier 500ml.

0–4s: Black screen. Volumetric golden light rays break through dark clouds. Camera tilts down following divine light. Heavenly.

4–9s: Light reveals Benediktiner Weissbier 500ml on dark surface. Rays create golden halo. Weizen glass fills with cloudy amber beer, white foam overflows, catching divine light. Dolly-in.

9–13s: Full reveal — bottle + glass in ethereal golden light. Black → warm gold gradient. Foam settles. Light pulses.

13–15s: Static hold. Text space for tagline. Heavenly silence. Gentle pulse.

Style: Ethereal, heavenly, volumetric. Colors: black → warm gold.`,
    audioHint: 'Ambient pad, choir hum nhẹ, ethereal light.',
    brandNotes: ['Tagline: "Dem Himmel so nah" / "Gần hơn với thiên đường"', 'Volumetric light + halo = monastery metaphor', 'Spiritual mood, NOT flashy commercial'],
    tips: ['Upload pack shot @Image1 → accuracy 95%+', 'Volumetric light = visual signature Benediktiner'],
  },
  {
    id: 'sp-03',
    name: 'Perfect Pour — ASMR Hero',
    description: 'Macro pour shot: bia chảy vào ly, từng bong bóng rõ nét, bọt dâng. Pure sensory.',
    storyboard: '🎬 Kịch bản:\n• Ly Weizen trống, macro cực gần rim ly\n• Bia bắt đầu chảy vào — golden-amber cascade\n• Từng bong bóng CO2 nổi lên rõ nét\n• Bọt kem trắng dàn lên — foam head building\n• Pull back: ly hoàn hảo, dark background\n\n💡 "The perfect pour. Không cần nói thêm gì."',
    pageId: 'san-pham', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'TikTok ASMR, Reels — sensory content hero', product: 'Benediktiner Weissbier',
    prompt: `Follow @Image1 for Benediktiner Weissbier.

0–4s: Extreme macro on empty Weizen glass rim. Hand tilts Benediktiner bottle 45°. Beer begins cascading — golden-amber cloudy, individual bubbles visible. Dramatic backlit rim light.

4–10s: Push-in as foam builds. Thick creamy white foam rises above rim. Camera follows foam upward. Each bubble catches warm light.

10–15s: Pull back. Full glass, perfect foam dome. Condensation running down glass. Dark moody background. Hold 2 seconds.

Style: ASMR sensory, macro quality, slow-motion feel.`,
    audioHint: 'Liquid pour, bong bóng, bọt settling. KHÔNG nhạc — pure ASMR.',
    brandNotes: ['ASMR = NO music, pure SFX', 'Macro: sharp focus on bubbles', '9:16 vertical = optimal Reels/TikTok'],
    tips: ['ASMR beer content = millions of views potential', 'Generate 5 variations, pick sharpest', 'Loop-friendly for extended version'],
  },
  {
    id: 'sp-04',
    name: 'Can Opening — Satisfying Pop',
    description: 'Extreme macro: tay bật nắp lon Bitburger — mist spray đông cứng, CO2 hiss. Satisfying moment.',
    storyboard: '🎬 Kịch bản:\n• Lon Bitburger, condensation nặng hạt\n• Thumb kéo tab — POP!\n• Mist spray bay lên, frozen mid-air\n• CO2 hiss kéo dài — satisfying\n• Macro: mist particles lắng xuống, can stabilize\n\n💡 "Psst. Satisfying level: Bitburger."',
    pageId: 'san-pham', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'TikTok viral, satisfying compilations', product: 'Bitburger Premium Pils',
    prompt: `Extreme close-up macro, static camera. Hand grips cold Bitburger Premium Pils 500ml aluminum can with heavy condensation on emerald green surface. Thumb pulls tab — fine mist spray releases upward with carbonation hiss. Spray particles frozen mid-air in dramatic rim lighting. Dark background. 100mm macro, f/4. SFX: metallic pop, satisfying carbonation hiss, droplets settling. Studio silence. (no subtitles)`,
    audioHint: 'Pop nắp kim loại, hiss CO2, giọt nước settle.',
    brandNotes: ['Emerald green can surface sharp detail', 'Mist spray = physics realism', 'Veo 3 freeze-frame spray excellent'],
    tips: ['Can pop = universal satisfying content', 'Loop 2-3 lần cho extended', 'Satisfying compilations = viral potential'],
  },
  {
    id: 'sp-05',
    name: 'Three Brothers — Product Lineup',
    description: '3 dòng Benediktiner xếp hàng: Weissbier, Dunkel, Hell. So sánh sắc bia, bọt, ly.',
    storyboard: '🎬 Kịch bản:\n• 3 chai Benediktiner xếp hàng, mỗi chai 1 ly phía trước\n• Background gradient: amber → chestnut → cream gold\n• Camera dolly ngang: Weissbier → Dunkel → Hell\n• Pause mỗi ly: show sắc bia + kiểu bọt\n• Pull back: bộ 3 hoàn chỉnh, text space\n\n💡 "3 tính cách. 1 triết lý. Chọn dòng nào là chọn mood."',
    pageId: 'san-pham', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'Product showcase, comparison, quiz content', product: 'Benediktiner (3 dòng)',
    prompt: `Follow @Image1 (3 bottles) lineup.

0–5s: Wide, tracking left → right. Three Benediktiner bottles on polished black reflective surface. Each with filled glass in front. Background gradient: amber gold (left) → chestnut (center) → cream gold (right).

5–10s: Dolly across each glass. Weissbier (cloudy amber, thick white foam), Dunkel (chestnut-brown, tan foam), Hell (crystal-clear golden, fine white foam). Brief pause on each.

10–15s: Pull back wide. All three, even rim highlights, color reflections below. Hold for comparison text.

Style: Premium retail, clean, educational.`,
    audioHint: 'Whoosh nhẹ giữa mỗi beer, ambient premium.',
    brandNotes: ['Weissbier: cloudy amber, WHITE foam', 'Dunkel: chestnut-brown cloudy, TAN foam', 'Hell: crystal-clear golden, fine WHITE foam', 'Gradient BG matches beer colors'],
    tips: ['Comparison content = quiz CTA "Bạn là dòng nào?"', 'Pause = text overlay opportunity'],
  },
  {
    id: 'sp-06',
    name: 'Condensation Drip — Sensory Detail',
    description: 'Extreme macro: giọt condensation chảy xuống thành chai Benediktiner. Slow motion, sensory.',
    storyboard: '🎬 Kịch bản:\n• Macro cực gần: thành chai dark brown, condensation\n• Một giọt nước hình thành, ngày càng lớn\n• Giọt bắt đầu chảy xuống — slow motion\n• Đường chảy qua nhãn gold monastery\n• Giọt rơi xuống bề mặt phản chiếu — splash nhỏ\n\n💡 "5°C. Sẵn sàng."',
    pageId: 'san-pham', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'IG Reels — sensory, satisfying, premium feel', product: 'Benediktiner Weissbier',
    prompt: `Extreme macro close-up, static camera with subtle push-in. A cold Benediktiner Weissbier 500ml dark brown bottle surface. Heavy condensation. A single water droplet forms, grows larger on the glass surface. It begins to slide down slowly — following the contour of the bottle, passing over the gold monastery label. The droplet catches warm sidelight, creating a tiny lens effect. It reaches the bottom of the bottle and drops onto a dark reflective surface below, creating a perfect micro-splash. Dramatic single-source warm lighting on dark background. 100mm macro, f/2.8. Colors: dark brown glass, gold label, clear water droplet. SFX: absolute quiet, then tiny splash at the end. (no subtitles)`,
    audioHint: 'Yên tĩnh tuyệt đối, cuối cùng: giọt nước rơi nhẹ splash.',
    brandNotes: ['Condensation = cold beer = ready to serve signal', 'Gold monastery label visible through droplet lens', 'Micro-splash physics = premium detail'],
    tips: ['Sensory detail content = high save/replay', 'Caption: "5°C. Sẵn sàng."', 'Works as loop for TikTok'],
  },

  // ╔═══════════════════════════════════════════╗
  // ║  PAGE 8: KIẾN THỨC / EDUCATION (6)        ║
  // ╚═══════════════════════════════════════════╝

  {
    id: 'kt-01',
    name: 'Cách Rót Bia Lúa Mì Đúng Chuẩn Bavaria',
    description: '3 bước: nghiêng 45° → dựng thẳng → swirl yeast. Tutorial ASMR save-worthy.',
    storyboard: '🎬 Kịch bản:\n• Bước 1: Ly nghiêng 45°, rót dọc thành — bọt nhẹ\n• Bước 2: Dựng thẳng ở 2/3 — bọt kem dâng\n• Bước 3: Swirl chai (lấy men đáy) → rót thẳng\n• Bọt dome dramatic trên miệng ly\n• Hold: ly hoàn hảo\n\n💡 "Khi rót đúng, bạn sẽ hiểu vì sao."',
    pageId: 'kien-thuc', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'Reels education — save-worthy', product: 'Benediktiner Weissbier',
    prompt: `Follow @Image1 for Benediktiner Weissbier 500ml.

0–5s: Clean studio, marble surface, bright lighting. Hands hold Weizen glass at 45°. Benediktiner bottle pours cloudy golden-amber beer along glass wall. Smooth flow, minimal foam.

5–10s: Glass tilts upright at 2/3 full. Creamy white foam builds thick. Pour pauses. Foam settles.

10–15s: Hand swirls remaining beer in bottle (2 rotations for yeast). Pours last portion straight center. Foam rises dramatically — cream dome above rim. Camera pushes in on perfect result. Hold.

Style: Clean tutorial, bright, instructional. White marble, clean background.`,
    audioHint: 'Bia rót, bọt nổi, chai swirl, bọt bung. ASMR — không nhạc.',
    brandNotes: ['3-phase pour: 45° wall → upright → swirl center', 'Swirl = yeast sediment from bottom', 'Foam: WHITE cream dome', 'Bright clean background — tutorial clarity'],
    tips: ['Education = HIGHEST save rate → algorithm boost', 'Text overlay step 1-2-3 trong post-production', 'Save CTA: "Save để lần sau rót đúng 🍺"'],
  },
  {
    id: 'kt-02',
    name: '6°C vs 10°C — Nhiệt Độ Quyết Định Vị',
    description: 'So sánh Pils 6°C vs Weissbier 10°C. Cùng 1 thương hiệu, 4°C chênh lệch thay đổi tất cả.',
    storyboard: '🎬 Kịch bản:\n• Split screen:\n  Trái: Bitburger Pils, 6°C, trong vắt, bọt crisp\n  Phải: Weissbier, 10°C, hổ phách đục, bọt cream\n• Camera dolly qua từng ly\n• Visual contrast: clear vs cloudy, thin vs thick\n\n💡 "4 độ C chênh lệch thay đổi tất cả."',
    pageId: 'kien-thuc', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'Education Reel — temperature guide', product: 'Bitburger + Benediktiner',
    prompt: `Cinematic close-up, tracking left → right. White marble, bright studio. Left: Bitburger emerald can beside Pilsner glass with crystal-clear golden beer, thin white foam. Thermometer showing 6°. Right: Benediktiner bottle beside Weizen glass with cloudy golden-amber, thick white foam. Thermometer showing 10°. Camera glides comparing differences. 70mm, f/4. SFX: soft glass sounds, quiet studio. (no subtitles)`,
    audioHint: 'Studio yên tĩnh, ly trên marble. Clean.',
    brandNotes: ['Pils: 6°C optimal, crystal-clear, thin foam', 'Weissbier: 8-10°C optimal, cloudy, thick foam', 'DIFFERENT glasses: Pilsner vs Weizen'],
    tips: ['Side-by-side = easy education format', 'Caption giải thích khoa học aromatics', 'Temperature niche = HIGH engagement craft beer'],
  },
  {
    id: 'kt-03',
    name: 'Pilsner vs Weizen Glass — Ly Nào Cho Bia Nào',
    description: 'So sánh 2 kiểu ly: Pilsner glass vs Weizen glass. Hình dáng khác nhau, lý do khác nhau.',
    storyboard: '🎬 Kịch bản:\n• 2 ly trống xếp cạnh nhau trên bàn sáng\n• Trái: Pilsner glass (thấp, thẳng, thanh)\n• Phải: Weizen glass (cao, tulip, cong)\n• Rót Bitburger vào Pilsner glass → perfect\n• Rót Weissbier vào Weizen glass → perfect\n• Cross-comparison: why shape matters\n\n💡 "Ly đúng = bia ngon hơn 30%. Không phải phóng đại."',
    pageId: 'kien-thuc', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'Education — glassware guide', product: 'Bitburger + Benediktiner',
    prompt: `0–3s: Clean white marble surface, bright even light. Two empty glasses side by side. Left: short straight Pilsner glass. Right: tall curved Weizen tulip glass. Camera holds to show shape difference clearly.

3–8s: A hand pours Bitburger crystal-clear golden pilsner into the Pilsner glass. Fine white foam cap. Then pours Benediktiner cloudy golden-amber wheat beer into the Weizen glass. Thick white foam builds.

8–12s: Side by side comparison. Camera slowly tracks back and forth. The Pilsner glass showcases clarity and bubbles. The Weizen glass captures aroma in its tulip shape, showcases thick foam.

12–15s: Pull back. Both glasses filled perfectly, each beer in its proper glass. Text overlay space for glass names. Clean educational content.

Style: Clean tutorial, bright, comparison format.`,
    audioHint: 'Ly đặt, bia rót, bọt dâng. Clean sounds.',
    brandNotes: ['Pilsner: thấp, thẳng → showcase clarity + carbonation', 'Weizen: cao, tulip → trap aroma + foam space', 'KHÔNG dùng sai ly — brand accuracy'],
    tips: ['Glassware education = niche but loyal audience', '"Ly đúng = bia ngon hơn 30%" hook', 'Save-worthy content'],
  },
  {
    id: 'kt-04',
    name: 'Tasting Note — Weissbier Decoded',
    description: 'Hướng dẫn nếm Weissbier: nhìn sắc → ngửi hương → nhấp → nuốt → aftertaste. 5 bước thưởng thức.',
    storyboard: '🎬 Kịch bản:\n• Bước 1 — NHÌN: nghiêng ly, sắc amber đục, bọt\n• Bước 2 — NGỬI: đưa ly lên mũi, hương vị thoảng\n• Bước 3 — NHẤP: ngụm nhỏ, giữ trên lưỡi\n• Bước 4 — NUỐT: swallow, cảm nhận body\n• Bước 5 — AFTERTASTE: close eyes, vị chuối, đinh hương\n\n💡 "Weissbier không uống nhanh. 5 bước. Thưởng thức đúng."',
    pageId: 'kien-thuc', tool: 'veo3', toolLabel: 'Veo 3.1', duration: '8s', aspect: '9:16',
    purpose: 'Education — tasting guide, premium positioning', product: 'Benediktiner Weissbier',
    prompt: `Cinematic close-up sequence, smooth transitions. A person holds a Weizen glass of cloudy golden-amber Benediktiner Weissbier. Step 1: tilts glass slightly examining the amber color against warm light — cloudy liquid, thick foam visible. Step 2: brings glass under nose, gently swirls, subtle inhale — detecting aromas. Step 3: takes a small sip, holds on palate briefly, eyes close in concentration. Step 4: appreciation expression — subtle nod, recognizing flavors. Step 5: eyes still closed, gentle satisfied smile — the aftertaste. Clean warm background, minimal distraction. Shot on 85mm, f/1.8. Professional tasting atmosphere. SFX: liquid swirling, gentle sip, contemplative quiet. (no subtitles)`,
    audioHint: 'Ly swirl, nhấp nhẹ, thở ra — tasting sounds.',
    brandNotes: ['5 steps: Look → Smell → Sip → Swallow → Aftertaste', 'Weissbier notes: banana, clove, bread', 'Professional tasting = premium positioning'],
    tips: ['Tasting guide = educational + aspirational', 'Caption: giải thích flavor notes tiếng Việt', 'Series: Dunkel tasting note, Pils tasting note'],
  },
  {
    id: 'kt-05',
    name: 'Bia Lúa Mì vs Bia Lager — Khác Gì?',
    description: 'Giải thích trực quan: Wheat Beer (Benediktiner) vs Lager (Bitburger). Men khác, vị khác, ly khác.',
    storyboard: '🎬 Kịch bản:\n• Split: Benediktiner Weissbier | Bitburger Pils\n• Cùng rót song song: cloudy vs clear\n• Cùng nhìn: amber vs golden\n• Cùng nếm: full-body vs crisp\n• Infographic overlay: Ale yeast (top) vs Lager yeast (bottom)\n\n💡 "Wheat beer vs Lager: không phải tốt-xấu, mà là mood-khác-nhau."',
    pageId: 'kien-thuc', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'Education — beer 101, the classic comparison', product: 'Benediktiner + Bitburger',
    prompt: `0–4s: Split-frame or side-by-side. Left: Benediktiner Weissbier bottle + empty Weizen glass. Right: Bitburger can + empty Pilsner glass. Clean white/marble surface, bright even lighting.

4–9s: Simultaneous pour. Left: cloudy golden-amber wheat beer flows into Weizen glass, thick white foam builds. Right: crystal-clear golden pilsner flows into Pilsner glass, crisp thin foam cap. Camera captures the stark visual difference.

9–13s: Side-by-side glasses filled. Camera slowly tracks showing each detail. Cloudy vs clear. Thick foam vs thin. Amber vs golden. Tall tulip vs short straight.

13–15s: Pull back. Two beers, two glasses, two experiences. Clean comparison layout. Space for infographic text overlay (beer types, yeast types, flavor profiles).

Style: Educational comparison, bright clean, infographic-ready.`,
    audioHint: 'Hai dòng bia rót song song, bọt dâng, glass settle.',
    brandNotes: ['Wheat Beer (Ale yeast, top-fermenting): fruity, full-body, cloudy', 'Lager (Lager yeast, bottom-fermenting): clean, crisp, clear', 'BOTH are premium — no good/bad comparison'],
    tips: ['Beer 101 = widest audience education content', 'Infographic overlay trong post-production', '"Bạn team nào?" = engagement hook'],
  },
  {
    id: 'kt-06',
    name: 'Bảo Quản Bia — Fridge Tips',
    description: 'Hướng dẫn bảo quản: nhiệt độ, position, thời gian. Bia Đức khác bia công nghiệp.',
    storyboard: '🎬 Kịch bản:\n• Tay xếp chai Benediktiner vào tủ lạnh — nằm đứng, KHÔNG nằm ngang\n• Nhiệt kế: 5-7°C = optimal\n• Timer: lấy ra 10 phút trước khi uống\n• So sánh: bia quá lạnh (0°C) vs đúng nhiệt (6°C): sắc bia khác!\n• Final: ly bia hoàn hảo ở ĐÚNG nhiệt độ\n\n💡 "Bảo quản sai = uống sai. Bia Đức có quy tắc riêng."',
    pageId: 'kien-thuc', tool: 'seedance', toolLabel: 'Seedance 2.0', duration: '15s', aspect: '9:16',
    purpose: 'Education — storage guide, practical tips', product: 'Benediktiner + Bitburger',
    prompt: `Follow @Image1 for Benediktiner Weissbier.

0–4s: Close-up hand placing Benediktiner bottles UPRIGHT (not horizontal) into a refrigerator shelf. Clearly showing vertical position. Clean, organized fridge interior.

4–8s: Close-up on a thermometer reading 5-7°C. Then a timer showing 10 minutes — text hint: "Take out 10 min before serving."

8–12s: Side by side: left glass pour at 0°C (over-cold, no aroma visible) vs right glass pour at 6°C (proper temperature, full color, foam, visible aromatics). Clear visual difference.

12–15s: Final shot. A perfectly tempered glass of beer at 6°C — full cloudy amber color, aromatic foam crown, condensation on glass. The "correct" result. Hold for text.

Style: Clean practical tutorial, bright, clear visual comparisons.`,
    audioHint: 'Tủ lạnh đóng, timer tick, bia rót 2 versions.',
    brandNotes: ['Chai đứng KHÔNG nằm = yeast settles at bottom (normal)', '5-7°C = optimal storage, 6°C = optimal serving for Pils', '10 min trước khi uống = allow aromatics to open'],
    tips: ['Practical tips = high save + daily relevance', '0°C vs 6°C visual = wow education moment', 'Series: "Sai lầm #1 khi uống bia Đức"'],
  },
];

// ═══ PROMPT TEMPLATES ═══

export interface PromptTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  tool: VideoTool;
  template: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'tpl-storyselling',
    name: 'Storyselling Scene',
    icon: '📖',
    description: 'Template kể chuyện — SP xuất hiện tự nhiên',
    tool: 'seedance',
    template: `Follow @Image1 for [tên SP + mô tả chai/lon + nhãn].

0–[X]s: [BỐI CẢNH — ai, ở đâu, làm gì]

[X]–[Y]s: [SẢN PHẨM XUẤT HIỆN TỰ NHIÊN — rót, cầm, đặt.
Mô tả sắc bia, bọt, condensation, ánh sáng qua ly]

[Y]–[Z]s: [GIÁ TRỊ MOMENT — toast, nhấp, thưởng thức.
Camera hold cho text overlay]

Style: [Cinematic/Editorial/ASMR]. Colors: [hex codes].
Audio hint: [SFX cụ thể].`,
  },
  {
    id: 'tpl-hero-product',
    name: 'Hero Product Shot',
    icon: '🏆',
    description: 'Template hero sản phẩm — quảng cáo',
    tool: 'veo3',
    template: `[Camera]: [framing], [1 movement duy nhất].
[Subject]: [tên SP: chai/lon + size + màu + nhãn + nắp].
[Action]: [splash/pour/reveal/rotate].
[Setting]: [surface + background + color hex].
[Lighting]: ["rim light catching condensation"].
[Technical]: Shot on [lens]mm, f/[stop], [aesthetic].
[Audio]: SFX: [sounds]. Ambient: [atmosphere].
(no subtitles)`,
  },
  {
    id: 'tpl-food-pairing',
    name: 'Food Pairing Shot',
    icon: '🍽️',
    description: 'Template bia × ẩm thực',
    tool: 'veo3',
    template: `[Camera]: Overhead → 45°, slow push.
[Food]: [món ăn + mô tả visual: hơi nóng, sắc].
[Beer]: [tên SP + sắc bia + kiểu bọt] beside.
[Color harmony]: [giải thích tại sao match].
[Lighting]: Warm directional from [hướng].
[Technical]: Shot on [lens], f/[stop], editorial.
[Audio]: SFX: [sounds].
(no subtitles)

💡 Pairing logic: [vì sao dòng bia này hợp món này]`,
  },
  {
    id: 'tpl-education',
    name: 'Education / How-to',
    icon: '📚',
    description: 'Template tutorial step-by-step',
    tool: 'seedance',
    template: `Follow @Image1 for [tên SP].

0–[X]s: [Bước 1 — setup, action. Clean bright light]

[X]–[Y]s: [Bước 2 — main action, camera follows]

[Y]–[Z]s: [Bước 3 — result reveal. Camera hold]

Style: Clean tutorial, bright even lighting, save-worthy.
Audio: [Pure ASMR — no music].

💡 Text overlay: [Step 1/2/3 — post-production]`,
  },
];
