import Image from 'next/image';
import JsonLd, { getBreadcrumbSchema } from '../components/JsonLd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Câu Chuyện Thương Hiệu — 400 Năm Nghệ Thuật Ủ Bia Tu Viện',
  description: 'Khám phá lịch sử 400 năm truyền thống ủ bia Benediktiner từ Tu Viện Ettal, Bavaria. Chuẩn Luật Tinh Khiết 1516 — chỉ 4 nguyên liệu tự nhiên.',
  alternates: {
    canonical: 'https://www.biathaytu.com/thuong-hieu',
  },
};

export default function BrandStoryPage() {
  return (
    <div className="subpage-wrap">
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang Chủ', url: 'https://www.biathaytu.com' },
        { name: 'Thương Hiệu', url: 'https://www.biathaytu.com/thuong-hieu' },
      ])} />

      {/* Header */}
      <section className="container subpage-header">
        <span className="section-label">Di Sản Gần Nửa Thiên Niên Kỷ</span>
        <h1 className="page-title">Câu Chuyện Thương Hiệu</h1>
        <p className="page-subtitle">
          Từ một tu viện cổ xưa ẩn mình giữa rặng núi Alps hùng vĩ, đến những ly bia màu hổ phách và hoàng kim chinh phục toàn thế giới. Khám phá nghệ thuật ủ bia thủ công chứa đựng sự tỉ mỉ vượt thời gian.
        </p>
      </section>

      <section className="container" style={{ maxWidth: '1100px' }}>
        {/* Story Block 1 */}
        <article className="split-section" style={{ marginBottom: '100px' }}>
          <div className="story-img-wrap">
            <Image 
              src="/images/products/story_monastery_v2.png" 
              alt="Tu Viện Ettal, Bavaria — nơi khởi nguồn bia Benediktiner từ năm 1330" 
              fill 
              style={{ objectFit: 'cover' }} 
            />
          </div>
          <div>
            <h2 className="story-heading">Tu Viện Ettal — Nơi Khởi Nguồn</h2>
            <p className="story-lead">
              Nằm sâu trong thung lũng thanh bình của dãy Bavarian Alps (Đức), tu viện Ettal được thành lập từ năm 1330 bởi Hoàng đế Louis IV.
            </p>
            <p className="story-body">
              Từ năm 1609, các tu sĩ dòng Benedictine tại đây bắt đầu ủ những mẻ bia đầu tiên. Xuyên suốt hơn 4 thế kỷ, từng giọt bia đều chứa đựng sự tĩnh lặng kỷ luật, lòng kiên nhẫn và sự tôn trọng tuyệt đối dành cho nguyên bản của thiên nhiên.
            </p>
          </div>
        </article>

        {/* Story Block 2 */}
        <article className="split-section" style={{ marginBottom: '100px' }}>
          <div style={{ order: 1 }}>
            <h2 className="story-heading">Luật Tinh Khiết Bavarian <br/><span className="story-accent">(Reinheitsgebot 1516)</span></h2>
            <p className="story-lead">
              Benediktiner là minh chứng hoàn hảo về độ tinh khiết tuyệt đối.
            </p>
            <p className="story-body">
              Hoàn toàn trung thành với Đạo luật Tinh Khiết năm 1516 do Công tước Wilhelm IV ban hành. Chỉ đúng 4 báu vật thiên nhiên được phép hiện diện: Nguồn nước khoáng vô trùng từ rặng Alps, Mạch nha thượng hạng, Hoa bia tươi vùng Hallertau và Dòng men tự nhiên thuần chủng của tu viện. Không phụ gia, không chất bảo quản.
            </p>
          </div>
          <div style={{ order: 2 }} className="story-img-wrap">
            <Image 
              src="/images/products/premium_ugc/benediktiner_heritage.png" 
              alt="4 nguyên liệu bia Đức chuẩn Luật Tinh Khiết 1516 — nước, malt, hoa bia, men" 
              fill 
              style={{ objectFit: 'cover' }} 
            />
          </div>
        </article>

        {/* Story Block 3 */}
        <article className="split-section" style={{ marginBottom: '80px' }}>
          <div className="story-img-wrap">
             <Image 
              src="/images/products/hero_weissbier_v2.png" 
              alt="Bia lúa mì Benediktiner Weissbier Naturtrüb — không lọc, lên men tự nhiên trong chai" 
              fill 
              style={{ objectFit: 'cover', objectPosition: 'center' }} 
            />
          </div>
          <div>
            <h2 className="story-heading">Lên Men Tự Nhiên Bừng Sức Sống</h2>
            <p className="story-lead">
              Sự vẩn đục (Naturtrüb) của lớp bia chính là sự hiện diện của sức sống.
            </p>
            <p className="story-body">
              Kế thừa phương pháp lên men đỉnh cổ truyền. Lớp men không bị lọc thô mà tiếp tục được ủ chín thủ công ngay trong chai/bom, giúp giải phóng chùm hương hoa quả đặc sắc của chuối, đinh hương, và xen lẫn vị caramel ngọt ngào — mang lại dư vị &quot;Umami&quot; tròn trịa lan tỏa mọi giác quan.
            </p>
          </div>
        </article>
      </section>

      {/* CTA Banner */}
      <section className="container" style={{ marginTop: '120px' }}>
        <div className="cta-banner">
          <span className="cta-banner-watermark">B</span>
          <div className="cta-banner-icon"><span>B</span></div>
          <h2>Nhập khẩu &amp; Phân Phối Độc Quyền</h2>
          <p>
            Bia Thầy Tu Benediktiner được nhập khẩu và phân phối độc quyền tại Việt Nam. 
            Cam kết 100% nguyên bản nhập khẩu chính ngạch từ Đức, bảo quản lạnh tối ưu để giữ trọn vẹn hương vị tu viện trong từng hơi thở sủi bọt.
          </p>
          <a href="/san-pham" className="btn-primary">
            Khám Phá Bộ Sưu Tập BIA THẦY TU
          </a>
        </div>
      </section>
    </div>
  );
}
