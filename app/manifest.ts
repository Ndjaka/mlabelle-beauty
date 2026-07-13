import type { MetadataRoute } from 'next'

import { getClientPwaManifest } from '@/features/pwa/utils'

export default function manifest(): MetadataRoute.Manifest {
  return getClientPwaManifest()
}
