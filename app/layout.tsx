import './globals.css'
import { Newsreader } from 'next/font/google'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
})

export const metadata = {
  title: 'G Research House',
  description: 'Private financial and AI research site',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={newsreader.variable}>
      <body style={{ margin: 0, fontFamily: 'Georgia, serif', background: '#faf8f2', color: '#171717' }}>
        {children}
      </body>
    </html>
  )
}
