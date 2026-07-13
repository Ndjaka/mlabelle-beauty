import type { Metadata } from 'next'
import {
  DASHBOARD_MANIFEST_PATH,
  DASHBOARD_PWA_APP_NAME,
  DASHBOARD_PWA_SHORT_NAME,
} from '@/features/pwa/utils'

export const metadata: Metadata = {
  applicationName: DASHBOARD_PWA_APP_NAME,
  title: {
    absolute: 'Réinitialisation — Mlabelle Pro',
  },
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

export default function ResetPage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl text-[color:var(--foreground)] mb-4">
          Bientôt disponible
        </h1>
        <p className="font-sans text-base text-[color:var(--outline)]">
          La réinitialisation du mot de passe sera bientôt disponible.
        </p>
      </div>
    </div>
  )
}
