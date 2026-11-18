import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from './components/ClientLayout'

export const metadata: Metadata = {
  metadataBase: new URL('https://lilian-tau.vercel.app'),
  title: 'LILIAN | Хувцас, гутал, гоёл чимэглэл',
  description: 'Эмэгтэй хувцас, гутал, гоёл чимэглэлийн онлайн дэлгүүр. Улаанбаатар хотод 1–3 хоногт хүргэнэ.',
  openGraph: {
    title: 'LILIAN | Where elegance blooms',
    description: 'Хувцас, гутал, гоёл чимэглэлийн онлайн дэлгүүр.',
    url: '/',
    siteName: 'LILIAN',
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}