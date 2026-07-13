import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import {
  DASHBOARD_MANIFEST_PATH,
  DASHBOARD_PWA_APP_NAME,
  DASHBOARD_PWA_DESCRIPTION,
  DASHBOARD_PWA_SHORT_NAME,
} from '@/features/pwa/utils'
import { getCurrentAuthUser } from '@/features/auth/queries'
import { isAdminUser } from '@/features/auth/utils'

export const metadata: Metadata = {
  applicationName: DASHBOARD_PWA_APP_NAME,
  title: {
    absolute: 'Dashboard — Mlabelle Pro',
    template: '%s | Mlabelle Pro',
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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentAuthUser()

  if (!isAdminUser(user)) {
    redirect('/login')
  }

  return <>{children}</>
}
