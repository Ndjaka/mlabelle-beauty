import { ServiceImage } from '@/components/ui/service-image'

type ServiceImagePreviewProps = {
  imageUrl?: string | null
  label: string
  size?: 'sm' | 'md'
}

export function ServiceImagePreview({
  imageUrl,
  label,
  size = 'md',
}: ServiceImagePreviewProps) {
  return <ServiceImage imageUrl={imageUrl} label={label} variant={size} />
}
