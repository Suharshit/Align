import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow access to marketing page, static files, and images
    if (
        pathname.startsWith('/marketing') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.') // naive check for files like favicon.ico, images
    ) {
        return NextResponse.next();
    }

    // Redirect everything else to marketing
    return NextResponse.redirect(new URL('/marketing', request.url));
}

export const config = {
    matcher: '/:path*',
};
