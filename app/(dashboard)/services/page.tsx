import { ServicesPage } from '@/components/ui/dashboard/services-page'
import { getAllServices } from '@/features/services/queries'
import { getAllServiceCategories } from '@/features/service-categories/queries'

export const dynamic = 'force-dynamic'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const parsedPage = typeof params.page === 'string' ? Number.parseInt(params.page, 10) : 1
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1
  const search = typeof params.search === 'string' ? params.search : ''
  const statusParam = typeof params.status === 'string' ? params.status : 'all'
  const status = ['all', 'active', 'inactive'].includes(statusParam)
    ? statusParam as 'all' | 'active' | 'inactive'
    : 'all'
  const category = typeof params.category === 'string' ? params.category : ''

  const [paginatedResult, categories] = await Promise.all([
    getAllServices(page, 10, search, status, category),
    getAllServiceCategories(),
  ])

  return (
    <ServicesPage
      services={paginatedResult.data}
      total={paginatedResult.total}
      currentPage={page}
      currentSearch={search}
      currentStatus={status}
      currentCategory={category}
      categories={categories}
    />
  )
}
