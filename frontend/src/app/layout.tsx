import { AuthProvider } from '@/providers/AuthProvider'
import QueryProvider from '@/providers/QueryProvider'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Pet Arogya - Dog Health Management Platform',
  description: 'Manage your pet\'s health records, appointments, and more with Pet Arogya.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
