import DashboardLayout from '@/components/DashboardLayout';
import { getProducts, getImagePrompts, getBrandDNA, getAdPlatformSpecs, getAdAngles, getContentTips } from '@/lib/data';
import StudioClientWrapper from './StudioClient';

export default async function StudioPage() {
  const [products, imagePrompts, brandDNA, adSpecs, adAngles, contentTips] = await Promise.all([
    getProducts(),
    getImagePrompts(),
    getBrandDNA(),
    getAdPlatformSpecs(),
    getAdAngles(),
    getContentTips(),
  ]);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>AI Studio</h2>
        <p>Trung tâm sáng tạo nội dung tự động với Gemini và Claude</p>
      </div>

      <StudioClientWrapper
        products={products}
        imagePrompts={imagePrompts}
        brandDNA={brandDNA}
        adSpecs={adSpecs}
        adAngles={adAngles}
        contentTips={contentTips}
      />
    </DashboardLayout>
  );
}
