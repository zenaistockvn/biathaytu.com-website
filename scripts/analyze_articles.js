const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/articles.json');
try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const articles = JSON.parse(fileContent);
  
  console.log(`Total articles: ${articles.length}`);
  
  const tenants = {};
  const statusCounts = {};
  
  const list = [];
  
  articles.forEach((a, i) => {
    tenants[a.tenant_id] = (tenants[a.tenant_id] || 0) + 1;
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    
    // Check basic SEO elements
    const hasMetaDesc = !!a.meta_description && a.meta_description.trim().length > 0;
    const hasKeywords = Array.isArray(a.keywords) && a.keywords.length > 0;
    const wordCount = a.word_count || 0;
    
    // Check if content has H2, H3 tags
    const hasH2 = a.content.includes('<h2') || a.content.includes('##');
    const hasH3 = a.content.includes('<h3') || a.content.includes('###');
    
    // Check GEO SEO (Local indicators in content like "Hà Nội", "địa chỉ", "hotline", phone numbers, map links)
    const containsHanoi = /Hà\s+Nội/i.test(a.content) || /Hà\s+Nội/i.test(a.title);
    const containsHotline = /hotline|liên\s+hệ|điện\s+thoại|\d{9,11}/i.test(a.content);
    
    list.push({
      index: i + 1,
      id: a.id,
      title: a.title,
      slug: a.slug,
      tenant_id: a.tenant_id,
      status: a.status,
      word_count: wordCount,
      has_meta_desc: hasMetaDesc,
      has_keywords: hasKeywords,
      keywords: a.keywords || [],
      has_h2: hasH2,
      has_h3: hasH3,
      geo_check: {
        hanoi: containsHanoi,
        hotline: containsHotline
      }
    });
  });
  
  console.log('\n--- Tenants summary ---');
  console.log(JSON.stringify(tenants, null, 2));
  
  console.log('\n--- Status summary ---');
  console.log(JSON.stringify(statusCounts, null, 2));
  
  // Write to a temporary file for deep analysis
  fs.writeFileSync(path.join(__dirname, 'articles_audit_summary.json'), JSON.stringify({
    summary: {
      total: articles.length,
      tenants,
      statusCounts
    },
    articles: list
  }, null, 2));
  console.log('\nAudit details written to scripts/articles_audit_summary.json');
} catch (error) {
  console.error('Error reading/parsing articles.json:', error);
}
