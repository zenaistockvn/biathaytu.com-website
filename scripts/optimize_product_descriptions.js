const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      if (key === 'DATABASE_URL') {
        databaseUrl = val;
      }
    }
  });
}

if (!databaseUrl) {
  console.error('Error: DATABASE_URL not found');
  process.exit(1);
}

// Danh sách mô tả sản phẩm chi tiết chuẩn SEO/GEO
const productDescriptions = {
  // Bitburger Chai 330ml
  "Bitburger Premium Pils — Thùng 12 Chai 330ml": 
    "Bia Đức nhập khẩu chính hãng — Bitburger Premium Pils dạng thùng 12 chai thủy tinh 330ml. Dòng bia đắng (Pilsner) số 1 nước Đức được nấu từ hoa bia quý tộc Hallertau và nước nguồn tinh khiết vùng Eifel. Vị đắng thanh thoát rõ rệt, sảng khoái tột độ, hậu vị sạch sẽ. Thích hợp cho tiếp khách sang trọng, các bữa tiệc nướng BBQ tại Hà Nội. Ship hỏa tốc 2 giờ nội thành.",

  // Köstritzer Bom 5L
  "Köstritzer Schwarzbier Bom 5L":
    "Bia đen Đức nhập khẩu nguyên bom — Köstritzer Schwarzbier Bom 5L. Dòng bia đen huyền thoại lâu đời nhất nước Đức từ năm 1543. Sở hữu màu đen tuyền quyến rũ, lớp bọt mịn dày, hương thơm nồng nàn của mạch nha rang, cà phê và socola đen. Bom bia 5L có vòi rót tự động tiện lợi, là lựa chọn đẳng cấp cho các buổi tụ họp cuối tuần, tiệc nướng ngoài trời hoặc làm quà biếu tặng đối tác sang trọng tại Hà Nội.",

  // Festbier Két 24 lon 500ml
  "Benediktiner Festbier — Két 24 Lon 500ml":
    "Bia tu viện Đức nhập khẩu — Benediktiner Festbier két 24 lon 500ml. Phiên bản bia lễ hội đặc biệt của vùng Bavaria, ủ theo công thức cổ truyền của tu viện Ettal. Nồng độ cồn 5.8% ABV đậm đà, màu vàng hổ phách óng ả, hương vị hài hòa giữa vị ngọt của mạch nha chín và vị đắng nhẹ của hoa bia. Sản phẩm lý tưởng cho các buổi tiệc tùng, liên hoan và làm quà tặng ý nghĩa.",

  // Festbier Bom 5L
  "Benediktiner Festbier Bom 5L":
    "Bom bia lễ hội Đức nhập khẩu — Benediktiner Festbier Bom 5L. Dòng bia lễ hội đặc trưng vùng Bavaria với nồng độ 5.8% ABV đậm vị. Thiết kế bom 5L sang trọng có sẵn vòi rót tiện lợi, giữ lạnh lâu và tạo không khí tiệc tùng sảng khoái. Vị bia đầy đặn, mượt mà từ tu viện Ettal trứ danh. Thích hợp làm quà biếu cao cấp hoặc tiệc gia đình cuối tuần tại Hà Nội.",

  // Benediktiner Naturtrüb Chai 500ml
  "Benediktiner Naturtrüb — Thùng 12 Chai 500ml":
    "Bia lúa mì Đức tu viện Ettal — Benediktiner Weissbier Naturtrüb thùng 12 chai 500ml. Dòng bia vàng đục tự nhiên (không lọc) giữ nguyên men sống quý giá, đạt giải thưởng iTQi 3 Sao quốc tế. Hương vị mềm mại, creamy với hương chuối chín ngọt ngào và đinh hương dịu nhẹ. Thích hợp kết hợp với các món hải sản hấp, tôm nướng muối ớt. Phân phối chính hãng tại Tây Hồ, Hà Nội.",

  // Benediktiner Dunkel Chai 500ml
  "Benediktiner Dunkel — Thùng 12 Chai 500ml":
    "Bia đen lúa mì Đức tu viện — Benediktiner Dunkel thùng 12 chai 500ml. Được ủ dưới sự giám sát nghiêm ngặt của các thầy tu tu viện Ettal, Bavaria. Sở hữu màu nâu cánh gián đậm đà, bọt kem dày mịn, vị ngọt ngào từ caramel và mạch nha rang kết hợp tinh tế cùng hương chuối chín. Vị bia êm ái, trôi mượt qua cuống họng. Phù hợp cho bữa tiệc thịt nướng BBQ, sườn heo.",

  // Benediktiner Mix 12 Chai
  "Benediktiner Mix 2 Vị — Thùng 12 Chai 500ml":
    "Thùng bia Đức mix vị cao cấp — Thùng 12 chai 500ml gồm 6 chai Benediktiner Naturtrüb (bia vàng lúa mì) và 6 chai Benediktiner Dunkel (bia đen lúa mì). Bộ đôi hoàn hảo mang đến trải nghiệm đầy đủ hai thái cực hương vị tu viện Ettal trứ danh nước Đức. Món quà biếu sang trọng, đẳng cấp cho người sành bia ngoại tại Hà Nội. Hỗ trợ giao nhanh hỏa tốc.",

  // Benediktiner Naturtrüb Lon 500ml (Thùng 12 lon)
  "Benediktiner Naturtrüb — Thùng 12 Lon 500ml":
    "Bia lon lúa mì Đức chính hãng — Benediktiner Weissbier Naturtrüb thùng 12 lon 500ml. Phiên bản đóng lon tiện lợi, dễ dàng mang đi du lịch, dã ngoại. Hương vị bia lúa mì vàng đục tự nhiên nguyên bản từ tu viện Ettal, giữ trọn men sống thơm ngon. Nồng độ cồn 5.4% êm nhẹ, creamy vị chuối chín. Phân phối chính hãng, uy tín tại Hà Nội.",

  // Benediktiner Dunkel Lon 500ml (Thùng 12 lon)
  "Benediktiner Dunkel — Thùng 12 Lon 500ml":
    "Bia lon đen lúa mì Đức — Benediktiner Dunkel thùng 12 lon 500ml. Quy cách đóng lon 500ml tiện dụng, giữ trọn hương vị caramel đậm đà và mạch nha rang thơm nồng từ tu viện Ettal. Nồng độ 5.4% ABV dễ uống, hậu vị ngọt thanh sảng khoái. Đại lý bia nhập khẩu Tây Hồ cam kết hàng chính hãng 100%, có đầy đủ chứng nhận.",

  // Benediktiner Naturtrüb Bom 5L
  "Benediktiner Naturtrüb Bom 5L":
    "Bom bia lúa mì Đức cao cấp — Benediktiner Weissbier Naturtrüb Bom 5L. Dòng bia vàng đục tự nhiên đạt giải iTQi 3 Sao. Thiết kế bom 5L tiện lợi có vòi tự động gạt, giúp bạn trải nghiệm bia tươi tu viện Ettal ngay tại nhà. Vị bia creamy êm ái, hương trái cây chuối chín nồng nàn. Lựa chọn tuyệt vời cho tiệc tiếp khách, liên hoan gia đình.",

  // Benediktiner Naturtrüb Két 24 Lon 500ml
  "Benediktiner Naturtrüb — Két 24 Lon 500ml":
    "Bia két lúa mì Đức nhập khẩu — Benediktiner Weissbier Naturtrüb két 24 lon 500ml. Quy cách đóng két lớn tiết kiệm cho các bữa tiệc đông người, nhà hàng, khách sạn hoặc sự kiện. Hương vị lúa mì vàng đục tự nhiên nguyên bản từ tu viện Ettal, đạt chuẩn Luật Tinh Khiết 1516. Hậu vị ngọt thanh, bọt kem dày mịn cực kỳ sảng khoái.",

  // Benediktiner Dunkel Két 24 Lon 500ml
  "Benediktiner Dunkel — Két 24 Lon 500ml":
    "Bia két đen Đức tu viện — Benediktiner Dunkel két 24 lon 500ml. Két lớn 24 lon dành cho nhà hàng, khách sạn cao cấp hoặc các bữa tiệc nướng BBQ gia đình lớn. Hương caramel thơm nồng kết hợp mạch nha rang đậm vị, mang phong cách tu viện Ettal trứ danh. Đại lý bia nhập khẩu Hà Nội cam kết date mới, bảo quản lạnh tiêu chuẩn.",

  // Bitburger Lon 330ml (Két 24 lon)
  "Bitburger Premium Pils — Két 24 Lon 330ml":
    "Bia lon đắng Đức nhập khẩu — Bitburger Premium Pils két 24 lon 330ml. Dòng bia vàng Pilsner bán chạy nhất nước Đức. Sử dụng dòng hoa bia độc quyền Siegelhopfen và nước nguồn Eifel tinh khiết, mang lại vị đắng thanh thoát đặc trưng và kết thúc sảng khoái tột độ. Thích hợp cho các buổi liên hoan, BBQ ngoài trời sôi động.",

  // Bitburger Football Edition Két 24 lon 500ml
  "Bitburger Premium Pils Football Edition 2026 — Két 24 Lon 500ml":
    "Bia lon Đức phiên bản giới hạn — Bitburger Premium Pils Football Edition két 24 lon 500ml. Thiết kế lon lớn đặc biệt cho mùa bóng đá, mang tính sưu tầm cao. Vị đắng pilsner thanh sảng khoái nguyên bản nước Đức, giữ gas tốt. Sự kết hợp hoàn hảo cùng các món thịt nướng, steak, chả mực cho các buổi xem bóng đá tụ họp tại Hà Nội.",

  // Bitburger drive/alkoholfrei
  "Bitburger 0.0% Alkoholfrei — Két 24 Lon 330ml":
    "Bia không cồn nhập khẩu Đức — Bitburger 0.0% Alkoholfrei két 24 lon 330ml. Sử dụng công nghệ tách cồn chân không hiện đại giúp giữ nguyên vẹn hương vị hoa bia đắng thanh sảng khoái của dòng Pilsner truyền thống nhưng hoàn toàn không chứa cồn. Lựa chọn tuyệt vời cho người lái xe, tập thể thao, ăn kiêng hoặc trong các dịp xã giao.",

  // Bitburger draft lon 500ml
  "Bitburger Premium Pils":
    "Bia lon vàng Pilsner Đức — Bitburger Premium Pils lon 500ml lẻ. Dòng bia tươi (draft beer) trứ danh nước Đức nấu theo Luật Tinh Khiết 1516. Nổi bật với vị đắng thanh tao từ hoa bia Siegelhopfen, sủi tăm sành điệu, hậu vị sạch sẽ gọn gàng. Phù hợp thưởng thức lạnh ở 6-8°C cùng các món nướng đậm vị.",

  // Bitburger Bom 5L
  "Bitburger Premium Pils Bom 5L":
    "Bom bia tươi Đức nhập khẩu — Bitburger Premium Pils Bom 5L. Bom gạt vòi rót tiện lợi giúp mang không khí quầy bar bia tươi Đức về phòng khách nhà bạn. Vị đắng thanh thoát tươi mát từ hoa bia Hallertau tinh túy, lớp bọt trắng phau sủi tăm đẹp mắt. Thích hợp làm quà tặng thiết thực hoặc tiệc liên hoan cuối tuần tại Tây Hồ, Hà Nội."
};

async function run() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Neon Database.');

    // Bắt đầu Transaction để cập nhật an toàn
    await client.query('BEGIN');

    for (const [name, desc] of Object.entries(productDescriptions)) {
      const res = await client.query(
        "UPDATE products SET description = $1 WHERE name = $2 RETURNING id",
        [desc, name]
      );
      if (res.rows.length > 0) {
        console.log(`Updated description for: "${name}" (ID: ${res.rows[0].id})`);
      } else {
        console.warn(`Product not found in DB: "${name}"`);
      }
    }

    await client.query('COMMIT');
    console.log('Successfully updated all product descriptions in DB.');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to update product descriptions:', err);
  } finally {
    await client.end();
  }
}

run();
