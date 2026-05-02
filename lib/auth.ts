export const AUTH_COOKIE_NAME = 'brief_auth'
export const LOGIN_PATH = '/login'

export function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function buildAuthToken(password: string, secret: string): Promise<string> {
  return sha256Hex(`${secret}:${password}`)
}

export async function expectedAuthToken(): Promise<string> {
  return buildAuthToken(
    getRequiredEnv('BRIEF_GATE_PASSWORD'),
    getRequiredEnv('BRIEF_GATE_COOKIE_SECRET')
  )
}

export function safeNextPath(nextPath: string | null): string {
  if (!nextPath || !nextPath.startsWith('/')) return '/'
  if (nextPath.startsWith('//')) return '/'
  if (nextPath.startsWith('/login')) return '/'
  return nextPath
}
