"use client";

import { useState } from 'react';
import styles from './ProductDetailsAccordion.module.css';

interface ProductDetailsAccordionProps {
  productName: string;
  category?: string | null;
}

export default function ProductDetailsAccordion({
  productName,
  category,
}: ProductDetailsAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>('story');
  const isWine = category === 'vang';
  const isAccessory = category === 'phu-kien';
  const lowerName = productName.toLowerCase();

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const getStory = () => {
    if (lowerName.includes('bitburger')) {
      return "Ra đời từ năm 1817 tại Bitburg, Đức, Bitburger là nhà bia gia đình, nay do thế hệ thứ bảy của gia đình Simon điều hành. Với hơn 200 năm kinh nghiệm, Bitburger tuân thủ Luật Tinh Khiết năm 1516 (Reinheitsgebot), sử dụng hoa bia, mạch nha lúa mạch, nước tinh khiết và men bia để tạo nên phong cách Pilsner đặc trưng.";
    }
    if (lowerName.includes('benediktiner')) {
      return "Benediktiner được ủ tại Lich, bang Hessen, theo công thức gốc dòng Biển Đức, với men từ hầm tu viện Ettal. Tu viện Ettal ở Bavaria có từ năm 1330.";
    }
    if (isWine) {
      return "Các dòng vang Đức trên Bia Thầy Tu được tuyển chọn từ những nhà sản xuất thuộc vùng Rheinhessen, nổi bật với phong cách Riesling, Sauvignon Blanc và Spätburgunder giàu tính khoáng, acid cân bằng và hương vị thanh lịch.";
    }
    return "Sản phẩm được tuyển chọn kỹ lưỡng để mang đến trải nghiệm hương vị Đức nguyên bản và chất lượng cao cho người thưởng thức.";
  };

  const storageItems = isWine
      ? [
          'Bảo quản chai ở nơi khô ráo, tránh ánh nắng trực tiếp và nguồn nhiệt mạnh.',
          'Vang trắng nên được làm mát trước khi thưởng thức; vang đỏ nên phục vụ ở nhiệt độ phù hợp với từng phong cách.',
          'Sau khi mở chai, nên bảo quản lạnh và sử dụng trong thời gian hợp lý để giữ hương vị.',
        ]
      : [
          'Bảo quản ở nơi khô ráo, thoáng mát, tránh tiếp xúc trực tiếp với ánh nắng mặt trời.',
          'Giữ lạnh trước khi uống: Pilsner 4-6 °C, Weissbier 7-9 °C, Dunkel 8-10 °C.',
          'Tránh để bia bị sốc nhiệt hoặc đóng băng trong ngăn đá.',
        ];

  const servingItems = isWine
      ? [
          'Riesling và Sauvignon Blanc: phục vụ mát để làm nổi bật độ tươi và tính khoáng.',
          'Spätburgunder: có thể để chai nghỉ vài phút sau khi mở để hương trái cây và gia vị rõ hơn.',
          'Dùng ly vang sạch, không ám mùi và tránh rót quá đầy để giữ không gian cho hương thơm phát triển.',
        ]
      : [
          'Nhiệt độ phục vụ: Pilsner 4-6 °C, Weissbier 7-9 °C, Dunkel 8-10 °C, Festbier 6-8 °C.',
          'Không dùng đá để tránh làm loãng cấu trúc và hương vị của bia.',
          'Sử dụng ly sạch, phù hợp với phong cách bia để giữ bọt và hương thơm tốt hơn.',
          'Với Weissbier: rót nghiêng ly 45°, sau đó xoay nhẹ phần bia cuối chai để hòa lớp men tự nhiên trước khi rót nốt.',
        ];

  const pairingItems = (() => {
    if (isWine) {
      if (lowerName.includes('spätburgunder') || lowerName.includes('spatburgunder')) {
        return ['Steak và thịt nướng', 'Thịt vịt', 'Phô mai cứng'];
      }
      if (lowerName.includes('auslese')) {
        return ['Foie gras', 'Phô mai xanh', 'Món tráng miệng trái cây'];
      }
      return ['Hải sản', 'Cá nướng', 'Salad, sushi hoặc món khai vị nhẹ'];
    }
    if (lowerName.includes('dunkel')) {
      return ['Xúc xích nướng BBQ', 'Steak bò', 'Thịt cừu hoặc thịt quay'];
    }
    if (lowerName.includes('bitburger') || lowerName.includes('pils')) {
      return ['Gà nướng', 'Xúc xích Đức', 'Các món chiên hoặc BBQ'];
    }
    return ['Pretzel và phô mai', 'Hải sản hấp hoặc nướng', 'Xúc xích trắng và các món Bavaria'];
  })();

  const accessorySections = [
    {
      id: 'story',
      title: 'Về sản phẩm',
      content: <p>Phụ kiện chính hãng in logo Benediktiner, dùng kèm các dòng bia Benediktiner.</p>,
    },
    {
      id: 'storage',
      title: 'Sử dụng và vệ sinh',
      content: (
        <ul>
          <li>Rửa bằng nước ấm và nước rửa chén nhẹ, tráng sạch, để khô tự nhiên.</li>
          <li>Ly thủy tinh: tránh đổ nước sôi đột ngột vào ly đang lạnh.</li>
        </ul>
      ),
    },
  ];

  const sections = isAccessory ? accessorySections : [
    { id: 'story', title: 'Câu chuyện sản phẩm', content: <p>{getStory()}</p> },
    { id: 'pairing', title: 'Gợi ý Food Pairing', content: <ul>{pairingItems.map((item) => <li key={item}>{item}</li>)}</ul> },
    { id: 'storage', title: 'Hướng dẫn bảo quản', content: <ul>{storageItems.map((item) => <li key={item}>{item}</li>)}</ul> },
    { id: 'drink', title: 'Cách thưởng thức', content: <ul>{servingItems.map((item) => <li key={item}>{item}</li>)}</ul> },
  ];

  return (
    <div className={styles.accordion}>
      {sections.map((section) => (
        <div key={section.id} className={styles.item}>
          <button
            type="button"
            className={styles.toggle}
            onClick={() => toggleSection(section.id)}
            aria-expanded={openSection === section.id}
          >
            <span>{section.title}</span>
            <span aria-hidden="true">{openSection === section.id ? '−' : '+'}</span>
          </button>
          {openSection === section.id && (
            <div className={styles.panel}>
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
