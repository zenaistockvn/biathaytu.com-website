const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../src/data/products.json');
const articlesPath = path.join(__dirname, '../src/data/articles.json');

try {
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
  
  console.log('=== AUDIT ẢNH SẢN PHẨM ===');
  const productAudit = [];
  products.forEach(p => {
    const images = p.images || [];
    let status = 'OK (Ảnh cục bộ)';
    let detail = '';
    
    if (images.length === 0) {
      status = '🔴 Thiếu ảnh';
    } else {
      const imgUrl = images[0];
      if (imgUrl.startsWith('http')) {
        status = '🟡 Dùng link CDN Haravan (online)';
        detail = imgUrl;
      }
      
      // Kiểm tra sự không nhất quán quy cách và tên ảnh
      const nameLower = p.name.toLowerCase();
      const imgLower = imgUrl.toLowerCase();
      if (nameLower.includes('330ml') && imgLower.includes('05l')) {
        status = '⚠️ Quy cách chưa chuẩn (Ảnh chai 0.5L cho sản phẩm 330ml)';
      }
      if (nameLower.includes('24 lon') && imgLower.includes('4x05l')) {
        status = '⚠️ Quy cách chưa chuẩn (Ảnh hộp 4 lon cho két 24 lon)';
      }
    }
    
    productAudit.push({
      name: p.name,
      images: images,
      status,
      detail
    });
  });
  
  productAudit.forEach((a, i) => {
    console.log(`${i+1}. ${a.name}`);
    console.log(`   Trạng thái: ${a.status}`);
    console.log(`   Đường dẫn: ${a.images.join(', ')}`);
  });

  console.log('\n=== AUDIT ẢNH BÀI VIẾT (THUMBNAIL) ===');
  const activeArticles = articles.filter(a => a.tenant_id === 'biathaytu' && a.status === 'published');
  let missingThumb = 0;
  
  activeArticles.forEach((a, i) => {
    if (!a.thumbnail_url) {
      missingThumb++;
      console.log(`- 🔴 Thiếu Thumbnail: ${a.title}`);
    } else {
      console.log(`- ✅ Có Thumbnail (${a.thumbnail_url}): ${a.title}`);
    }
  });
  
  console.log(`\nTổng số bài viết hoạt động: ${activeArticles.length}`);
  console.log(`Số bài viết thiếu ảnh thumbnail: ${missingThumb}`);
  
} catch (err) {
  console.error(err);
}
