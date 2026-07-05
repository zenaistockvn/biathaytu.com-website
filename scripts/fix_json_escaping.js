const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/articles.json');
try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Sửa các thẻ <a> chưa được escape thuộc tính rel hoặc target
  // Ví dụ: rel="noopener noreferrer" -> rel=\"noopener noreferrer\"
  content = content.replace(/rel="noopener noreferrer"/g, 'rel=\\"noopener noreferrer\\"');
  content = content.replace(/target="_blank"/g, 'target=\\"_blank\\"');
  
  // Ghi lại file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed unescaped rel/target attributes in articles.json');
  
  // Thử parse lại để xác minh
  JSON.parse(content);
  console.log('JSON parsed successfully! Syntax is now valid.');
} catch (error) {
  console.error('Error fixing JSON:', error);
}
