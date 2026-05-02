import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, LOGIN_PATH, buildAuthToken } from './lib/auth'

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const cookieValue = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!cookieValue) return false

  const password = process.env.BRIEF_GATE_PASSWORD
  const secret = process.env.BRIEF_GATE_COOKIE_SECRET
  if (!password || !secret) {
    console.warn('Brief auth middleware missing env vars')
    return false
  }

  const expected = await buildAuthToken(password, secret)
  return cookieValue === expected
}

export async function middleware(request: NextRequest) {
  const authed = await isAuthenticated(request)
  if (authed) return NextResponse.next()

  const loginUrl = new URL(LOGIN_PATH, request.url)
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`
  loginUrl.searchParams.set('next', nextPath)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/', '/financial-research', '/ai-research', '/research/:path*'],
}
