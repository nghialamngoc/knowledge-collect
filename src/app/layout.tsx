import { Geist_Mono, Open_Sans } from 'next/font/google'
import './globals.css'
import WebVitals from './web-vitals'
import { ModalProvider } from '@/context/ModalContext'

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  return (
    <html lang={locale}>
      <body className={`${openSans.variable} ${geistMono.variable} antialiased`}>
        <WebVitals />
        <ModalProvider>{children}</ModalProvider>
      </body>
    </html>
  )
}
