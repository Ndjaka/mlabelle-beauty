import { describe, expect, it } from 'vitest'

import {
  getClientPwaManifest,
  getDashboardPwaManifest,
  getPwaManifest,
} from '@/features/pwa/utils'

const EXPECTED_CLIENT_APP_NAME = 'Mlabelle Beauty'
const EXPECTED_CLIENT_SHORT_NAME = 'Mlabelle'
const EXPECTED_CLIENT_START_URL = '/'
const EXPECTED_DASHBOARD_APP_NAME = 'Mlabelle Pro'
const EXPECTED_DASHBOARD_START_URL = '/dashboard'
const EXPECTED_PUBLIC_BOOKING_URL = '/#prestations-catalog'
const EXPECTED_DASHBOARD_URL = '/dashboard'
const EXPECTED_ANDROID_ICON = '/brand/mlabelle-icon-192.png'
const EXPECTED_LARGE_ICON = '/brand/mlabelle-icon-512.png'
const EXPECTED_PRO_ANDROID_ICON = '/brand/mlabelle-pro-icon-192.png'
const EXPECTED_PRO_LARGE_ICON = '/brand/mlabelle-pro-icon-512.png'

describe('getClientPwaManifest', () => {
  it('exposes installable metadata for clients', () => {
    const manifest = getClientPwaManifest()

    expect(manifest.id).toBe(EXPECTED_CLIENT_START_URL)
    expect(manifest.name).toBe(EXPECTED_CLIENT_APP_NAME)
    expect(manifest.short_name).toBe(EXPECTED_CLIENT_SHORT_NAME)
    expect(manifest.start_url).toBe(EXPECTED_CLIENT_START_URL)
    expect(manifest.scope).toBe(EXPECTED_CLIENT_START_URL)
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
      ])
    )
  })
})

describe('getDashboardPwaManifest', () => {
  it('exposes a distinct installable app for the hairdresser dashboard', () => {
    const manifest = getDashboardPwaManifest()

    expect(manifest.id).toBe(EXPECTED_DASHBOARD_URL)
    expect(manifest.name).toBe(EXPECTED_DASHBOARD_APP_NAME)
    expect(manifest.short_name).toBe(EXPECTED_DASHBOARD_APP_NAME)
    expect(manifest.start_url).toBe(EXPECTED_DASHBOARD_START_URL)
    expect(manifest.scope).toBe(EXPECTED_CLIENT_START_URL)
    expect(manifest.display).toBe('standalone')
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: EXPECTED_PRO_ANDROID_ICON,
          sizes: '192x192',
          type: 'image/png',
        }),
        expect.objectContaining({
          src: EXPECTED_PRO_LARGE_ICON,
          sizes: '512x512',
          type: 'image/png',
        }),
      ])
    )
    expect(manifest.shortcuts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: EXPECTED_DASHBOARD_URL }),
        expect.objectContaining({ url: '/agenda' }),
      ])
    )
  })
})

describe('getPwaManifest', () => {
  it('keeps the default manifest mapped to the client app', () => {
    expect(getPwaManifest()).toEqual(getClientPwaManifest())
  })
})
