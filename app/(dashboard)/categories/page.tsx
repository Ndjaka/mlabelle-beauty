import { ServiceCategoriesPage } from '@/components/ui/dashboard/service-categories/service-categories-page'
import { getPaginatedServiceCategories } from '@/features/service-categories/queries'

export const dynamic = 'force-dynamic'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const parsedPage = typeof params.page === 'string' ? Number.parseInt(params.page, 10) : 1
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1
  const result = await getPaginatedServiceCategories({ page, pageSize: 10 })

  return (
    <ServiceCategoriesPage
      categories={result.data}
      total={result.total}
      currentPage={page}
    />
  )
}
