// middleware.ts (در ریشه پروژه، کنار package.json)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // مثلاً ساده‌ترین middleware ممکن
  console.log("Middleware running for:", request.nextUrl.pathname);

  // اگر خواستی چیزی تغییر بده، مثلاً redirect
  // if (request.nextUrl.pathname === '/old-path') {
  //   return NextResponse.redirect(new URL('/new-path', request.url))
  // }

  // یا ادامه بده به درخواست اصلی
  return NextResponse.next();
}

// اختیاری: مسیرهایی که middleware باید اجرا شود
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
