import type { MetadataRoute } from 'next'

export const PWA_APP_NAME = 'Mlabelle Beauty'
export const PWA_SHORT_NAME = 'Mlabelle'
export const PWA_DESCRIPTION =
  'Réservez votre rendez-vous beauté en ligne et gérez les réservations Mlabelle Beauty.'

const PWA_THEME_COLOR = '#1B1B18'
const PWA_BACKGROUND_COLOR = '#FFF8F0'

const manifestIcons: NonNullable<MetadataRoute.Manifest['icons']> = [
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

export function getPwaManifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: PWA_APP_NAME,
    short_name: PWA_SHORT_NAME,
    description: PWA_DESCRIPTION,
    lang: 'fr',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: PWA_BACKGROUND_COLOR,
    theme_color: PWA_THEME_COLOR,
    categories: ['beauty', 'lifestyle', 'productivity'],
    icons: manifestIcons,
    shortcuts: [
      {
        name: 'Prendre rendez-vous',
        short_name: 'Réserver',
        description: 'Choisir une prestation et réserver un créneau.',
        url: '/#prestations-catalog',
        icons: [manifestIcons[0]],
      },
      {
        name: 'Dashboard coiffeuse',
        short_name: 'Dashboard',
        description: 'Accéder à l’espace de gestion des réservations.',
        url: '/dashboard',
        icons: [manifestIcons[0]],
      },
    ],
  }
}
