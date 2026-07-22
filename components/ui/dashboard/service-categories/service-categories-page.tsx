'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DashboardShell } from '@/components/ui/dashboard/dashboard-shell'
import {
  getDashboardMobileNavItems,
  getDashboardNavItems,
} from '@/components/ui/dashboard/dashboard-navigation'
import { ServiceCategoryList } from '@/components/ui/dashboard/service-categories/service-category-list'
import { ServiceCategoryMobileInfiniteList } from '@/components/ui/dashboard/service-categories/service-category-mobile-infinite-list'
import { ServiceCategoryModal } from '@/components/ui/dashboard/service-categories/service-category-modal'
import { ServiceCategoryPagination } from '@/components/ui/dashboard/service-categories/service-category-pagination'
import { deleteServiceCategoryAction } from '@/features/service-categories/actions'
import { formatDashboardDateLabel } from '@/features/dashboard/utils'
import type { ServiceCategory } from '@/types/service-category'

type ServiceCategoriesPageProps = {
  categories: ServiceCategory[]
  total: number
  currentPage: number
}

const ITEMS_PER_PAGE = 10

export function ServiceCategoriesPage({
  categories,
  total,
  currentPage,
}: ServiceCategoriesPageProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))

  function openCreateModal() {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  function openEditModal(category: ServiceCategory) {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  function handleSaved() {
    toast.success(selectedCategory ? 'Catégorie modifiée' : 'Catégorie créée')
    setIsModalOpen(false)
    router.refresh()
  }

  function handleDelete(category: ServiceCategory) {
    if (!window.confirm(`Supprimer la catégorie « ${category.name} » ?`)) return

    setDeletingId(category.id)
    startTransition(async () => {
      const result = await deleteServiceCategoryAction(category.id)
      setDeletingId(null)
      if (!result.success) {
        toast.error(result.error ?? 'Impossible de supprimer la catégorie.')
        return
      }
      toast.success('Catégorie supprimée')
      router.refresh()
    })
  }

  return (
    <DashboardShell
      dateLabel={formatDashboardDateLabel(new Date())}
      navItems={getDashboardNavItems('categories')}
      mobileNavItems={getDashboardMobileNavItems('categories')}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-6 md:px-8 lg:px-10 lg:py-8">
        <header className="flex flex-col gap-5 border-b border-outline-variant pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-caps text-secondary">Configuration</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground md:text-5xl">Catégories</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/65 md:text-base">
              Organisez les prestations du salon pour simplifier leur gestion et la recherche des clientes.
            </p>
          </div>
          <Button onClick={openCreateModal} className="flex w-full gap-2 md:w-auto">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">add</span>
            Nouvelle catégorie
          </Button>
        </header>

        <section className="border border-outline-variant bg-surface-container-low p-4 md:p-6">
          <div className="hidden md:block">
            <ServiceCategoryList
              categories={categories}
              deletingId={deletingId}
              onDelete={handleDelete}
              onEdit={openEditModal}
            />
            <ServiceCategoryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              pageSize={ITEMS_PER_PAGE}
              isPending={isPending}
              onPageChange={(page) => router.push(page > 1 ? `/categories?page=${page}` : '/categories')}
            />
          </div>
          <ServiceCategoryMobileInfiniteList
            initialCategories={categories}
            total={total}
            pageSize={ITEMS_PER_PAGE}
            deletingId={deletingId}
            onDelete={handleDelete}
            onEdit={openEditModal}
          />
        </section>
      </div>

      {isModalOpen && (
        <ServiceCategoryModal
          category={selectedCategory}
          onClose={() => setIsModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </DashboardShell>
  )
}
