import Image from 'next/image'
import { cn } from '@/lib/utils'

type LogoTone = 'dark' | 'light' | 'copper'
type LogoSize = 'xs' | 'sm' | 'md' | 'lg'
type LogoVariant = 'wordmark' | 'emblem'

type LogoProps = {
  tone?: LogoTone
  size?: LogoSize
  variant?: LogoVariant
  priority?: boolean
  className?: string
}

const wordmarkSrcByTone: Record<LogoTone, string> = {
  dark: '/brand/mlabelle-logo-dark.png',
  light: '/brand/mlabelle-logo-light.png',
  copper: '/brand/mlabelle-logo-copper.png',
}

const emblemSrcByTone: Record<LogoTone, string> = {
  dark: '/brand/mlabelle-emblem-dark.png',
  light: '/brand/mlabelle-emblem-light.png',
  copper: '/brand/mlabelle-emblem-copper.png',
}

const wordmarkSizeClassNames: Record<LogoSize, string> = {
  xs: 'h-8 w-auto md:h-9',
  sm: 'h-10 w-auto md:h-11',
  md: 'h-12 w-auto md:h-14',
  lg: 'h-16 w-auto md:h-20',
}

const emblemSizeClassNames: Record<LogoSize, string> = {
  xs: 'h-16 w-auto',
  sm: 'h-20 w-auto',
  md: 'h-28 w-auto',
  lg: 'h-36 w-auto md:h-44',
}

export function Logo({
  tone = 'copper',
  size = 'md',
  variant = 'wordmark',
  priority = false,
  className,
}: LogoProps) {
  if (variant === 'emblem') {
    return (
      <Image
        src={emblemSrcByTone[tone]}
        alt="Mlabelle Beauty"
        width={875}
        height={809}
        priority={priority}
        className={cn('block object-contain', emblemSizeClassNames[size], className)}
      />
    )
  }

  return (
    <Image
      src={wordmarkSrcByTone[tone]}
      alt="Mlabelle Beauty"
      width={740}
      height={260}
      priority={priority}
      className={cn('block object-contain', wordmarkSizeClassNames[size], className)}
    />
  )
}
