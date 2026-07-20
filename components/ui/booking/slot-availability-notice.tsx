type SlotAvailabilityNoticeProps = {
  message: string | null
}

export function SlotAvailabilityNotice({ message }: SlotAvailabilityNoticeProps) {
  if (!message) return null

  return (
    <div role="alert" className="border border-error/25 bg-error/5 p-4 font-body-md text-[14px] leading-6 text-error">
      {message}
    </div>
  )
}
