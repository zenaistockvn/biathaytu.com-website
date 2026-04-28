import { redirect } from 'next/navigation';

// Redirect /blog to /kien-thuc to avoid duplicate content
export default function BlogPage() {
  redirect('/kien-thuc');
}
