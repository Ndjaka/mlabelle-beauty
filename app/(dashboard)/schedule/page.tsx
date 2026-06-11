import { SchedulePage } from '@/components/ui/dashboard/schedule/schedule-page'
import { getAllDaysOff, getAllScheduleRules } from '@/features/schedule/queries'

export default async function ScheduleRoute() {
  const [rules, daysOff] = await Promise.all([
    getAllScheduleRules(),
    getAllDaysOff(),
  ])

  return <SchedulePage rules={rules} daysOff={daysOff} />
}
