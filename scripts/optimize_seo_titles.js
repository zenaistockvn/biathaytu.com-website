const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/articles.json');

// Title mapping
const titleMap = {
  "Bia Thầy Tu Benediktiner Weissbier: Hương Vị Men Sống Nguyên Bản Từ Tu Viện Ettal": "Bia Thầy Tu Benediktiner: Vị Men Sống Từ Tu Viện Ettal",
  "Đạo Luật Tinh Khiết 1516: Tuyên Ngôn Đẳng Cấp Thượng Hạng Của Bia Đức Benediktiner Và Bitburger": "Đạo Luật Tinh Khiết 1516 Của Bia Đức Benediktiner",
  "So Sánh Bia Lúa Mì Benediktiner và Bia Pilsner Bitburger: Hai Thái Cực Thưởng Thức Khác Biệt": "So Sánh Bia Benediktiner Lúa Mì Và Pilsner Bitburger",
  "Bia Đen Tu Viện Benediktiner Dunkel: Sự Lôi Cuốn Từ Mạch Nha Rang Và Caramel Đậm Đà": "Bia Đen Benediktiner Dunkel: Hương Caramel Đậm Đà",
  "Bí Quyết Rót Bia Lúa Mì Chuẩn Chuyên Gia: Tại Sao Lại Lắc Nhẹ Đáy Chai?": "Bí Quyết Rót Bia Lúa Mì Chuẩn Chuyên Gia Đức",
  "Nghệ Thuật Chọn Bia Của Người Trưởng Thành: Đâu Là Lựa Chọn Xứng Tầm?": "Nghệ Thuật Chọn Bia Đức Cho Người Sành Sỏi",
  "Bản Giao Hưởng Hương Vị: Kết Hợp Bia Đức Benediktiner Cùng Ẩm Thực Việt Đương Đại": "Cách Kết Hợp Bia Benediktiner Với Món Ăn Việt",
  "Nghệ Thuật Rót Bia Lúa Mì: Tại Sao Benediktiner Lại Cần Góc Nghiêng 45 Độ?": "Cách Rót Bia Benediktiner Nghiêng 45 Độ Đúng Chuẩn",
  "Top 5 Cách Kết Hợp Bia Đức Với Ẩm Thực Việt Nam: Trải Nghiệm Bom 5L Benediktiner Tại Nhà": "Top 5 Món Việt Ăn Cùng Bom 5L Benediktiner",
  "Bitburger Premium Pils: Sức Hút Từ Vị Đắng Thanh Sảng Khoái Của Dòng Pilsner Số 1 Nước Đức": "Bitburger Premium Pils: Hương Vị Pilsner Số 1 Nước Đức"
};

// Normalize map keys for robust comparison
const normalizedTitleMap = {};
for (const [key, val] of Object.entries(titleMap)) {
  normalizedTitleMap[key.toLowerCase().trim()] = val;
}

try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const articles = JSON.parse(fileContent);

  let updatedTitlesCount = 0;
  let updatedKeywordsCount = 0;

  articles.forEach(article => {
    const origTitle = article.title || '';
    const cleanTitle = origTitle.trim();
    const normalizedTitle = cleanTitle.toLowerCase();

    // 1. Title Optimization
    if (normalizedTitleMap[normalizedTitle]) {
      const newTitle = normalizedTitleMap[normalizedTitle];
      if (article.title !== newTitle) {
        console.log(`Optimizing title for ID: ${article.id}`);
        console.log(`  Old: "${article.title}"`);
        console.log(`  New: "${newTitle}"`);
        article.title = newTitle;
        updatedTitlesCount++;
      }
    }

    // 2. Keywords Autofill (if array is empty or undefined)
    if (!article.keywords || article.keywords.length === 0) {
      const titleLower = (article.title || '').toLowerCase();
      const contentLower = (article.content || '').toLowerCase();
      
      let isWine = false;
      if (article.tenant_id === 'vangducnhapkhau') {
        isWine = true;
      } else if (article.tenant_id === 'biathaytu' || article.tenant_id === 'demo-tenant') {
        // If it's a beer tenant, only classify as wine if the title clearly targets wine (e.g. "vang", "riesling", "thörle") and DOES NOT contain "bia".
        if ((titleLower.includes('vang') || titleLower.includes('riesling') || titleLower.includes('thörle') || titleLower.includes('spätburgunder')) && !titleLower.includes('bia')) {
          isWine = true;
        }
      }

      let keywords = [];
      if (isWine) {
        keywords = ['rượu vang đức', 'vang đức nhập khẩu', 'mua rượu vang', 'vang đức cao cấp', 'rượu vang ngon'];
        if (titleLower.includes('thörle') || titleLower.includes('thorle') || contentLower.includes('thörle')) {
          keywords.push('rượu vang thörle');
        }
        if (titleLower.includes('riesling') || contentLower.includes('riesling')) {
          keywords.push('rượu vang riesling');
        }
      } else {
        // Beer keywords
        keywords = ['bia thầy tu', 'bia đức nhập khẩu', 'mua bia đức', 'bia đức cao cấp', 'bia lúa mì'];
        if (titleLower.includes('benediktiner') || contentLower.includes('benediktiner')) {
          keywords.push('bia benediktiner');
        }
        if (titleLower.includes('bitburger') || contentLower.includes('bitburger')) {
          keywords.push('bia bitburger');
        }
        if (titleLower.includes('schwarzbier') || titleLower.includes('köstritzer') || contentLower.includes('schwarzbier') || contentLower.includes('köstritzer')) {
          keywords.push('bia đen đức');
        }
      }

      article.keywords = keywords;
      console.log(`Filled keywords for ID: ${article.id} (${article.title.substring(0, 30)}...): [${keywords.join(', ')}]`);
      updatedKeywordsCount++;
    }
  });

  if (updatedTitlesCount > 0 || updatedKeywordsCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), 'utf8');
    console.log(`Successfully updated ${updatedTitlesCount} titles and filled keywords for ${updatedKeywordsCount} articles in local articles.json.`);
  } else {
    console.log("No updates needed in local articles.json.");
  }
} catch (error) {
  console.error("Error optimizing articles.json:", error);
  process.exit(1);
}
