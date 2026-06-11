import type { ReactNode } from 'react'

type ServiceFormFieldProps = {
  label: string
  htmlFor: string
  hint?: ReactNode
  children: ReactNode
}

export function ServiceFormField({
  label,
  htmlFor,
  hint,
  children,
}: ServiceFormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold uppercase text-foreground/70">
        {label}
        {hint && <span className="ml-2 font-normal normal-case text-foreground/50">{hint}</span>}
      </label>
      {children}
    </div>
  )
}
