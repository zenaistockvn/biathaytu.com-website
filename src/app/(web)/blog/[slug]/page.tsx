import { redirect } from 'next/navigation';

// Redirect /blog/[slug] to /kien-thuc/[slug] to prevent duplicate content
export default async function BlogSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/kien-thuc/${slug}`);
}
