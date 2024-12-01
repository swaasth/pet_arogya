import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers/Providers'
import NavbarWrapper from '@/components/layouts/NavbarWrapper'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pet Arogya - Modern Pet Health Management',
  description: 'Keep your furry friends healthy and happy with comprehensive health tracking and reminders',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <Providers session={session}>
          <div className="min-h-screen bg-background">
            <NavbarWrapper />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
