import DashboardLayout from '@/components/DashboardLayout';
import { getProducts, getSeoArticles } from '@/lib/data';
import BlogClient from './BlogClient';

export default async function BlogPage() {
  const [products, articles] = await Promise.all([
    getProducts(),
    getSeoArticles(),
  ]);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>📝 Blog SEO</h2>
        <p>AI viết bài SEO dài → tự động tách micro-content cho social media</p>
      </div>
      <BlogClient
        products={products}
        initialArticles={articles}
      />
    </DashboardLayout>
  );
}
