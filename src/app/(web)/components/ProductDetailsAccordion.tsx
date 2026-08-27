"use client";

import { useState } from 'react';

interface ProductDetailsAccordionProps {
  productName: string;
  category?: string | null;
}

export default function ProductDetailsAccordion({
  productName,
  category,
}: ProductDetailsAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>('story');
  const isSausage = category === 'xuc-xich';
  const isWine = category === 'vang';
  const lowerName = productName.toLowerCase();

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const getStory = () => {
    if (isSausage) {
      return "The Wurst là dòng xúc xích và thịt nguội thủ công kiểu Đức, phù hợp để làm món ăn kèm bia, vang, bữa gia đình hoặc bàn tiệc gọn tại nhà. Wiener dễ ăn và thơm khói, Thüringer hợp áp chảo hoặc nướng, còn Cold Cut tiện bày lạnh cùng bánh mì, phô mai và dưa chuột muối.";
    }
    if (lowerName.includes('bitburger')) {
      return "Ra đời từ năm 1817 tại Bitburg, Đức, Bitburger là một trong những nhà máy bia gia đình lâu đời nhất nước Đức. Với hơn 200 năm kinh nghiệm, Bitburger tuân thủ Luật Tinh Khiết năm 1516 (Reinheitsgebot), sử dụng hoa bia, mạch nha lúa mạch, nước tinh khiết và men bia để tạo nên phong cách Pilsner đặc trưng.";
    }
    if (lowerName.includes('benediktiner')) {
      return "Được ủ theo công thức nguyên bản từ tu viện Ettal có lịch sử từ năm 1330, Benediktiner là dòng bia lúa mì cao cấp mang đậm dấu ấn giao thoa giữa nghệ thuật nấu bia thủ công và truyền thống Bavaria.";
    }
    if (isWine) {
      return "Các dòng vang Đức trên Bia Thầy Tu được tuyển chọn từ những nhà sản xuất thuộc vùng Rheinhessen, nổi bật với phong cách Riesling, Sauvignon Blanc và Spätburgunder giàu tính khoáng, acid cân bằng và hương vị thanh lịch.";
    }
    return "Sản phẩm được tuyển chọn kỹ lưỡng để mang đến trải nghiệm hương vị Đức nguyên bản và chất lượng cao cho người thưởng thức.";
  };

  const storageItems = isSausage
    ? [
        'Bảo quản lạnh theo hướng dẫn trên bao bì ngay sau khi nhận hàng.',
        'Không để sản phẩm lâu ngoài nhiệt độ phòng, đặc biệt trước khi chế biến hoặc bày tiệc.',
        'Nếu sản phẩm đã để đông, rã đông trong ngăn mát trước khi áp chảo hoặc nướng.',
      ]
    : isWine
      ? [
          'Bảo quản chai ở nơi khô ráo, tránh ánh nắng trực tiếp và nguồn nhiệt mạnh.',
          'Vang trắng nên được làm mát trước khi thưởng thức; vang đỏ nên phục vụ ở nhiệt độ phù hợp với từng phong cách.',
          'Sau khi mở chai, nên bảo quản lạnh và sử dụng trong thời gian hợp lý để giữ hương vị.',
        ]
      : [
          'Bảo quản ở nơi khô ráo, thoáng mát, tránh tiếp xúc trực tiếp với ánh nắng mặt trời.',
          'Nên giữ lạnh ở nhiệt độ 5 - 8°C trước khi uống để bia đạt trạng thái thưởng thức tốt.',
          'Tránh để bia bị sốc nhiệt hoặc đóng băng trong ngăn đá.',
        ];

  const storageTitle = isSausage ? 'Hướng dẫn bảo quản lạnh' : 'Hướng dẫn bảo quản';
  const servingTitle = isSausage ? 'Cách dùng ngon nhất' : 'Cách thưởng thức ngon nhất';
  const servingItems = isSausage
    ? [
        'Wiener: làm nóng nhanh bằng áp chảo hoặc nướng nhẹ.',
        'Thüringer Bratwurst: áp chảo hoặc nướng để dậy mùi thơm.',
        'Combo Cold Cut: bày lạnh trực tiếp cùng bánh mì, phô mai, olive hoặc dưa chuột muối.',
      ]
    : isWine
      ? [
          'Riesling và Sauvignon Blanc: phục vụ mát để làm nổi bật độ tươi và tính khoáng.',
          'Spätburgunder: có thể để chai nghỉ vài phút sau khi mở để hương trái cây và gia vị rõ hơn.',
          'Dùng ly vang sạch, không ám mùi và tránh rót quá đầy để giữ không gian cho hương thơm phát triển.',
        ]
      : [
          'Nhiệt độ lý tưởng: ướp lạnh bia từ 5 - 8°C.',
          'Không dùng đá để tránh làm loãng cấu trúc và hương vị của bia.',
          'Sử dụng ly sạch, phù hợp với phong cách bia để giữ bọt và hương thơm tốt hơn.',
          'Với Weissbier: rót nghiêng ly 45°, sau đó xoay nhẹ phần bia cuối chai để hòa lớp men tự nhiên trước khi rót nốt.',
        ];

  const pairingItems = (() => {
    if (isSausage) {
      return ['Bia Weissbier hoặc Pilsner Đức', 'Bánh mì, pretzel và mù tạt', 'Khoai tây, salad và dưa chuột muối'];
    }
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

  const sections = [
    { id: 'story', title: 'Câu chuyện sản phẩm', content: <p style={{ margin: 0 }}>{getStory()}</p> },
    { id: 'pairing', title: 'Gợi ý Food Pairing', content: <ul style={{ paddingLeft: '20px', margin: 0 }}>{pairingItems.map((item) => <li key={item} style={{ marginBottom: '8px' }}>{item}</li>)}</ul> },
    { id: 'storage', title: `${storageTitle}`, content: <ul style={{ paddingLeft: '20px', margin: 0 }}>{storageItems.map((item) => <li key={item} style={{ marginBottom: '8px' }}>{item}</li>)}</ul> },
    { id: 'drink', title: `${servingTitle}`, content: <ul style={{ paddingLeft: '20px', margin: 0 }}>{servingItems.map((item) => <li key={item} style={{ marginBottom: '8px' }}>{item}</li>)}</ul> },
  ];

  return (
    <div className="product-accordion" style={{ marginTop: '40px', borderTop: '1px solid var(--web-border)' }}>
      {sections.map((section) => (
        <div key={section.id} className="accordion-item" style={{ borderBottom: '1px solid var(--web-border)' }}>
          <button
            onClick={() => toggleSection(section.id)}
            aria-expanded={openSection === section.id}
            style={{ width: '100%', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 600, color: 'var(--web-text)', textAlign: 'left' }}
          >
            <span>{section.title}</span>
            <span aria-hidden="true">{openSection === section.id ? '−' : '+'}</span>
          </button>
          {openSection === section.id && (
            <div style={{ paddingBottom: '20px', color: 'var(--web-text-muted)', lineHeight: '1.6' }}>
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
