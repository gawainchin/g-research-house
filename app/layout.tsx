import './globals.css'

export const metadata = {
  title: 'G Research House',
  description: 'Private financial and AI research site',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Georgia, serif', background: '#faf8f2', color: '#171717' }}>
        {children}
      </body>
    </html>
  )
}
