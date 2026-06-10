import { DashboardPreview } from '@/components/ui/dashboard/dashboard-preview'
import { getDashboardData } from '@/features/dashboard/queries'

export default async function DashboardPage() {
  const dashboardData = await getDashboardData()

  return <DashboardPreview data={dashboardData} />
}
