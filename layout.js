import { Exo_2 } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import { ToastProvider } from '@/contexts/ToastContext'
import AuthProvider from '@/contexts/AuthProvider'

const exo2 = Exo_2({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-exo2',
})

export const metadata = {
  title: 'Internship Management System',
  description: 'A platform for managing internships and applications',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${exo2.variable} font-exo2 bg-gray-100 dark:bg-gray-900`}>
        <AuthProvider>
          <ToastProvider>
            <Providers>
              {children}
            </Providers>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
