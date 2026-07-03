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

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const getStory = () => {
    if (isSausage) {
      return "The Wurst là dòng xúc xích và thịt nguội thủ công kiểu Đức, phù hợp để làm món ăn kèm bia, vang, bữa gia đình hoặc bàn tiệc gọn tại nhà. Wiener dễ ăn và thơm khói, Thüringer hợp áp chảo hoặc nướng, còn Cold Cut tiện bày lạnh cùng bánh mì, phô mai và dưa chuột muối.";
    }
    if (productName.toLowerCase().includes('bitburger')) {
      return "Ra đời từ năm 1817 tại Bitburg, Đức, Bitburger là một trong những nhà máy bia gia đình lâu đời nhất và là thương hiệu bia tươi (draft beer) số 1 nước Đức. Với hơn 200 năm kinh nghiệm, Bitburger luôn tự hào tuân thủ Luật Tinh Khiết năm 1516 (Reinheitsgebot), chỉ sử dụng hoa bia cao cấp, mạch nha lúa mạch, nước tinh khiết và men bia độc quyền để tạo nên hương vị Pilsner hoàn hảo.";
    }
    if (productName.toLowerCase().includes('benediktiner')) {
      return "Được ủ theo công thức nguyên bản từ tu viện Ettal có lịch sử từ năm 1330, Benediktiner là dòng bia lúa mì cao cấp mang đậm dấu ấn giao thoa giữa nghệ thuật nấu bia thủ công và sự thanh tịnh. Việc áp dụng công nghệ lên men đặc biệt ngay tại hầm chứa Ettal giúp giữ trọn vẹn hương vị đặc trưng, đem đến trải nghiệm uống êm dịu, tinh tế và sâu lắng.";
    }
    return "Là một trong những sản phẩm bia nhập khẩu được tuyển chọn kỹ lưỡng, mang đến trải nghiệm hương vị Đức nguyên bản và chất lượng cao nhất cho người thưởng thức.";
  };

  const storageItems = isSausage
    ? [
        'Bảo quản lạnh theo hướng dẫn trên bao bì ngay sau khi nhận hàng.',
        'Không để sản phẩm lâu ngoài nhiệt độ phòng, đặc biệt trước khi chế biến hoặc bày tiệc.',
        'Nếu sản phẩm đã để đông, rã đông trong ngăn mát trước khi áp chảo hoặc nướng.',
      ]
    : [
        'Bảo quản ở nơi khô ráo, thoáng mát, tránh tiếp xúc trực tiếp với ánh nắng mặt trời.',
        'Nên giữ lạnh ở nhiệt độ 5 - 8 độ C (ngăn mát tủ lạnh) trước khi uống tối thiểu 24 giờ để bia đạt độ ngon tuyệt đối.',
        'Tuyệt đối tránh để bia bị sốc nhiệt (chuyển đột ngột từ nóng sang lạnh hoặc ngược lại) hay đóng băng trong ngăn đá.',
      ];

  const storageTitle = isSausage ? 'Hướng dẫn bảo quản lạnh' : 'Hướng dẫn bảo quản';
  const servingTitle = isSausage ? 'Cách dùng ngon nhất' : 'Cách thưởng thức ngon nhất';
  const servingItems = isSausage
    ? [
        'Wiener: làm nóng nhanh bằng áp chảo, nướng nhẹ hoặc làm nóng theo hướng dẫn trên bao bì.',
        'Thüringer Bratwurst: áp chảo hoặc nướng để dậy mùi thơm, hợp dùng cùng bia Đức, bánh mì, khoai tây và mù tạt.',
        'Combo Cold Cut: bày lạnh trực tiếp cùng bánh mì, phô mai, olive hoặc dưa chuột muối.',
      ]
    : [
        'Nhiệt độ lý tưởng: ướp lạnh bia từ 5 - 8 độ C.',
        'Tuyệt đối không dùng đá: Tránh uống cùng với đá lạnh để giữ nguyên độ tinh khiết và cấu trúc bọt nguyên bản của bia Đức.',
        'Sử dụng ly phù hợp: Nên dùng ly thủy tinh đã được làm lạnh. Ly phải sạch hoàn toàn, không có vết dầu mỡ để bọt bia có thể giữ được lâu.',
        'Nghệ thuật rót (Với dòng Weissbier/Lúa mì): Rót nghiêng ly 45 độ. Khi còn khoảng 2-3cm bia cuối chai, hãy lắc nhẹ chai theo vòng tròn để lớp men (Naturtrüb) chìm dưới đáy hòa quyện đều rồi mới rót nốt phần còn lại lên đỉnh ly để tạo lớp bọt vương miện tuyệt đẹp.',
      ];

  return (
    <div className="product-accordion" style={{ marginTop: '40px', borderTop: '1px solid var(--web-border)' }}>
      {/* Câu Chuyện Sản Phẩm */}
      <div className="accordion-item" style={{ borderBottom: '1px solid var(--web-border)' }}>
        <button 
          onClick={() => toggleSection('story')}
          style={{ width: '100%', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 600, color: 'var(--web-text)' }}
        >
          <span>📜 Câu chuyện sản phẩm</span>
          <span>{openSection === 'story' ? '−' : '+'}</span>
        </button>
        {openSection === 'story' && (
          <div style={{ paddingBottom: '20px', color: 'var(--web-text-muted)', lineHeight: '1.6' }}>
            {getStory()}
          </div>
        )}
      </div>

      {/* Hướng Dẫn Bảo Quản */}
      <div className="accordion-item" style={{ borderBottom: '1px solid var(--web-border)' }}>
        <button 
          onClick={() => toggleSection('storage')}
          style={{ width: '100%', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 600, color: 'var(--web-text)' }}
        >
          <span>🧊 {storageTitle}</span>
          <span>{openSection === 'storage' ? '−' : '+'}</span>
        </button>
        {openSection === 'storage' && (
          <div style={{ paddingBottom: '20px', color: 'var(--web-text-muted)', lineHeight: '1.6' }}>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {storageItems.map((item) => (
                <li key={item} style={{ marginBottom: '8px' }}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Cách Thưởng Thức */}
      <div className="accordion-item" style={{ borderBottom: '1px solid var(--web-border)' }}>
        <button 
          onClick={() => toggleSection('drink')}
          style={{ width: '100%', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 600, color: 'var(--web-text)' }}
        >
          <span>🍻 {servingTitle}</span>
          <span>{openSection === 'drink' ? '−' : '+'}</span>
        </button>
        {openSection === 'drink' && (
          <div style={{ paddingBottom: '20px', color: 'var(--web-text-muted)', lineHeight: '1.6' }}>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {servingItems.map((item) => (
                <li key={item} style={{ marginBottom: '8px' }}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
