import { redirect } from 'next/navigation'
import { getCurrentAuthUser } from '@/features/auth/queries'
import { isAdminUser } from '@/features/auth/utils'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentAuthUser()

  if (!isAdminUser(user)) {
    redirect('/login')
  }

  return <>{children}</>
}
