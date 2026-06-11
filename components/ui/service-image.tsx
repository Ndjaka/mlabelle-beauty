'use client'

import Image, { type ImageLoaderProps } from 'next/image'
import { cn } from '@/lib/utils'

type ServiceImageProps = {
  className?: string
  imageUrl?: string | null
  label: string
  variant?: 'card' | 'md' | 'sm'
}

const variantClassNames = {
  card: 'aspect-[4/3] w-full',
  md: 'size-14',
  sm: 'size-12',
}

export function ServiceImage({
  className,
  imageUrl,
  label,
  variant = 'md',
}: ServiceImageProps) {
  const variantClassName = variantClassNames[variant]
  const iconClassName = variant === 'card' ? 'text-[32px]' : variant === 'sm' ? 'text-[20px]' : 'text-[24px]'

  if (imageUrl) {
    return (
      <Image
        loader={serviceImageLoader}
        src={imageUrl}
        alt={label}
        width={variant === 'card' ? 800 : 80}
        height={variant === 'card' ? 600 : 80}
        unoptimized
        className={cn(
          variantClassName,
          'shrink-0 border border-outline-variant object-cover',
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        variantClassName,
        'flex shrink-0 items-center justify-center border border-secondary/25 bg-primary text-secondary/75 shadow-sm',
        className
      )}
      aria-label={`Image de ${label}`}
    >
      <span className={cn('material-symbols-outlined leading-none', iconClassName)} aria-hidden="true">
        content_cut
      </span>
    </div>
  )
}

function serviceImageLoader({ src }: ImageLoaderProps): string {
  return src
}
