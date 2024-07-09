import { NextResponse } from 'next/server'


export async function middleware(request) {

    if(request.nextUrl.pathname === '/users') {
        return NextResponse.redirect(new URL('/', request.url))
    }
}

export const config = {
    matcher: '/users/:path*'
}