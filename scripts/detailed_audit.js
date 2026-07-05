const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/articles.json');
try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const articles = JSON.parse(fileContent);
  
  // Filter active articles for the live site
  const activeArticles = articles.filter(a => (a.tenant_id === 'biathaytu' || a.tenant_id === 'demo-tenant') && a.status === 'published');
  
  console.log(`Auditing ${activeArticles.length} published articles for 'biathaytu/demo-tenant' (live site)...`);
  
  const report = [];
  
  activeArticles.forEach((a, index) => {
    const issues = [];
    const geoDetails = [];
    
    // 1. Title Audit
    const titleLength = a.title.length;
    if (titleLength < 40) issues.push(`Title too short (${titleLength} chars, recommended: 50-60)`);
    if (titleLength > 70) issues.push(`Title too long (${titleLength} chars, recommended: 50-60)`);
    
    // 2. Meta Description Audit
    const metaDesc = a.meta_description || '';
    const metaLength = metaDesc.length;
    if (!metaDesc) {
      issues.push('Missing Meta Description');
    } else {
      if (metaLength < 120) issues.push(`Meta Description too short (${metaLength} chars, recommended: 150-160)`);
      if (metaLength > 180) issues.push(`Meta Description too long (${metaLength} chars, recommended: 150-160)`);
    }
    
    // 3. Word Count Audit
    const wordCount = a.word_count || 0;
    if (wordCount === 0) {
      // Calculate word count from content if it is 0
      const cleanText = (a.content || '').replace(/<[^>]*>/g, ' ');
      const words = cleanText.trim().split(/\s+/).filter(w => w.length > 0);
      a.word_count = words.length;
    }
    
    if (a.word_count < 600) {
      issues.push(`Word count too low (${a.word_count} words, recommended: > 800)`);
    }
    
    // 4. Headings Audit (H2, H3)
    const hasH2 = a.content.includes('<h2') || a.content.includes('##');
    const hasH3 = a.content.includes('<h3') || a.content.includes('###');
    if (!hasH2) issues.push('Missing H2 tags');
    if (!hasH3) issues.push('Missing H3 tags (recommended for readability)');
    
    // 5. Internal & External Links Audit
    const linkMatches = a.content.match(/href="([^"]*)"/g) || [];
    const linkCount = linkMatches.length;
    let hasInternalLink = false;
    let hasExternalLink = false;
    
    linkMatches.forEach(linkStr => {
      const href = linkStr.match(/href="([^"]*)"/)[1];
      if (href.startsWith('/') || href.includes('biathaytu.com') || href.includes('tiepkhach.com')) {
        hasInternalLink = true;
      } else if (href.startsWith('http')) {
        hasExternalLink = true;
      }
    });
    
    if (linkCount === 0) {
      issues.push('No links in content (add internal links to products or other articles)');
    } else if (!hasInternalLink) {
      issues.push('No internal links in content');
    }
    
    // 6. Image Alt Tags Audit
    const imgMatches = a.content.match(/<img[^>]*>/g) || [];
    let missingAlt = false;
    imgMatches.forEach(imgTag => {
      if (!imgTag.includes('alt=')) {
        missingAlt = true;
      }
    });
    if (imgMatches.length > 0 && missingAlt) {
      issues.push('Images missing ALT attributes');
    }
    if (imgMatches.length === 0 && !a.thumbnail_url) {
      issues.push('No images in the article (missing thumbnail and inline images)');
    }
    
    // 7. GEO & Local SEO Elements Check
    const geoWords = [
      { term: 'Hà Nội', found: /Hà\s+Nội/i.test(a.content) },
      { term: 'TP.HCM|Sài Gòn', found: /TP\.?HCM|Sài\s+Gòn/i.test(a.content) },
      { term: 'Tây Hồ|Lạc Long Quân', found: /Tây\s+Hồ|Lạc\s+Long\s+Quân/i.test(a.content) },
      { term: 'Địa chỉ|Cửa hàng|Showroom', found: /địa\s+chỉ|cửa\s+hàng|showroom/i.test(a.content) },
      { term: 'Hotline|Số điện thoại|Liên hệ', found: /hotline|liên\s+hệ|điện\s+thoại|\d{9,11}/i.test(a.content) }
    ];
    
    const geoScore = geoWords.filter(g => g.found).length;
    geoWords.forEach(g => {
      if (g.found) geoDetails.push(g.term);
    });
    
    // 8. Keyword Optimization
    let kwOptimization = 'None';
    if (a.keywords && a.keywords.length > 0) {
      let keywordsFound = 0;
      a.keywords.forEach(kw => {
        const regex = new RegExp(kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
        if (regex.test(a.content) || regex.test(a.title)) {
          keywordsFound++;
        }
      });
      kwOptimization = `${keywordsFound}/${a.keywords.length} keywords found in content/title`;
    }
    
    report.push({
      index: index + 1,
      id: a.id,
      title: a.title,
      slug: a.slug,
      word_count: a.word_count,
      link_count: linkCount,
      has_thumbnail: !!a.thumbnail_url,
      keywords: a.keywords || [],
      kw_optimization: kwOptimization,
      geo_score: geoScore,
      geo_details: geoDetails,
      issues: issues
    });
  });
  
  // Categorize topics
  const topics = {
    'Bia Thầy Tu / Ettal / Benediktiner': [],
    'Bia Đức nói chung / Bitburger / Khác': [],
    'Vang / Đồ uống khác': [],
    'Không rõ / Khác': []
  };
  
  report.forEach(r => {
    const text = (r.title + ' ' + r.keywords.join(' ')).toLowerCase();
    if (text.includes('thầy tu') || text.includes('benediktiner') || text.includes('ettal') || text.includes('lúa mì') || text.includes('weissbier')) {
      topics['Bia Thầy Tu / Ettal / Benediktiner'].push(r);
    } else if (text.includes('bia đức') || text.includes('bitburger') || text.includes('köstritzer') || text.includes('pilsner') || text.includes('schwarzbier') || text.includes('bia')) {
      topics['Bia Đức nói chung / Bitburger / Khác'].push(r);
    } else if (text.includes('vang') || text.includes('riesling') || text.includes('thörle') || text.includes('spätburgunder')) {
      topics['Vang / Đồ uống khác'].push(r);
    } else {
      topics['Không rõ / Khác'].push(r);
    }
  });
  
  // Write detailed report
  fs.writeFileSync(path.join(__dirname, 'detailed_audit_report.json'), JSON.stringify({
    summary: {
      total: report.length,
      topics_counts: {
        'Bia Thầy Tu / Benediktiner / Lúa mì': topics['Bia Thầy Tu / Ettal / Benediktiner'].length,
        'Bia Đức / Pilsner / Khác': topics['Bia Đức nói chung / Bitburger / Khác'].length,
        'Vang': topics['Vang / Đồ uống khác'].length,
        'Khác': topics['Không rõ / Khác'].length
      },
      average_word_count: Math.round(report.reduce((acc, r) => acc + r.word_count, 0) / report.length),
      average_geo_score: (report.reduce((acc, r) => acc + r.geo_score, 0) / report.length).toFixed(1),
      perfect_seo_count: report.filter(r => r.issues.length === 0).length
    },
    topics,
    all_articles: report
  }, null, 2));
  
  console.log('\nAudit complete! Check scripts/detailed_audit_report.json for details.');
  console.log(`Average word count: ${Math.round(report.reduce((acc, r) => acc + r.word_count, 0) / report.length)}`);
  console.log(`Average GEO Score (out of 5): ${(report.reduce((acc, r) => acc + r.geo_score, 0) / report.length).toFixed(1)}`);
  console.log(`Topic Distribution:`);
  console.log(`  - Bia Thầy Tu / Benediktiner / Lúa mì: ${topics['Bia Thầy Tu / Ettal / Benediktiner'].length}`);
  console.log(`  - Bia Đức / Pilsner / Khác: ${topics['Bia Đức nói chung / Bitburger / Khác'].length}`);
  console.log(`  - Vang: ${topics['Vang / Đồ uống khác'].length}`);
  console.log(`  - Khác: ${topics['Không rõ / Khác'].length}`);
  
} catch (error) {
  console.error('Error conducting detailed audit:', error);
}
