import { NextRequest, NextResponse } from 'next/server'
import {
  AUTH_COOKIE_NAME,
  buildAuthToken,
  getRequiredEnv,
  safeNextPath,
} from '../../../lib/auth'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const password = String(formData.get('password') || '')
  const nextPath = safeNextPath(String(formData.get('next') || '/'))

  const expectedPassword = getRequiredEnv('BRIEF_GATE_PASSWORD')
  const secret = getRequiredEnv('BRIEF_GATE_COOKIE_SECRET')

  if (password !== expectedPassword) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', '1')
    if (nextPath !== '/') loginUrl.searchParams.set('next', nextPath)
    return NextResponse.redirect(loginUrl)
  }

  const token = await buildAuthToken(expectedPassword, secret)
  const response = NextResponse.redirect(new URL(nextPath, request.url))
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return response
}
