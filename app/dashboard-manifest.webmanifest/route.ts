import { NextResponse } from 'next/server'

import { getDashboardPwaManifest } from '@/features/pwa/utils'

export function GET() {
  return NextResponse.json(getDashboardPwaManifest(), {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  })
}
