import { AgendaPage } from '@/components/ui/dashboard/agenda-page'
import { getDashboardData } from '@/features/dashboard/queries'

export default async function Page() {
  const dashboardData = await getDashboardData()

  return <AgendaPage data={dashboardData} />
}
