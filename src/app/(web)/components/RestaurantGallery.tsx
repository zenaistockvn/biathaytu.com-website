import Image from 'next/image';
import { noBreak } from '@/lib/vn-text';
import styles from './RestaurantGallery.module.css';

export interface GalleryPhoto {
  src: string;
  alt: string;
  title: string;
  caption: string;
  floor: 1 | 2;
}

const RESTAURANT_PHOTOS: readonly GalleryPhoto[] = [
  // Tầng 1: Sảnh tiệc & Quầy biểu tượng German Taste
  {
    src: '/images/restaurant/tang-1-vom-chai-german-taste.jpg',
    alt: 'Quầy vòm chai rượu phát sáng German Taste tại tầng 1 nhà hàng',
    title: 'Vòm chai phát sáng German Taste',
    caption: 'Điểm nhấn kiến trúc độc bản với hình dáng chai phát sáng nổi bật trên nền vách đá tự nhiên và logo GT German Taste.',
    floor: 1,
  },
  {
    src: '/images/restaurant/tang-1-toan-canh-sanh-tiec.jpg',
    alt: 'Toàn cảnh không gian sảnh tiệc tầng 1 nhà hàng Bia Thầy Tu',
    title: 'Toàn cảnh sảnh tiệc tầng 1',
    caption: 'Bố trí hai dãy bàn tiệc gỗ sang trọng, ghế da êm ái cùng màn hình lớn phục vụ tiếp khách, sự kiện và họp mặt thân mật.',
    floor: 1,
  },
  {
    src: '/images/restaurant/tang-1-goc-ban-tiec-benediktiner.jpg',
    alt: 'Không gian bàn tiệc tầng 1 cùng tranh tường Benediktiner chính hãng',
    title: 'Bàn tiệc và tranh di sản Benediktiner',
    caption: 'Góc bàn tiệc ấm cúng điểm xuyết tranh tường Benediktiner "Tận hưởng từng khoảnh khắc" chính hãng từ nhà máy Đức.',
    floor: 1,
  },
  {
    src: '/images/restaurant/tang-1-quay-trung-bay-gt.jpg',
    alt: 'Cận cảnh quầy vòm trưng bày bia và rượu vang Đức tầng 1',
    title: 'Quầy trưng bày bia và rượu vang tầng 1',
    caption: 'Các dòng bia Benediktiner, Bitburger và vang Riesling Đức hảo hạng được sắp đặt trang trọng trên kệ đèn led.',
    floor: 1,
  },

  // Tầng 2: Phòng tiệc VIP & Không gian di sản Benediktiner
  {
    src: '/images/restaurant/phong-vip-benediktiner.jpg',
    alt: 'Không gian phòng VIP với bàn gỗ và tranh tu viện Benediktiner',
    title: 'Phòng tiệc VIP và di sản Benediktiner',
    caption: 'Bàn tiệc gỗ sồi 10-12 chỗ kết hợp cùng bộ tranh khắc gỗ tái hiện hơn 400 năm lịch sử tu viện Ettal miền nam nước Đức.',
    floor: 2,
  },
  {
    src: '/images/restaurant/ke-trung-bay-bia-thay-tu.jpg',
    alt: 'Kệ trưng bày bia Benediktiner và rượu vang Đức nhập khẩu',
    title: 'Kệ bia và rượu vang Đức chính hãng',
    caption: 'Tủ gỗ trưng bày sang trọng gắn đèn led với các thương hiệu Bitburger, Thörle, Rappenhof và thùng bia Benediktiner nguyên kiện.',
    floor: 2,
  },
  {
    src: '/images/restaurant/khong-gian-phong-vip.jpg',
    alt: 'Góc nhìn phòng VIP hướng về phía vòm đỏ và màn hình trình chiếu',
    title: 'Không gian tiệc vòm đỏ trang trọng',
    caption: 'Thiết kế vòm đỏ ấm cúng kết hợp màn hình lớn phục vụ tiếp khách đối tác, hội thảo doanh nghiệp hay tiệc thân mật.',
    floor: 2,
  },
  {
    src: '/images/restaurant/ban-tiec-tiep-khach.jpg',
    alt: 'Bàn tiệc dài tiếp khách riêng tư tại nhà hàng 26 Vạn Phúc',
    title: 'Bàn tiệc tiếp khách sang trọng',
    caption: 'Ghế bọc da êm ái, ánh sáng vàng dịu nhẹ tạo bầu không khí thư thái và phong thái lịch thiệp chuẩn châu Âu.',
    floor: 2,
  },
  {
    src: '/images/restaurant/setup-ban-an-tinh-te.jpg',
    alt: 'Chi tiết bài trí bàn tiệc chỉn chu với khăn ăn đỏ hoa sen',
    title: 'Nghệ thuật bài trí bàn tiệc chỉn chu',
    caption: 'Khăn ăn đỏ xếp hình hoa sen, đĩa chén sứ trắng và bộ dao thìa nĩa cao cấp sẵn sàng đón tiếp thực khách.',
    floor: 2,
  },
  {
    src: '/images/restaurant/ke-bia-nhap-khau.jpg',
    alt: 'Kệ trưng bày bia Đức và rượu vang nhập khẩu chính ngạch',
    title: 'Nguồn bia nhập khẩu chính ngạch',
    caption: 'Đầy đủ các dòng bia lúa mì Benediktiner vàng, đen và bom bia 5L được bảo quản trong điều kiện nhiệt độ tối ưu.',
    floor: 2,
  },
] as const;

interface RestaurantGalleryProps {
  floor?: 1 | 2;
}

export default function RestaurantGallery({ floor }: RestaurantGalleryProps) {
  const photos = floor ? RESTAURANT_PHOTOS.filter((p) => p.floor === floor) : RESTAURANT_PHOTOS;

  return (
    <ul className={styles.gallery}>
      {photos.map((item, index) => (
        <li key={item.src} className={styles.galleryItem}>
          <span className={styles.media}>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 959px) 50vw, 33vw"
              priority={index < 2}
              className={styles.image}
            />
          </span>
          <span className={styles.itemBody}>
            <h3 className={styles.itemTitle}>{noBreak(item.title)}</h3>
            <p className={styles.itemCaption}>{item.caption}</p>
          </span>
        </li>
      ))}
    </ul>
  );
}
