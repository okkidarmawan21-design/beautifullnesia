import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beautifulnesia',
  description: 'Panduan wisata Indonesia terpercaya',
  verification: {
    google: 'zaFQ8xnx3V1-V9L6yuXrIZxBzQwp2rpaYaGd-hkfZDQ', // ← paste kode dari Google di sini
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-[#f8f9fa] text-[#2b3437]">
        {children}
      </body>
    </html>
  )
}
