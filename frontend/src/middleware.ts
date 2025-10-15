import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  // Protect admin/teacher/parent routes (basic cookie/session check placeholder)
  if (path.startsWith('/admin') || path.startsWith('/teacher') || path.startsWith('/parent')) {
    const role = req.cookies.get('role')?.value || '';
    if (path.startsWith('/admin') && role !== 'admin') return NextResponse.redirect(new URL('/', req.url));
    if (path.startsWith('/teacher') && role !== 'teacher') return NextResponse.redirect(new URL('/', req.url));
    if (path.startsWith('/parent') && role !== 'parent') return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/teacher:path*', '/parent:path*'],
};
