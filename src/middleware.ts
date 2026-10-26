import { NextRequest, NextResponse } from 'next/server';

function safeEqual(left: string, right: string): boolean {
  const encoder = new TextEncoder();
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  let difference = leftBytes.length ^ rightBytes.length;
  const length = Math.max(leftBytes.length, rightBytes.length);

  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return difference === 0;
}

export function middleware(request: NextRequest) {
  const username = process.env.STORE_ADMIN_USERNAME;
  const password = process.env.STORE_ADMIN_PASSWORD;

  if (!username || !password) {
    return new NextResponse('پنل مدیریت تا زمان تنظیم اطلاعات دسترسی فعال نیست.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  const authorization = request.headers.get('authorization');
  if (authorization?.startsWith('Basic ')) {
    try {
      const decoded = atob(authorization.slice(6));
      const separator = decoded.indexOf(':');
      const suppliedUsername = decoded.slice(0, separator);
      const suppliedPassword = separator < 0 ? '' : decoded.slice(separator + 1);
      if (separator >= 0 && safeEqual(suppliedUsername, username) && safeEqual(suppliedPassword, password)) {
        return NextResponse.next();
      }
    } catch {
      // Malformed Basic credentials are treated as an unauthenticated request.
    }
  }

  return new NextResponse('برای مشاهده‌ی پنل مدیریت وارد شوید.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Store admin", charset="UTF-8"',
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
