import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import EditorialPage, { CtaBand, InfoGrid, Summary } from '../components/EditorialPage'
import { getProductBySlugOrId } from '@/lib/data/products'
import { formatPrice } from '@/utils/formatPrice';
import { breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Quà Tặng Bia Đức Cao Cấp Dành Cho Doanh Nghiệp',
  description: 'Hộp quà tặng bia Đức sang trọng, đẳng cấp. Combo bia Benediktiner, Bitburger dành cho doanh nghiệp, đối tác dịp Lễ, Tết. Có xuất hóa đơn VAT.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/qua-tang-bia-duc' },
  openGraph: {
    title: 'Quà Tặng Bia Đức Cao Cấp Dành Cho Doanh Nghiệp',
    description: 'Hộp quà tặng bia Đức sang trọng, đẳng cấp. Combo bia Benediktiner, Bitburger dành cho doanh nghiệp, đối tác dịp Lễ, Tết. Có xuất hóa đơn VAT.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/qua-tang-bia-duc',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Quà Tặng Bia Đức Cao Cấp Dành Cho Doanh Nghiệp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quà Tặng Bia Đức Cao Cấp Dành Cho Doanh Nghiệp',
    description: 'Hộp quà tặng bia Đức sang trọng, đẳng cấp. Combo bia Benediktiner, Bitburger dành cho doanh nghiệp, đối tác dịp Lễ, Tết. Có xuất hóa đơn VAT.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

/** Giá lấy từ dữ liệu sản phẩm để luôn khớp trang chi tiết. */
function priceOf(slug: string): string {
  const product = getProductBySlugOrId(slug);
  return product && !product.hidden && product.price ? `Giá bán lẻ ${formatPrice(product.price)}` : 'Liên hệ để báo giá';
}

export default function Page() {
  const telHref = getCompanyTelHref() ?? '/lien-he';
  const zaloUrl = getCompanyZaloUrl() ?? '/lien-he';

  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Quà Tặng Bia Đức', slug: 'qua-tang-bia-duc', url: 'https://www.biathaytu.com.vn/qua-tang-bia-duc', description: 'Giải pháp quà tặng bia Đức cho doanh nghiệp.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail({ href: '/qua-tang-bia-duc', label: 'Quà Tặng Bia Đức' }))} />

      <EditorialPage
        hero={{
          eyebrow: 'Quà tặng doanh nghiệp',
          title: 'Quà tặng bia Đức',
          kicker: 'Lễ, Tết và tri ân đối tác',
          lead: 'Món quà mang 400 năm nghệ thuật ủ bia từ Bavaria.',
        }}
      >
        <Summary>
          <p><strong>Khác với vang hay rượu mạnh</strong> vốn đã quá phổ biến, bia Đức nhập khẩu là làn gió mới trong văn hóa tặng quà doanh nghiệp: sang trọng, độc đáo, dễ tiếp cận trong các bữa tiệc tri ân cuối năm. Xem toàn bộ <Link href="/san-pham">danh mục bia Đức</Link>.</p>
        </Summary>

        <h2>Các lựa chọn quà tặng</h2>
        <InfoGrid
          items={[
            { title: <Link href="/san-pham/benediktiner-mix-2-vi-thung-12-chai-500ml">Hộp Mix 2 vị</Link>, text: 'Thùng 12 chai gồm 6 Weissbier (bia lúa mì) và 6 Dunkel (bia đen). Hộp cứng, quai xách.', meta: priceOf('benediktiner-mix-2-vi-thung-12-chai-500ml') },
            { title: <Link href="/san-pham/benediktiner-naturtrub-bom-5l">Bom 5 lít lễ hội</Link>, text: 'Bom 5 lít có vòi rót sẵn, để đối tác dùng ngay trong các bữa tiệc tụ họp.', meta: priceOf('benediktiner-naturtrub-bom-5l') },
            { title: 'Set quà kèm ly', text: 'Combo 6 chai bia nhập khẩu kèm 1 ly Weizen tiêu chuẩn Đức.', meta: 'Liên hệ B2B' },
          ]}
        />

        <h2>Đặc quyền khách hàng doanh nghiệp</h2>
        <ul>
          <li><strong>Chiết khấu:</strong> chính sách giá ưu đãi cho đơn hàng số lượng lớn dịp Lễ, Tết.</li>
          <li><strong>Hóa đơn VAT:</strong> đầy đủ chứng từ hợp lệ, CO/CQ, hóa đơn VAT theo yêu cầu doanh nghiệp.</li>
          <li><strong>Tùy biến quà tặng:</strong> hỗ trợ in logo doanh nghiệp lên bao bì, thiệp chúc mừng thiết kế riêng theo nhận diện thương hiệu.</li>
          <li><strong>Giao hàng đa điểm:</strong> vận chuyển tận tay đến các đối tác của bạn trên toàn quốc, an toàn, đúng hẹn.</li>
        </ul>

        <CtaBand
          title="Đặt quà tặng"
          text="Để nhận catalog quà tặng mới nhất và báo giá chiết khấu, vui lòng liên hệ."
          action={{ href: zaloUrl, label: 'Mở Zalo', external: zaloUrl.startsWith('https://') }}
          secondary={{ href: telHref, label: 'Hotline tư vấn quà tặng' }}
        />
      </EditorialPage>
    </>
  );
}
