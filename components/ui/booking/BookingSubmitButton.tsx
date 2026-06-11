'use client'

import { Button } from '@/components/ui/button'

interface BookingSubmitButtonProps {
  isFormValid: boolean
  label: string
  loading: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
}

export function BookingSubmitButton({
  isFormValid,
  label,
  loading,
  onClick,
  type = 'submit',
}: BookingSubmitButtonProps) {
  return (
    <Button
      disabled={!isFormValid || loading}
      onClick={onClick}
      className="w-full tracking-[0.15em]"
      type={type}
    >
      {loading ? 'VALIDATION...' : label}
    </Button>
  )
}
