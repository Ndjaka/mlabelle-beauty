'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type ServiceDescriptionProps = {
  description: string
}

export function ServiceDescription({ description }: ServiceDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const descriptionId = useId()
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (isExpanded) return

    const element = descriptionRef.current
    if (!element) return

    const updateOverflow = () => {
      setIsOverflowing(element.scrollHeight > element.clientHeight + 1)
    }

    updateOverflow()
    const observer = new ResizeObserver(updateOverflow)
    observer.observe(element)

    return () => observer.disconnect()
  }, [description, isExpanded])

  return (
    <div className="mt-1.5">
      <p
        ref={descriptionRef}
        id={descriptionId}
        className={cn(
          'font-sans text-[12px] leading-5 text-foreground/65 sm:text-[13px] xl:text-[14px] xl:leading-6',
          !isExpanded && 'line-clamp-3'
        )}
      >
        {description}
      </p>
      {isOverflowing || isExpanded ? (
        <button
          type="button"
          className="mt-1 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary underline-offset-4 hover:underline"
          aria-controls={descriptionId}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((currentValue) => !currentValue)}
        >
          {isExpanded ? 'Réduire' : 'Voir plus'}
        </button>
      ) : null}
    </div>
  )
}
