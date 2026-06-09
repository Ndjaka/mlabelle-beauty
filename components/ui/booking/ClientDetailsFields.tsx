'use client'

interface ClientDetailsFieldsProps {
  formData: {
    email: string
    firstName: string
    lastName: string
    phone: string
  }
  idSuffix: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function ClientDetailsFields({
  formData,
  idSuffix,
  onChange,
}: ClientDetailsFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id={`prenom-${idSuffix}`}
          label="Prénom *"
          name="firstName"
          onChange={onChange}
          required
          value={formData.firstName}
        />
        <FormInput
          id={`nom-${idSuffix}`}
          label="Nom *"
          name="lastName"
          onChange={onChange}
          required
          value={formData.lastName}
        />
      </div>
      <FormInput
        id={`email-${idSuffix}`}
        label="Email *"
        name="email"
        onChange={onChange}
        required
        type="email"
        value={formData.email}
      />
      <FormInput
        id={`telephone-${idSuffix}`}
        label="Téléphone (optionnel)"
        name="phone"
        onChange={onChange}
        type="tel"
        value={formData.phone}
      />
    </>
  )
}

function FormInput({
  id,
  label,
  name,
  onChange,
  required = false,
  type = 'text',
  value,
}: {
  id: string
  label: string
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  type?: string
  value: string
}) {
  return (
    <div className="flex flex-col">
      <label className="font-label-caps text-label-caps text-on-surface-variant mb-xs" htmlFor={id}>
        {label}
      </label>
      <input
        className="border-0 border-b border-neutral bg-white py-3 font-body-md text-on-background w-full focus:ring-0 focus:border-secondary transition-all outline-none"
        id={id}
        name={name}
        required={required}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
