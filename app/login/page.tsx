import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AUTH_COOKIE_NAME, expectedAuthToken, safeNextPath } from '../../lib/auth'

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string; error?: string }>
}) {
  const params = searchParams ? await searchParams : undefined
  const nextPath = safeNextPath(params?.next ?? '/')
  const hasError = params?.error === '1'

  const cookieStore = await cookies()
  const currentCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const password = process.env.BRIEF_GATE_PASSWORD
  const secret = process.env.BRIEF_GATE_COOKIE_SECRET

  if (currentCookie && password && secret) {
    const expected = await expectedAuthToken()
    if (currentCookie === expected) {
      redirect(nextPath)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#ffffff',
          border: '1px solid #e8e5df',
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          padding: '2rem',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8a8278',
            marginBottom: '0.75rem',
            fontFamily: 'Helvetica Neue, sans-serif',
          }}
        >
          G Research House
        </div>
        <h1 style={{ margin: 0, fontWeight: 400, fontSize: '1.75rem', color: '#161616' }}>
          Sign in
        </h1>
        <p
          style={{
            marginTop: '0.75rem',
            marginBottom: '1.5rem',
            color: '#5e5a54',
            lineHeight: 1.6,
            fontFamily: 'Helvetica Neue, sans-serif',
          }}
        >
          Enter the shared password to view the private research site.
        </p>

        <form action="/api/login" method="post">
          <input type="hidden" name="next" value={nextPath} />
          <label
            htmlFor="password"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontFamily: 'Helvetica Neue, sans-serif',
              fontSize: '0.9rem',
              color: '#37332d',
            }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            required
            style={{
              width: '100%',
              boxSizing: 'border-box',
              border: '1px solid #d8d3cc',
              borderRadius: 10,
              padding: '0.85rem 1rem',
              fontSize: '1rem',
              marginBottom: '1rem',
              background: '#fcfbf9',
            }}
          />

          {hasError ? (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.8rem 1rem',
                borderRadius: 10,
                background: '#fff2f2',
                color: '#a11a1a',
                fontFamily: 'Helvetica Neue, sans-serif',
                fontSize: '0.9rem',
              }}
            >
              Wrong password.
            </div>
          ) : null}

          <button
            type="submit"
            style={{
              width: '100%',
              border: 0,
              borderRadius: 10,
              padding: '0.9rem 1rem',
              background: '#171717',
              color: '#fff',
              fontSize: '1rem',
              cursor: 'pointer',
              fontFamily: 'Helvetica Neue, sans-serif',
            }}
          >
            Continue
          </button>
        </form>
      </div>
    </main>
  )
}
