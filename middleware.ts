import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET tidak ditemukan di environment variables.');
}
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('admin_session')?.value;

  // Jika mencoba mengakses halaman login tapi sudah punya sesi, arahkan ke dasbor
  if (pathname.startsWith('/admin/login') && sessionCookie) {
    try {
      await jwtVerify(sessionCookie, SECRET_KEY);
      // Jika token valid, redirect ke dasbor
      return NextResponse.redirect(new URL('/admin', request.url));
    } catch (err) {
      // Jika token tidak valid, biarkan saja untuk login ulang
    }
  }

  // Jika mencoba mengakses halaman admin yang terproteksi
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!sessionCookie) {
      // Jika tidak ada cookie, redirect ke halaman login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Verifikasi token
      await jwtVerify(sessionCookie, SECRET_KEY);
      // Jika token valid, lanjutkan ke halaman yang diminta
      return NextResponse.next();
    } catch (err) {
      // Jika token tidak valid, redirect ke halaman login
      console.log('Invalid token, redirecting to login.');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// Tentukan path mana saja yang akan dijalankan oleh middleware ini
export const config = {
  matcher: ['/admin/:path*', '/admin/login'],
};