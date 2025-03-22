import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ["/dashboard"];

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get("refreshToken")?.value;
    const isProtectedRoute = protectedRoutes.includes(pathname);

    if (!token && isProtectedRoute) {
        const url = new URL(`/`, request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    if (token && pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*"],
};