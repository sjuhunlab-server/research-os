import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research OS',
  description: 'Private research idea and context workspace',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
