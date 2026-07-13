import type { Metadata } from 'next'
import {
  DASHBOARD_MANIFEST_PATH,
  DASHBOARD_PWA_APP_NAME,
  DASHBOARD_PWA_DESCRIPTION,
  DASHBOARD_PWA_SHORT_NAME,
} from '@/features/pwa/utils'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  applicationName: DASHBOARD_PWA_APP_NAME,
  title: {
    absolute: 'Connexion — Mlabelle Pro',
  },
  description: DASHBOARD_PWA_DESCRIPTION,
  manifest: DASHBOARD_MANIFEST_PATH,
  appleWebApp: {
    capable: true,
    title: DASHBOARD_PWA_SHORT_NAME,
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/brand/mlabelle-pro-icon-512.png', type: 'image/png', sizes: '512x512' },
      { url: '/brand/mlabelle-pro-icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/brand/mlabelle-pro-apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col font-sans">
      <main className="flex-grow flex items-center justify-center w-full px-6 py-16">
        <div className="box-border w-full max-w-[480px] bg-white border border-[color:var(--neutral)] p-8 md:p-16 animate-fade-in-up shadow-[0_10px_40px_-10px_rgba(118,90,18,0.08)]">
          <div className="flex flex-col items-center text-center gap-6">
            <span
              className="material-symbols-outlined text-4xl text-[color:var(--secondary)]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>

            {/* Heading */}
            <div className="flex flex-col gap-2">
              <h1 className="font-serif text-[32px] md:text-[36px] leading-[1.2] md:leading-[1.3] text-[color:var(--foreground)]">
                Espace Coiffeuse
              </h1>
              <p className="font-sans text-base text-[color:var(--outline)] max-w-[280px] mx-auto leading-relaxed">
                Connectez-vous pour accéder à votre espace
              </p>
            </div>
            <div className="w-full mt-4">
              <LoginForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
