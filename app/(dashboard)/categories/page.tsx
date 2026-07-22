import { ServiceCategoriesPage } from '@/components/ui/dashboard/service-categories/service-categories-page'
import { getAllServiceCategories } from '@/features/service-categories/queries'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const categories = await getAllServiceCategories()

  return <ServiceCategoriesPage categories={categories} />
}
