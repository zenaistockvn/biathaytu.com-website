import { Metadata } from 'next';
import JsonLd, { getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';
import ProductStory from '../components/ProductStory';
import { getLineProducts } from '@/lib/data/products';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Benediktiner Weissbier Naturtrüb, nhập khẩu Đức',
  description: 'Benediktiner Weissbier Naturtrüb 5,4%, bia lúa mì không lọc: Vàng đục, bọt dày, hương chuối chín và đinh hương. Uống 7 - 9 °C trong ly Weizen.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/benediktiner-weissbier-naturtrub' },
  openGraph: {
    title: 'Benediktiner Weissbier Naturtrüb, nhập khẩu Đức',
    description: 'Benediktiner Weissbier Naturtrüb 5,4%, bia lúa mì không lọc: Vàng đục, bọt dày, hương chuối chín và đinh hương. Uống 7 - 9 °C trong ly Weizen.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn/benediktiner-weissbier-naturtrub',
    images: [
      {
        url: '/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'Bia Thầy Tu Benediktiner Weissbier Naturtrüb',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Thầy Tu Benediktiner Weissbier Naturtrüb, nhập khẩu Đức',
    description: 'Bia lúa mì Đức ủ tại Lich theo công thức gốc dòng Biển Đức, men từ hầm tu viện Ettal. Đạt iTQi Superior Taste Award 3 sao năm 2022.',
    images: ['/images/og/home.jpg'],
  },
};

export default function Page() {
  const product = {
    name: 'Benediktiner Weissbier Naturtrüb',
    slug: 'benediktiner-weissbier-naturtrub',
    url: 'https://www.biathaytu.com.vn/benediktiner-weissbier-naturtrub',
    description: 'Bia lúa mì Đức không lọc, còn men trong chai, ủ tại Lich theo công thức gốc dòng Biển Đức với men từ hầm tu viện Ettal.',
    abv: '5.4',
    volume: '500ml',
  };

  const formats = getLineProducts('naturtrub');

  return (
    <>
      <JsonLd type="product" data={getProductSchema({ ...product, category: 'bia' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail(NAV.products, { href: '/benediktiner-weissbier-naturtrub', label: 'Weissbier Naturtrüb' }))} />

      <ProductStory
        wordmark="BENEDIKTINER"
        hero={{
          eyebrow: 'Benediktiner Weissbräu Ettal',
          title: 'Weissbier Naturtrüb',
          kicker: 'Bia lúa mì không lọc',
          meta: '5,4% vol. Uống ở 7 đến 9°C.',
          photo: { src: '/images/brand/benediktiner-official/home-hero.jpg', alt: 'Ly và chai Benediktiner Weissbier Naturtrüb trước Tu viện Ettal và dãy Alps', position: '68% center' },
        }}
        intro={{
          title: 'Lớp men trong chai',
          image: { src: '/images/products/official/benediktiner/bottle_removebg.png', alt: 'Chai Benediktiner Weissbier Naturtrüb' },
          body: (
            <>
              <p>Rót ra ly thấy đục là đúng. Naturtrüb trong tiếng Đức nghĩa là &quot;đục tự nhiên&quot;: Benediktiner Weissbier không qua lọc nên men vẫn lơ lửng trong bia.</p>
              <p>Lớp men đó làm bia vàng đục và hương chuối chín, đinh hương rõ hơn. Men cùng protein của lúa mì cũng giữ bọt dày, lâu tan.</p>
              <p>Trên nhãn bia Đức, chữ Hefe (như Hefeweizen) nghĩa là có men, tức bia không lọc. Chữ Kristall là bản đã lọc: Trong, nhẹ hương hơn, bọt mỏng và tan nhanh hơn.</p>
              <p>Phần men lắng dưới đáy chai là phần nên rót vào ly, đừng bỏ lại. Cách rót có ở mục bên dưới.</p>
            </>
          ),
          actions: [
            { href: '/bang-gia-si-dai-ly#dang-ky-hop-tac', label: 'Đăng ký hợp tác' },
            { href: '/san-pham#benediktiner', label: 'Xem các quy cách' },
          ],
        }}
        profile={{
          serving: '5,4% vol. Nhiệt độ 7 đến 9°C. Ly Weizen cao.',
          flavors: [
            { label: 'Trái cây', value: 5 },
            { label: 'Gia vị', value: 4 },
            { label: 'Lúa mì', value: 4 },
            { label: 'Mạch nha', value: 2 },
            { label: 'Caramel', value: 1 },
            { label: 'Rang', value: 0 },
            { label: 'Hoa bia', value: 1 },
            { label: 'Đắng', value: 1 },
          ],
          color: 2,
          clarity: 2,
          foam: 2,
        }}
        notes={{
          title: 'Hương vị cảm nhận',
          items: [
            { term: 'Thị giác', text: 'Vàng đục. Bọt trắng dày, lâu tan, bám thành ly.' },
            { term: 'Khứu giác', text: 'Chuối chín, đinh hương cay nhẹ và mùi lúa mì.' },
            { term: 'Vị giác', text: 'Thân mềm. Ngọt nhẹ kiểu trái cây, không đắng gắt.' },
            { term: 'Hậu vị', text: 'Nhẹ, ngọt thanh của mạch nha, mùi trái cây còn lại khá lâu.' },
          ],
        }}
        story={{
          title: 'Một chút lịch sử',
          body: (
            <>
              <p>Tu viện Ettal của dòng Biển Đức do Hoàng đế Ludwig IV lập năm 1330, ở độ cao 877 m dưới chân dãy Alps, Bavaria. Truyền thống bia lúa mì của tu viện là nền tảng của công thức Benediktiner.</p>
              <p>Ngày nay bia ủ tại Lich, bang Hessen, bởi nhà bia tư nhân Ihring-Melchior, theo công thức gốc dòng Biển Đức và Luật Tinh Khiết 1516. Men vẫn lấy từ hầm tu viện Ettal.</p>
            </>
          ),
        }}
        ritual={{
          title: 'Nghi thức rót',
          kicker: 'Bốn bước',
          steps: [
            ['Ướp lạnh', 'Ướp lạnh chai ở 7 đến 9°C, tráng ly Weizen bằng nước lạnh trước khi rót.'],
            ['Rót nghiêng 45°', 'Rót chậm dọc thành ly nghiêng cho đến khi trong chai còn khoảng một phần tư.'],
            ['Xoay nhẹ chai', 'Lăn nhẹ chai vài vòng cho lớp men dưới đáy tan vào phần bia còn lại.'],
            ['Phủ bọt', 'Rót phần men còn lại vào giữa ly để tạo lớp bọt dày mịn.'],
          ],
        }}
        formats={{ products: formats }}
        pairing={{
          image: { src: '/images/brand/benediktiner-official/beer-garden-closeup.jpg', alt: 'Chai và ly Benediktiner Weissbier trên bàn gỗ ngoài vườn', position: '70% center' },
          title: 'Món ăn kèm',
          kicker: 'Món thanh, ít gia vị',
          intro: 'Bia nhẹ, ngọt dịu, nhiều ga nên hợp món thanh và hải sản:',
          items: [
            { title: 'Hải sản', text: 'Tôm hấp sả, cua hấp, mực nướng và lẩu hải sản chua ngọt.' },
            { title: 'Đồ nướng và gia cầm', text: 'Gà quay mật ong, xá xíu, salad ức gà nướng và xúc xích trắng kiểu Đức.' },
            { title: 'Phô mai mềm và tráng miệng', text: 'Phô mai dê, Gouda mềm, tart táo và panna cotta trái cây.' },
          ],
        }}
        cta={{
          title: 'Hợp tác phân phối',
          kicker: 'Đại lý và nhà phân phối',
          text: 'Có chai 500ml, lon 500ml và bom 5L, nhập khẩu nguyên chai từ Đức. Đăng ký hợp tác để trao đổi về phân phối.',
          action: { href: '/bang-gia-si-dai-ly#dang-ky-hop-tac', label: 'Đăng ký hợp tác' },
        }}
      />
    </>
  );
}
