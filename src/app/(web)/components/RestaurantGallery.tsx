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
  // Tầng 1: Sảnh bàn tiệc và vòm chai German Taste
  {
    src: '/images/restaurant/tang-1-vom-chai-german-taste.jpg',
    alt: 'Vòm chai phát sáng có logo German Taste ở sảnh tầng 1 nhà hàng',
    title: 'Vòm chai phát sáng German Taste',
    caption: 'Vòm ốp đá, giữa là hình chai đèn trắng và logo GT German Taste. Hai bên là kệ vang Đức và biển Bitburger.',
    floor: 1,
  },
  {
    src: '/images/restaurant/tang-1-toan-canh-sanh-tiec.jpg',
    alt: 'Toàn cảnh sảnh tầng 1 nhà hàng Bia Thầy Tu',
    title: 'Toàn cảnh sảnh tầng 1',
    caption: 'Hai dãy bàn gỗ, ghế bọc da và màn hình lớn. Dùng cho bữa tiếp khách, sự kiện nhỏ hoặc họp mặt.',
    floor: 1,
  },
  {
    src: '/images/restaurant/tang-1-goc-ban-tiec-benediktiner.jpg',
    alt: 'Góc bàn tầng 1 cạnh poster Benediktiner chụp tu viện Ettal',
    title: 'Góc bàn cạnh poster Benediktiner',
    caption: 'Hai bàn gỗ cạnh vòm chai. Trên tường là poster Benediktiner chụp tu viện Ettal dưới chân núi Alps.',
    floor: 1,
  },
  {
    src: '/images/restaurant/tang-1-quay-trung-bay-gt.jpg',
    alt: 'Cận cảnh quầy vòm trưng bày bia và rượu vang Đức tầng 1',
    title: 'Quầy trưng bày bia và vang tầng 1',
    caption: 'Kệ đèn led bày vang Đức, bia Bitburger, Benediktiner và hộp quà Bitburger.',
    floor: 1,
  },

  // Tầng 2: Phòng riêng và tranh Benediktiner
  {
    src: '/images/restaurant/phong-vip-benediktiner.jpg',
    alt: 'Phòng riêng tầng 2 với bàn gỗ dài và bộ tranh đen trắng Benediktiner',
    title: 'Phòng riêng tầng 2',
    caption: 'Bàn gỗ dài 10 - 12 chỗ. Trên tường là bộ tranh đen trắng của Benediktiner vẽ các công đoạn làm bia, bức lớn ghi "Auf das gute Leben".',
    floor: 2,
  },
  {
    src: '/images/restaurant/ke-trung-bay-bia-thay-tu.jpg',
    alt: 'Kệ trưng bày bia Benediktiner và rượu vang Đức nhập khẩu',
    title: 'Kệ vang và bia Đức',
    caption: 'Tủ gỗ đèn led chia ngăn theo nhà sản xuất: Thörle, Rappenhof, Bitburger. Phía trước xếp thùng Benediktiner và Bitburger nguyên kiện.',
    floor: 2,
  },
  {
    src: '/images/restaurant/khong-gian-phong-vip.jpg',
    alt: 'Góc nhìn phòng riêng hướng về vòm đỏ và màn hình',
    title: 'Vòm đỏ và màn hình trong phòng riêng',
    caption: 'Cuối phòng là vòm đỏ có màn hình lớn, hai bên tủ vang. Dùng được cho buổi trình chiếu khi tiếp đối tác hay hội thảo nhỏ.',
    floor: 2,
  },
  {
    src: '/images/restaurant/ban-tiec-tiep-khach.jpg',
    alt: 'Bàn tiệc dài tiếp khách trong phòng riêng tại nhà hàng Ngõ 26 Vạn Phúc',
    title: 'Bàn dài tiếp khách',
    caption: 'Bàn gỗ dài, ghế bọc da, đèn vàng. Đủ chỗ cho một đoàn khách ngồi chung một bàn.',
    floor: 2,
  },
  {
    src: '/images/restaurant/setup-ban-an-tinh-te.jpg',
    alt: 'Bàn ăn bày sẵn với khăn ăn đỏ xếp hình hoa sen',
    title: 'Bàn bày sẵn trước giờ khách đến',
    caption: 'Khăn ăn đỏ xếp hình hoa sen, bát đĩa sứ trắng, đũa, dao, nĩa đặt sẵn từng chỗ.',
    floor: 2,
  },
  {
    src: '/images/restaurant/ke-bia-nhap-khau.jpg',
    alt: 'Kệ trưng bày bia Đức và rượu vang nhập khẩu chính ngạch',
    title: 'Bia và vang nhập khẩu chính ngạch',
    caption: 'Kệ vang Thörle, Rappenhof và Bitburger. Bên dưới là thùng bia Bitburger, Benediktiner vàng và đen do German Taste nhập khẩu.',
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
