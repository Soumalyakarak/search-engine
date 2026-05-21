import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/search") ||
    request.nextUrl.pathname.startsWith("/profile") ||   
    request.nextUrl.pathname.startsWith("/contests");    

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/search", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/search/:path*",
    "/profile/:path*",     
    "/contests/:path*",   
    "/login",
    "/signup",
  ],
};