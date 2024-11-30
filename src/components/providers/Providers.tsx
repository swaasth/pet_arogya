'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'
import type { Session } from "next-auth"

interface ProvidersProps {
  children: React.ReactNode
  session: Session | null | undefined
}

export default function Providers({ 
  children,
  session
}: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          {children}
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
} 