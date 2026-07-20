import { AdminBookingFormField } from '@/components/ui/dashboard/admin-booking/admin-booking-form-field'

type AdminBookingClientFieldsProps = {
  clientName: string
  clientEmail: string
  clientPhone: string
  inputClassName: string
  onClientNameChange: (value: string) => void
  onClientEmailChange: (value: string) => void
  onClientPhoneChange: (value: string) => void
}

export function AdminBookingClientFields({
  clientName,
  clientEmail,
  clientPhone,
  inputClassName,
  onClientNameChange,
  onClientEmailChange,
  onClientPhoneChange,
}: AdminBookingClientFieldsProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminBookingFormField label="Nom client" htmlFor="admin-client-name">
          <input id="admin-client-name" required value={clientName} onChange={(event) => onClientNameChange(event.target.value)} className={inputClassName} />
        </AdminBookingFormField>
        <AdminBookingFormField label="E-mail client" htmlFor="admin-client-email">
          <input id="admin-client-email" required type="email" value={clientEmail} onChange={(event) => onClientEmailChange(event.target.value)} className={inputClassName} />
        </AdminBookingFormField>
      </div>
      <AdminBookingFormField label="Téléphone" htmlFor="admin-client-phone">
        <input id="admin-client-phone" type="tel" value={clientPhone} onChange={(event) => onClientPhoneChange(event.target.value)} className={inputClassName} />
      </AdminBookingFormField>
    </>
  )
}
