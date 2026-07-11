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
          autoComplete="given-name"
          id={`prenom-${idSuffix}`}
          label="Prénom *"
          name="firstName"
          onChange={onChange}
          placeholder="Votre prénom"
          required
          value={formData.firstName}
        />
        <FormInput
          autoComplete="family-name"
          id={`nom-${idSuffix}`}
          label="Nom *"
          name="lastName"
          onChange={onChange}
          placeholder="Votre nom"
          required
          value={formData.lastName}
        />
      </div>
      <FormInput
        autoComplete="email"
        id={`email-${idSuffix}`}
        label="Email *"
        name="email"
        onChange={onChange}
        placeholder="vous@exemple.com"
        required
        type="email"
        value={formData.email}
      />
      <FormInput
        autoComplete="tel"
        id={`telephone-${idSuffix}`}
        label="Téléphone (optionnel)"
        name="phone"
        onChange={onChange}
        placeholder="Pour vous joindre si besoin"
        type="tel"
        value={formData.phone}
      />
    </>
  )
}

function FormInput({
  autoComplete,
  id,
  label,
  name,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  value,
}: {
  autoComplete: string
  id: string
  label: string
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
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
        autoComplete={autoComplete}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
