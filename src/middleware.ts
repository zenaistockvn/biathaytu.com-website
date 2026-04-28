import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Next.js Middleware — bảo vệ routes bằng Supabase Auth session.
 * - Public: /login, /api/auth/*, /_next/*, favicon.ico, public assets
 * - Protected: tất cả route còn lại → redirect /login nếu chưa đăng nhập
 */

const PUBLIC_PATHS = [
  '/login', 
  '/api/auth', 
  '/api/revalidate',
  '/san-pham',
  '/kien-thuc',
  '/blog',
  '/thuong-hieu',
  '/lien-he'
];
const PUBLIC_EXTENSIONS = ['.ico', '.png', '.jpg', '.svg', '.webp', '.css', '.js'];

function isPublicPath(pathname: string): boolean {
  if (pathname === '/') return true; // Landing page is public
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return true;
  if (pathname.startsWith('/_next')) return true;
  if (PUBLIC_EXTENSIONS.some((ext) => pathname.endsWith(ext))) return true;
  // Allow cron and API routes that use their own auth
  if (pathname.startsWith('/api/cron')) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: Record<string, unknown> }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session — MUST be called before getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public routes — luôn cho qua
  if (isPublicPath(pathname)) {
    // Nếu đã login mà truy cập /login → redirect về AMC dashboard
    if (pathname === '/login' && user) {
      const url = request.nextUrl.clone();
      url.pathname = '/amc';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Protected routes (bao gồm /amc) — chưa login → redirect /login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
