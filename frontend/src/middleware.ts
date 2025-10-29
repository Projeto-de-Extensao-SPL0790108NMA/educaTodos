import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js|txt|map)$/);

  if (isPublic) return NextResponse.next();

  const hasAccess = req.cookies.get("access")?.value;

  if (!hasAccess) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    if (pathname !== "/") url.searchParams.set("from", pathname + search);
    return NextResponse.redirect(url);
  }

  if (hasAccess && pathname === "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon|public).*)"],
};
