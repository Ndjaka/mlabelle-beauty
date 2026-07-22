'use server'

import { getDashboardReservations } from '@/features/dashboard/queries'
import type { DashboardReservationStatusFilter } from '@/features/dashboard/reservation-filters'
import type { PaginatedDashboardReservations } from '@/types/dashboard'

export async function loadDashboardReservationsPage(input: {
  page: number
  pageSize: number
  search: string
  status: DashboardReservationStatusFilter
}): Promise<PaginatedDashboardReservations> {
  return getDashboardReservations(input)
}
