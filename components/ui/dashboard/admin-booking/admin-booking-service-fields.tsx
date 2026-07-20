import { AdminBookingFormField } from '@/components/ui/dashboard/admin-booking/admin-booking-form-field'
import type { Service } from '@/types/service'

type AdminBookingServiceFieldsProps = {
  services: Service[]
  serviceId: string
  dateKey: string
  inputClassName: string
  onServiceChange: (value: string) => void
  onDateChange: (value: string) => void
}

export function AdminBookingServiceFields({
  services,
  serviceId,
  dateKey,
  inputClassName,
  onServiceChange,
  onDateChange,
}: AdminBookingServiceFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <AdminBookingFormField label="Prestation" htmlFor="admin-service">
        <select id="admin-service" required value={serviceId} onChange={(event) => onServiceChange(event.target.value)} className={inputClassName}>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>
      </AdminBookingFormField>
      <AdminBookingFormField label="Date" htmlFor="admin-date">
        <input id="admin-date" required type="date" value={dateKey} onChange={(event) => onDateChange(event.target.value)} className={inputClassName} />
      </AdminBookingFormField>
    </div>
  )
}
