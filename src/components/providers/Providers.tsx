'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider, Session } from 'next-auth/react'
import { useState } from 'react'

export default function Providers({ 
  children,
  session
}: { 
  children: React.ReactNode
  session?: Session
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
} 