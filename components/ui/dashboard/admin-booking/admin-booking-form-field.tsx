import type { ReactNode } from 'react'

type AdminBookingFormFieldProps = {
  label: string
  htmlFor: string
  children: ReactNode
}

export function AdminBookingFormField({
  label,
  htmlFor,
  children,
}: AdminBookingFormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold uppercase text-foreground/70">
        {label}
      </label>
      {children}
    </div>
  )
}
