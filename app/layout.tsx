import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const kanit = Kanit({ 
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
})

export const metadata: Metadata = {
  title: 'Facebook Groups Manager',
  description: 'Manage and view your Facebook groups',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="shortcut icon" href="/logo/logo.svg" />
      </head>
      <body className={`${kanit.variable} font-sans`}>
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" 
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  )
}
