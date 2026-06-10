import { ServicesPage } from '@/components/ui/dashboard/services-page'
import { getAllServices } from '@/features/services/queries'

export const dynamic = 'force-dynamic'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1
  const search = typeof params.search === 'string' ? params.search : ''
  const statusParam = typeof params.status === 'string' ? params.status : 'all'
  const status = ['all', 'active', 'inactive'].includes(statusParam) ? statusParam as 'all' | 'active' | 'inactive' : 'all'

  const paginatedResult = await getAllServices(page, 10, search, status)

  return (
    <ServicesPage 
      services={paginatedResult.data} 
      total={paginatedResult.total} 
      currentPage={page}
      currentSearch={search}
      currentStatus={status}
    />
  )
}
