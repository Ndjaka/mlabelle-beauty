import { Button } from '@/components/ui/button'
import type { ServiceCategory } from '@/types/service-category'

type ServiceCategoryListProps = {
  categories: ServiceCategory[]
  deletingId: string | null
  onDelete: (category: ServiceCategory) => void
  onEdit: (category: ServiceCategory) => void
}

export function ServiceCategoryList({
  categories,
  deletingId,
  onDelete,
  onEdit,
}: ServiceCategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="border border-dashed border-outline-variant bg-background px-6 py-12 text-center">
        <span className="material-symbols-outlined text-4xl text-secondary" aria-hidden="true">
          category
        </span>
        <h2 className="mt-3 font-serif text-2xl text-foreground">Aucune catégorie</h2>
        <p className="mt-2 text-sm text-foreground/60">Créez votre première catégorie de prestations.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-outline-variant border border-outline-variant bg-background">
      {categories.map((category) => (
        <article
          key={category.id}
          className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between md:px-5"
        >
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center bg-primary text-secondary">
              <span className="material-symbols-outlined" aria-hidden="true">category</span>
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-serif text-xl text-foreground">{category.name}</h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-foreground/50">
                {category.service_count} prestation{category.service_count > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:shrink-0">
            <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
              Modifier
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={category.service_count > 0 || deletingId === category.id}
              title={category.service_count > 0 ? 'Déplacez les prestations avant de supprimer cette catégorie' : undefined}
              onClick={() => onDelete(category)}
            >
              {deletingId === category.id ? 'Suppression…' : 'Supprimer'}
            </Button>
          </div>
        </article>
      ))}
    </div>
  )
}
