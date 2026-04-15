export const metadata = {
  title: 'Morning Brief',
  description: 'Daily market briefing',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Georgia, serif', background: '#fafaf8' }}>
        {children}
      </body>
    </html>
  )
}
