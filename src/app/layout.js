import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EMM ERP',
  description: 'Created By Favio Munayco',
}

/**
 * 
 * @param {*} param0 
 * @returns el layout de la app
 */
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}
      <Analytics />
      </body>
    </html>
  )
}
