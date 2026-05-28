import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('admin_token')

  // Jika tidak ada token atau token tidak valid, redirect ke login
  if (!token || token.value !== 'geto_admin_authorized') {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/dashboard/:path*',
}