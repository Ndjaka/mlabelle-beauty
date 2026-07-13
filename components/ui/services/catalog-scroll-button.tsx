'use client'

import type { MouseEvent, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

const CATALOG_ID = 'prestations-catalog'
const CATALOG_HREF = `/#${CATALOG_ID}`

interface CatalogScrollButtonProps {
  children: ReactNode
  className?: string
  size?: 'default' | 'sm' | 'lg'
  variant?: 'primary' | 'outline' | 'ghost'
}

export function CatalogScrollButton({
  children,
  className,
  size = 'default',
  variant = 'primary',
}: CatalogScrollButtonProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(CATALOG_ID)
    const isHomePage = window.location.pathname === '/'

    if (!isHomePage || !target) return

    event.preventDefault()
    window.history.pushState(null, '', CATALOG_HREF)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Button
      href={CATALOG_HREF}
      size={size}
      variant={variant}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Button>
  )
}
