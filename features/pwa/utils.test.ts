import { describe, expect, it } from 'vitest'

import { getPwaManifest } from '@/features/pwa/utils'

const EXPECTED_APP_NAME = 'Mlabelle Beauty'
const EXPECTED_SHORT_NAME = 'Mlabelle'
const EXPECTED_START_URL = '/'
const EXPECTED_PUBLIC_BOOKING_URL = '/#prestations-catalog'
const EXPECTED_DASHBOARD_URL = '/dashboard'
const EXPECTED_ANDROID_ICON = '/brand/mlabelle-icon-192.png'
const EXPECTED_LARGE_ICON = '/brand/mlabelle-icon-512.png'

describe('getPwaManifest', () => {
  it('exposes installable metadata for clients and the dashboard', () => {
    const manifest = getPwaManifest()

    expect(manifest.name).toBe(EXPECTED_APP_NAME)
    expect(manifest.short_name).toBe(EXPECTED_SHORT_NAME)
    expect(manifest.start_url).toBe(EXPECTED_START_URL)
    expect(manifest.scope).toBe(EXPECTED_START_URL)
    expect(manifest.display).toBe('standalone')
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: EXPECTED_ANDROID_ICON,
          sizes: '192x192',
          type: 'image/png',
        }),
        expect.objectContaining({
          src: EXPECTED_LARGE_ICON,
          sizes: '512x512',
          type: 'image/png',
        }),
      ])
    )
    expect(manifest.shortcuts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: EXPECTED_PUBLIC_BOOKING_URL }),
        expect.objectContaining({ url: EXPECTED_DASHBOARD_URL }),
      ])
    )
  })
})
