const fs = require('fs');
const path = require('path');

// Target internal link mapping
const LINK_MAP = [
  { keyword: "Benediktiner Weissbier Dunkel", url: "/san-pham/benediktiner-dunkel-500ml" },
  { keyword: "Bitburger Premium Pils", url: "/san-pham/bitburger-premium-pils-330ml" },
  { keyword: "Köstritzer Schwarzbier", url: "/san-pham/kostritzer-schwarzbier-bom-5l" },
  { keyword: "Benediktiner Weissbier", url: "/san-pham/benediktiner-weissbier-naturtrub-500ml" },
  { keyword: "Benediktiner Naturtrüb", url: "/san-pham/benediktiner-weissbier-naturtrub-500ml" },
  { keyword: "Benediktiner Dunkel", url: "/san-pham/benediktiner-dunkel-500ml" },
  { keyword: "Weissbier Dunkel", url: "/san-pham/benediktiner-dunkel-500ml" },
  { keyword: "bom bia 5l", url: "/san-pham/bom-5l-benediktiner-weissbier" },
  { keyword: "Benediktiner", url: "/san-pham/benediktiner-weissbier-naturtrub-500ml" },
  { keyword: "Köstritzer", url: "/san-pham/kostritzer-schwarzbier-bom-5l" },
  { keyword: "Bitburger", url: "/san-pham/bitburger-premium-pils-330ml" },
  { keyword: "bom 5l", url: "/san-pham/bom-5l-benediktiner-weissbier" },
  { keyword: "Thüringer Bratwurst", url: "/san-pham/the-wurst-thuringer-bratwurst-500g" },
  { keyword: "xúc xích Bratwurst", url: "/san-pham/the-wurst-thuringer-bratwurst-500g" },
  { keyword: "Bratwurst", url: "/san-pham/the-wurst-thuringer-bratwurst-500g" },
  { keyword: "Wiener hun khói", url: "/san-pham/the-wurst-wiener-hun-khoi-500g" },
  { keyword: "xúc xích Wiener", url: "/san-pham/the-wurst-wiener-hun-khoi-500g" },
  { keyword: "Wiener", url: "/san-pham/the-wurst-wiener-hun-khoi-500g" },
  { keyword: "Combo Cold Cut", url: "/san-pham/the-wurst-combo-cold-cut-150g" }
];

// Sort LINK_MAP by keyword length in descending order to guarantee longest-match first
LINK_MAP.sort((a, b) => b.keyword.length - a.keyword.length);

// Helper to determine if a character is alphanumeric (including Vietnamese accented characters)
function isAlphanumeric(char) {
  if (!char) return false;
  return /[a-zA-Z0-9À-ỹĐđ]/.test(char);
}

// Injects internal links using a Single-pass Longest-Match-First algorithm on text nodes
function injectLinks(content) {
  let tokens = content.split(/(<[^>]+>)/g);
  let changed = false;
  
  // Track which keywords have been linked in the current article
  let linkedKeywords = new Set();
  let insideLink = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // If it's an HTML tag, trace if we enter or exit an anchor tag, then skip it
    if (token.startsWith('<')) {
      if (/^<a\b/i.test(token)) {
        insideLink = true;
      } else if (/^<\/a>/i.test(token)) {
        insideLink = false;
      }
      continue;
    }

    // If we are already inside a link, do not wrap anything.
    // Instead, register any existing keywords inside it to prevent duplicate links.
    if (insideLink) {
      for (const item of LINK_MAP) {
        const kw = item.keyword;
        const kwLen = kw.length;
        let idx = 0;
        const lowerToken = token.toLowerCase();
        const lowerKw = kw.toLowerCase();
        
        while ((idx = lowerToken.indexOf(lowerKw, idx)) !== -1) {
          const preceding = token[idx - 1];
          const succeeding = token[idx + kwLen];
          if (!isAlphanumeric(preceding) && !isAlphanumeric(succeeding)) {
            linkedKeywords.add(kw);
          }
          idx += kwLen;
        }
      }
      continue;
    }

    let newToken = "";
    let index = 0;

    // Single-pass scanning of the text node
    while (index < token.length) {
      let matched = false;

      // Check each keyword starting with the longest one
      for (const item of LINK_MAP) {
        const kw = item.keyword;
        const url = item.url;
        const kwLen = kw.length;

        // Check if keyword matches at the current pointer (case-insensitive)
        if (token.substr(index, kwLen).toLowerCase() === kw.toLowerCase()) {
          // Check word boundaries
          const preceding = token[index - 1];
          const succeeding = token[index + kwLen];

          if (!isAlphanumeric(preceding) && !isAlphanumeric(succeeding)) {
            matched = true;

            // Only link if this keyword hasn't been linked yet in this article
            if (!linkedKeywords.has(kw)) {
              const linkTag = `<a href="${url}" style="color:var(--web-gold-dark);font-weight:600;text-decoration:underline;">`;
              const closeTag = `</a>`;
              const matchText = token.substr(index, kwLen);

              newToken += linkTag + matchText + closeTag;
              linkedKeywords.add(kw);
              changed = true;
            } else {
              // If already linked, keep original text but still jump past it to avoid matching sub-keywords
              newToken += token.substr(index, kwLen);
            }

            index += kwLen;
            break; // Break the LINK_MAP loop to scan from the new index
          }
        }
      }

      // If no keyword matched at this position, move pointer by 1 character
      if (!matched) {
        newToken += token[index];
        index++;
      }
    }

    tokens[i] = newToken;
  }

  return { content: tokens.join(''), changed };
}

// Main execution
const articlesFilePath = path.join(__dirname, '../src/data/articles.json');
let articles = [];

try {
  articles = JSON.parse(fs.readFileSync(articlesFilePath, 'utf8'));
  console.log(`Loaded ${articles.length} articles from ${articlesFilePath}`);
} catch (error) {
  console.error(`Error reading ${articlesFilePath}:`, error);
  process.exit(1);
}

let updateCount = 0;
const updatedTitles = [];

for (let article of articles) {
  if (article.tenant_id === 'biathaytu') {
    const originalContent = article.content;
    const { content: newContent, changed } = injectLinks(originalContent);
    if (changed) {
      article.content = newContent;
      article.updated_at = new Date().toISOString();
      updateCount++;
      updatedTitles.push(article.title);
    }
  }
}

if (updateCount > 0) {
  try {
    fs.writeFileSync(articlesFilePath, JSON.stringify(articles, null, 2), 'utf8');
    console.log(`Successfully updated ${updateCount} articles in local articles.json`);
    console.log("Updated articles:");
    updatedTitles.forEach((title, idx) => console.log(`  ${idx + 1}. ${title}`));
  } catch (error) {
    console.error(`Error writing updated articles:`, error);
    process.exit(1);
  }
} else {
  console.log(`No articles needed updates.`);
}
