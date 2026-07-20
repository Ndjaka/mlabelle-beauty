import { AgendaPage } from '@/components/ui/dashboard/agenda-page'
import { getActiveServices } from '@/features/booking/queries'
import { getDashboardData } from '@/features/dashboard/queries'
import type { AgendaViewMode } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ date?: string; view?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const { date, view } = await searchParams
  const viewMode: AgendaViewMode = view === 'week' ? 'week' : 'day'
  const [dashboardData, services] = await Promise.all([
    getDashboardData(date, viewMode),
    getActiveServices(),
  ])

  return <AgendaPage data={dashboardData} services={services} />
}
