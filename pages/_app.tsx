import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Analytics />
      </AuthProvider>
    </ErrorBoundary>
  )
}