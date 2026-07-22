import { ServiceFormField } from '@/components/ui/dashboard/services/service-form-field'

type ServicePriceFieldsProps = {
  inputClassName: string
  price: string
  priceMax: string
  onPriceChange: (price: string) => void
  onPriceMaxChange: (priceMax: string) => void
}

export function ServicePriceFields({
  inputClassName,
  price,
  priceMax,
  onPriceChange,
  onPriceMaxChange,
}: ServicePriceFieldsProps) {
  return (
    <>
      <ServiceFormField label="Prix minimum (€)" htmlFor="price">
        <input
          id="price"
          type="text"
          placeholder="ex: 45 ou 45.50"
          value={price}
          onChange={(event) => onPriceChange(event.target.value)}
          className={inputClassName}
        />
      </ServiceFormField>
      <ServiceFormField label="Prix maximum (€)" htmlFor="price-max" hint="Optionnel">
        <input
          id="price-max"
          type="text"
          placeholder="ex: 80 ou 80.50"
          value={priceMax}
          onChange={(event) => onPriceMaxChange(event.target.value)}
          className={inputClassName}
        />
      </ServiceFormField>
    </>
  )
}
