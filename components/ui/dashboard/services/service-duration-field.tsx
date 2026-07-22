import { ServiceFormField } from '@/components/ui/dashboard/services/service-form-field'
import { formatServiceDurationHint } from '@/features/services/utils'

type ServiceDurationFieldProps = {
  inputClassName: string
  duration: string
  onDurationChange: (duration: string) => void
}

export function ServiceDurationField({
  inputClassName,
  duration,
  onDurationChange,
}: ServiceDurationFieldProps) {
  return (
    <ServiceFormField
      label="Durée (minutes)"
      htmlFor="duration"
      hint={formatServiceDurationHint(duration)}
    >
      <input
        id="duration"
        type="text"
        placeholder="ex: 90"
        value={duration}
        onChange={(event) => onDurationChange(event.target.value)}
        className={inputClassName}
      />
    </ServiceFormField>
  )
}
