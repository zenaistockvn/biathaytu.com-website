const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, '../src/data/articles.json');

try {
  const fileContent = fs.readFileSync(articlesPath, 'utf8');
  const articles = JSON.parse(fileContent);

  let updatedCount = 0;
  const updatedArticles = articles.map(article => {
    if (article.tenant_id === 'demo-tenant') {
      updatedCount++;
      return {
        ...article,
        tenant_id: 'biathaytu'
      };
    }
    return article;
  });

  if (updatedCount > 0) {
    fs.writeFileSync(articlesPath, JSON.stringify(updatedArticles, null, 2) + '\n', 'utf8');
    console.log(`Successfully migrated ${updatedCount} articles to 'biathaytu' tenant.`);
  } else {
    console.log("No articles with tenant_id 'demo-tenant' found.");
  }
} catch (error) {
  console.error('Error during migration:', error);
  process.exit(1);
}
