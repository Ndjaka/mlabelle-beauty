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
        hint="Votre récapitulatif sera envoyé à cette adresse."
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
        hint="Ce numéro permettra à la coiffeuse de vous joindre si nécessaire."
        id={`telephone-${idSuffix}`}
        label="Téléphone *"
        name="phone"
        onChange={onChange}
        placeholder="Votre numéro de téléphone"
        required
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
  hint,
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
  hint?: string
  required?: boolean
  type?: string
  value: string
}) {
  const hintId = hint ? `${id}-hint` : undefined

  return (
    <div className="flex flex-col gap-2">
      <label className="font-label-caps text-[10px] uppercase tracking-[0.18em] text-on-surface-variant" htmlFor={id}>
        {label}
      </label>
      <input
        aria-describedby={hintId}
        autoComplete={autoComplete}
        className="h-14 w-full border border-secondary/15 bg-white px-4 font-body-md text-[15px] text-on-background outline-none transition-all placeholder:text-on-surface-variant/55 focus:border-secondary focus:ring-2 focus:ring-secondary/15"
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
        onChange={onChange}
      />
      {hint && (
        <p id={hintId} className="font-body-md text-[12px] leading-5 text-on-surface-variant">
          {hint}
        </p>
      )}
    </div>
  )
}
