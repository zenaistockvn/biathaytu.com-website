# German Sausage Category On Product Page

## Goal

Add a dedicated sausage category to the existing product listing page so customers can buy The Wurst products alongside the current beer and accessory catalog. The section should use the product images, prices, and sales information from `C:\Users\QuangTran\Downloads\Giay phep xuc xic`.

## Scope

- Add three products:
  - Wiener - Xuc xich hun khoi, 500g, 139000 VND
  - Thuringer Bratwurst - Xuc xich nuong kieu Thuringen, 500g, 139000 VND
  - Combo Cold Cut thu cong kieu Duc, 150g, 139000 VND
- Show the products in a separate "Xuc xich Duc" section on the current `/san-pham` page.
- Reuse the existing product card and cart flow so customers can add to cart or buy now.
- Copy selected images from the source folder into the site's public image directory with stable web-friendly filenames.
- Keep the current beer and accessory sections intact.

## Page Placement

The new section will sit on `/san-pham` below the beer grid and above the accessories section. This keeps beer as the primary catalog while making sausage visible as a natural food pairing and add-on.

The section heading should be concise:

- Label: `Mon An Kem Bia`
- Title: `Xuc Xich Duc`
- Supporting copy: short copy about German-style sausage and cold cuts for beer, wine, family meals, and home parties.

## Data Model

The current storefront product filter only accepts `bia`, `vang`, and `phu-kien`. Add `xuc-xich` as a storefront category so sausage products can live in `src/data/products.json` and be handled like existing products.

Add a data helper:

- `getSausageProducts()`
- Returns products where `category === 'xuc-xich'`
- Sorted through the existing product sort order

Product fields will use the existing shape:

- `id`, `name`, `slug`
- `description`
- `volume`
- `images`
- `price`
- `category: "xuc-xich"`
- `sort_order`
- `is_featured: false`
- `origin: "Viet Nam, cong thuc/kieu Duc"`

The `abv` and `ibu` fields will stay `null` because these are food products.

## Product Copy

Use concise customer-facing copy from the sale kit:

- Wiener: easy-to-eat smoked sausage, mild flavor, quick to heat, good for family meals and beer pairing.
- Thuringer Bratwurst: German-style grilled sausage, aromatic when pan-seared or grilled, good for beer, BBQ, football, and weekend gatherings.
- Combo Cold Cut: German-style handmade cold cuts, ready to serve cold, good with bread, cheese, olives, pickles, beer, or wine.

Avoid internal sales-only language such as approved discount rules, cost, or price framing. The public page shows the listed retail price of 139000 VND for each item.

## Images

Use one clear product image per SKU from the source folder:

- Wiener: an image showing the blue package and served sausages.
- Thuringer: an image showing the package and plated/grilled sausages.
- Cold Cut: an image showing the cold cut package and sliced platter.

Images will be copied to `public/images/products/the-wurst/` with names like:

- `wiener-hun-khoi.png`
- `thuringer-bratwurst.png`
- `combo-cold-cut.png`

## UI Behavior

The existing `ProductCard` should be reused. Because sausage products do not have ABV or IBU values, only the volume tag should appear in the metadata area.

The product detail route `/san-pham/[slug]` should work through existing product lookup if the new products are included in the shared product data.

## Testing

Add/update focused tests so this category is not accidentally filtered out later:

- Product data includes the three sausage products.
- `getSausageProducts()` returns only `xuc-xich` products.
- Existing storefront product filters still include beer, wine, accessories, and now sausage.
- Product listing page can reference the sausage helper without breaking existing sections.

Run the existing test suite and a production build after implementation.

## Out Of Scope

- A new standalone sausage landing page.
- Discount or combo-pricing logic.
- Changes to checkout, order validation, delivery rules, or inventory.
- Publishing the internal sales script or FAQ text as public page content.
