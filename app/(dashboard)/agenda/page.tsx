import { AgendaPage } from '@/components/ui/dashboard/agenda-page'
import { getDashboardData } from '@/features/dashboard/queries'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const { date } = await searchParams
  const dashboardData = await getDashboardData(date)

  return <AgendaPage data={dashboardData} />
}
