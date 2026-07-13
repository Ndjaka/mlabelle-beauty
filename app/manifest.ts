import type { MetadataRoute } from 'next'

import { getPwaManifest } from '@/features/pwa/utils'

export default function manifest(): MetadataRoute.Manifest {
  return getPwaManifest()
}
