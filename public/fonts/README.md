# Font tự phục vụ

`roboto-serif-w125-latin.woff2` và `roboto-serif-w125-vietnamese.woff2` là Roboto Serif
(Google Fonts, giấy phép SIL Open Font License 1.1) đã cắt gọn cho tiêu đề của web:

- trục độ rộng `wdth` cố định ở 125 (khớp `--web-display-stretch` trong `src/app/web.css`);
- trục độ đậm `wght` giữ khoảng 600–700 (web chỉ dùng hai mức này);
- mỗi file giữ đúng bảng ký tự của phần latin và phần tiếng Việt mà Google Fonts chia sẵn.

Nguồn là hai file latin và vietnamese mà `next/font/google` tải về khi build với
`Roboto_Serif({ subsets: ['latin', 'vietnamese'], axes: ['wdth'] })`. Cắt bằng gói npm
`subset-font` (HarfBuzz):

```js
subsetFont(file, kyTuTheoUnicodeRange, {
  targetFormat: 'woff2',
  variationAxes: { wdth: 125, wght: { min: 600, max: 700, default: 600 } },
});
```

Khai báo `@font-face` ở `src/app/fonts.css`, preload ở `src/app/layout.tsx`.
Các file ở đây được cache một năm (`next.config.js`). Nếu tạo lại font thì đổi tên file,
ví dụ thêm hậu tố `-v2`, để trình duyệt không dùng bản cũ.

Muốn thêm độ đậm hoặc độ rộng khác thì phải cắt lại từ bản gốc; nếu không, trình duyệt sẽ tự
làm đậm hoặc nghiêng giả.
