'use client'

import * as React from 'react'
import Link, { type LinkProps } from 'next/link'
import { cn } from '@/lib/utils'

type ButtonBaseProps = {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  animated?: boolean
  className?: string
  children: React.ReactNode
}

type ButtonElementProps = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

type ButtonLinkProps = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | 'href'> &
  Pick<LinkProps, 'href' | 'replace' | 'scroll' | 'prefetch'> & {
    disabled?: boolean
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
  }

export type ButtonProps = ButtonElementProps | ButtonLinkProps

function isLinkButtonProps(props: ButtonProps): props is ButtonLinkProps {
  return props.href !== undefined
}

function getLinkProps(props: ButtonLinkProps) {
  const linkProps: Partial<ButtonLinkProps> = { ...props }
  delete linkProps.className
  delete linkProps.variant
  delete linkProps.size
  delete linkProps.animated
  delete linkProps.children
  delete linkProps.disabled
  delete linkProps.href
  delete linkProps.onClick

  return linkProps as Omit<ButtonLinkProps, keyof ButtonBaseProps | 'disabled' | 'onClick'>
}

function getNativeButtonProps(props: ButtonElementProps) {
  const buttonProps: Partial<ButtonElementProps> = { ...props }
  delete buttonProps.className
  delete buttonProps.variant
  delete buttonProps.size
  delete buttonProps.animated
  delete buttonProps.children

  return buttonProps as React.ButtonHTMLAttributes<HTMLButtonElement>
}

export function Button(props: ButtonProps) {
  const {
    className,
    variant = 'primary',
    size = 'default',
    animated = false,
    children,
  } = props

  const content = animated ? (
    <>
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-secondary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out opacity-20" />
    </>
  ) : (
    children
  )

  const buttonClassName = cn(
    'inline-flex items-center justify-center rounded-none font-sans text-[12px] font-semibold uppercase tracking-[0.15em] text-center transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
    {
      'bg-tertiary text-white hover:bg-tertiary/90': variant === 'primary' && !animated,
      'bg-tertiary text-white hover:bg-tertiary/90 relative overflow-hidden group': variant === 'primary' && animated,
      'bg-transparent border border-secondary/40 text-foreground hover:border-secondary': variant === 'outline',
      'bg-transparent text-foreground/70 hover:text-secondary': variant === 'ghost',
      'py-4 px-6': size === 'default',
      'py-3 px-4 text-[10px]': size === 'sm',
      'py-5 px-8': size === 'lg',
    },
    className
  )

  if (isLinkButtonProps(props)) {
    const linkProps = getLinkProps(props)

    return (
      <Link
        {...linkProps}
        href={props.href}
        className={cn(buttonClassName, props.disabled && 'pointer-events-none opacity-50')}
        aria-disabled={props.disabled}
        tabIndex={props.disabled ? -1 : linkProps.tabIndex}
        onClick={(event) => {
          if (props.disabled) {
            event.preventDefault()
            return
          }

          props.onClick?.(event)
        }}
      >
        {content}
      </Link>
    )
  }

  return (
    <button className={buttonClassName} {...getNativeButtonProps(props)}>
      {content}
    </button>
  )
}

Button.displayName = "Button"
