import { ServiceFormField } from '@/components/ui/dashboard/services/service-form-field'
import type { ServiceCategory } from '@/types/service-category'

type ServiceCategoryFieldProps = {
  categories: ServiceCategory[]
  categoryId: string
  onChange: (categoryId: string) => void
}

const selectClassName = 'w-full border border-outline-variant bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-secondary'

export function ServiceCategoryField({
  categories,
  categoryId,
  onChange,
}: ServiceCategoryFieldProps) {
  return (
    <ServiceFormField label="Catégorie" htmlFor="category">
      <select
        id="category"
        value={categoryId}
        onChange={(event) => onChange(event.target.value)}
        className={selectClassName}
      >
        <option value="">Sélectionner une catégorie</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
    </ServiceFormField>
  )
}
