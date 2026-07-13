import type { MetadataRoute } from 'next'

export const CLIENT_PWA_APP_NAME = 'Mlabelle Beauty'
export const CLIENT_PWA_SHORT_NAME = 'Mlabelle'
export const CLIENT_PWA_DESCRIPTION =
  'Réservez votre rendez-vous beauté en ligne chez Mlabelle Beauty.'

export const DASHBOARD_PWA_APP_NAME = 'Mlabelle Pro'
export const DASHBOARD_PWA_SHORT_NAME = 'Mlabelle Pro'
export const DASHBOARD_PWA_DESCRIPTION =
  'Gérez les réservations, les prestations et l’agenda Mlabelle Beauty.'

export const CLIENT_MANIFEST_PATH = '/manifest.webmanifest'
export const DASHBOARD_MANIFEST_PATH = '/dashboard-manifest.webmanifest'

export const PWA_APP_NAME = CLIENT_PWA_APP_NAME
export const PWA_SHORT_NAME = CLIENT_PWA_SHORT_NAME
export const PWA_DESCRIPTION =
  'Réservez votre rendez-vous beauté en ligne et gérez les réservations Mlabelle Beauty.'

const PWA_THEME_COLOR = '#1B1B18'
const PWA_BACKGROUND_COLOR = '#FFF8F0'

const clientManifestIcons: NonNullable<MetadataRoute.Manifest['icons']> = [
  {
    src: '/brand/mlabelle-icon-192.png',
    sizes: '192x192',
    type: 'image/png',
    purpose: 'any',
  },
  {
    src: '/brand/mlabelle-icon-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any',
  },
  {
    src: '/brand/mlabelle-icon-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  },
]

const dashboardManifestIcons: NonNullable<MetadataRoute.Manifest['icons']> = [
  {
    src: '/brand/mlabelle-pro-icon-192.png',
    sizes: '192x192',
    type: 'image/png',
    purpose: 'any',
  },
  {
    src: '/brand/mlabelle-pro-icon-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any',
  },
  {
    src: '/brand/mlabelle-pro-icon-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  },
]

export function getClientPwaManifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: CLIENT_PWA_APP_NAME,
    short_name: CLIENT_PWA_SHORT_NAME,
    description: CLIENT_PWA_DESCRIPTION,
    lang: 'fr',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: PWA_BACKGROUND_COLOR,
    theme_color: PWA_THEME_COLOR,
    categories: ['beauty', 'lifestyle', 'productivity'],
    icons: clientManifestIcons,
    shortcuts: [
      {
        name: 'Prendre rendez-vous',
        short_name: 'Réserver',
        description: 'Choisir une prestation et réserver un créneau.',
        url: '/#prestations-catalog',
        icons: [clientManifestIcons[0]],
      },
    ],
  }
}

export function getDashboardPwaManifest(): MetadataRoute.Manifest {
  return {
    id: '/dashboard',
    name: DASHBOARD_PWA_APP_NAME,
    short_name: DASHBOARD_PWA_SHORT_NAME,
    description: DASHBOARD_PWA_DESCRIPTION,
    lang: 'fr',
    dir: 'ltr',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: PWA_BACKGROUND_COLOR,
    theme_color: PWA_THEME_COLOR,
    categories: ['beauty', 'business', 'productivity'],
    icons: dashboardManifestIcons,
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'Voir le suivi des réservations.',
        url: '/dashboard',
        icons: [dashboardManifestIcons[0]],
      },
      {
        name: 'Agenda',
        short_name: 'Agenda',
        description: 'Ouvrir l’agenda de la coiffeuse.',
        url: '/agenda',
        icons: [dashboardManifestIcons[0]],
      },
    ],
  }
}

export function getPwaManifest(): MetadataRoute.Manifest {
  return getClientPwaManifest()
}
