'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { DashboardNavItem } from '@/types/dashboard'
import { cn } from '@/lib/utils'

type DashboardMobileMenuProps = {
  items: DashboardNavItem[]
}

export function DashboardMobileMenu({ items }: DashboardMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const hasOpened = useRef(false)

  useEffect(() => {
    if (!isOpen) {
      if (hasOpened.current) triggerRef.current?.focus()
      return
    }

    hasOpened.current = true
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="flex size-11 items-center justify-center border border-outline-variant bg-surface-container-low text-foreground"
        aria-label="Ouvrir le menu"
        aria-controls="dashboard-mobile-menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
          menu
        </span>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/35"
            aria-label="Fermer le menu en touchant l’arrière-plan"
            tabIndex={-1}
            onClick={() => setIsOpen(false)}
          />
          <aside
            id="dashboard-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu d’administration"
            className="absolute inset-y-0 right-0 flex w-[min(88vw,360px)] flex-col border-l border-outline-variant bg-background px-5 py-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-outline-variant pb-5">
              <div>
                <p className="label-caps text-secondary">Mlabelle Pro</p>
                <p className="mt-1 font-serif text-2xl text-foreground">Menu</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="flex size-11 items-center justify-center border border-outline-variant text-foreground"
                aria-label="Fermer le menu"
                onClick={() => setIsOpen(false)}
              >
                <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            <nav className="mt-6 flex flex-1 flex-col gap-2" aria-label="Toutes les rubriques">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 border border-transparent px-4 py-3 text-sm font-medium text-foreground/70',
                    item.active && 'border-secondary/40 bg-primary text-foreground'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>

            <p className="border-t border-outline-variant pt-5 text-xs leading-5 text-foreground/55">
              Espace privé de gestion Mlabelle Beauty
            </p>
          </aside>
        </div>
      ) : null}
    </>
  )
}
