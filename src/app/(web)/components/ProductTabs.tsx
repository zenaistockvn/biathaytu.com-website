'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import { getTastingNotes } from '../utils/getTastingNotes';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  abv: string | null;
  ibu: number | null;
  volume: string | null;
  images: string[] | null;
  price: number | null;
  haravan_url: string | null;
  category: string | null;
  sort_order: number;
}

interface ProductTabsProps {
  products: Product[] | null;
}

type TabId = 'benediktiner' | 'bitburger' | 'vang' | 'xuc-xich' | 'phu-kien';

export default function ProductTabs({ products }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('benediktiner');

  if (!products) return null;

  // Group products
  const benediktinerBeers = products.filter(
    (p) => p.category === 'bia' && p.name.toLowerCase().includes('benediktiner')
  );
  
  const bitburgerAndOthers = products.filter(
    (p) =>
      p.category === 'bia' &&
      (p.name.toLowerCase().includes('bitburger') || p.name.toLowerCase().includes('kostritzer'))
  );

  const wineProducts = products.filter((p) => p.category === 'vang');
  const sausages = products.filter((p) => p.category === 'xuc-xich');
  const accessories = products.filter((p) => p.category === 'phu-kien');

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'benediktiner':
        return benediktinerBeers;
      case 'bitburger':
        return bitburgerAndOthers;
      case 'vang':
        return wineProducts;
      case 'xuc-xich':
        return sausages;
      case 'phu-kien':
        return accessories;
      default:
        return [];
    }
  };

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: 'benediktiner', label: 'Bia Benediktiner', count: benediktinerBeers.length },
    { id: 'bitburger', label: 'Bia Bitburger & Khác', count: bitburgerAndOthers.length },
    { id: 'vang', label: 'Rượu Vang Đức', count: wineProducts.length },
    { id: 'xuc-xich', label: 'Xúc Xích Đức', count: sausages.length },
    { id: 'phu-kien', label: 'Phụ Kiện', count: accessories.length },
  ];

  const currentProducts = getFilteredProducts();

  return (
    <div className="product-tabs-wrapper">
      {/* Navigation Tabs */}
      <div className="product-tabs-nav" role="tablist" aria-label="Phân loại sản phẩm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`product-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            aria-selected={activeTab === tab.id}
            role="tab"
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            <span className="tab-label">{tab.label}</span>
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Grid rendering products */}
      <div 
        id={`tabpanel-${activeTab}`}
        role="tabpanel" 
        aria-labelledby={`tab-${activeTab}`}
        className="grid-featured-products fade-in-active"
        key={activeTab} // Using key triggers CSS animation on tab change
      >
        {currentProducts.map((product) => {
          const isColdCutDeal = product.slug === 'the-wurst-combo-cold-cut-150g';
          let quickTags: string[] | undefined = undefined;
          let cardId: string | undefined = undefined;

          if (product.slug === 'the-wurst-wiener-hun-khoi-500g') {
            quickTags = ['500g/gói', 'Hun khói', 'Ăn kèm bia'];
          } else if (product.slug === 'the-wurst-thuringer-bratwurst-500g') {
            quickTags = ['500g/gói', 'Bratwurst', 'Nướng áp chảo'];
          } else if (isColdCutDeal) {
            quickTags = ['150g/combo', 'Cold cut', 'Combo 99K'];
            cardId = 'combo-cold-cut-99k';
          }

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              images={product.images}
              price={product.price}
              description={product.description?.substring(0, 80) || `"${getTastingNotes(product.name)}"`}
              abv={product.abv}
              ibu={product.ibu}
              volume={product.volume}
              haravan_url={product.haravan_url}
              category={product.category}
              highlightLabel={isColdCutDeal ? 'Ưu đãi còn 99K' : undefined}
              quickTags={quickTags}
              cardId={cardId}
              showCTA={true}
            />
          );
        })}
      </div>
      
      {currentProducts.length === 0 && (
        <div className="empty-tab-state">
          Đang cập nhật sản phẩm cho chuyên mục này.
        </div>
      )}
    </div>
  );
}
